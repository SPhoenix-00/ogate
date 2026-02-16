import { rollEscapeDamage, TransponderType } from "@ogate/shared";
import type { PlayerSchema } from "../schemas/PlayerSchema.js";
import type { ShipSchema } from "../schemas/ShipSchema.js";

export interface EscapeResult {
  playerId: string;
  shipsEscaped: Array<{
    shipId: string;
    shipClass: string;
    structuralDamagePercent: number;
    isWreck: boolean;
  }>;
  cargoLost: { ore: number; biomass: number };
  contingentCasualties: Array<{
    contingentId: string;
    casualtyPercent: number;
    wiped: boolean;
  }>;
}

/**
 * Process emergency warp escape for a player.
 * - Cargo is always lost
 * - Each ship rolls for RNG structural damage (0%, 25%, 50%, 100%)
 * - Contingents roll for RNG casualties
 */
export function processEmergencyEscape(player: PlayerSchema): EscapeResult {
  const result: EscapeResult = {
    playerId: player.id,
    shipsEscaped: [],
    cargoLost: { ore: player.cargoOre, biomass: player.cargoBiomass },
    contingentCasualties: [],
  };

  player.cargoOre = 0;
  player.cargoBiomass = 0;

  for (const ship of player.ships) {
    const dmgPercent = rollEscapeDamage();
    const structDmg = Math.round(ship.maxHullHp * dmgPercent);
    ship.hullHp = Math.max(0, ship.hullHp - structDmg);

    result.shipsEscaped.push({
      shipId: ship.id,
      shipClass: ship.shipClass,
      structuralDamagePercent: dmgPercent * 100,
      isWreck: ship.hullHp <= 0,
    });
  }

  return result;
}

/**
 * Determine the transponder type for a ship based on its class.
 * Probes and Interceptors get Standard (unlimited).
 * Heavy ships need Emergency (consumable).
 */
export function getTransponderType(shipClass: string): TransponderType {
  switch (shipClass) {
    case "PROBE":
    case "INTERCEPTOR":
      return TransponderType.Standard;
    default:
      return TransponderType.None;
  }
}
