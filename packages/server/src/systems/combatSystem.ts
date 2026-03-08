import { CombatStance } from "@ogate/shared";
import type { PlayerSchema } from "../schemas/PlayerSchema.js";
import type { ShipSchema } from "../schemas/ShipSchema.js";

export interface CombatOutcome {
  winnerId: string;
  loserId: string;
  winnerDamage: number;
  loserDamage: number;
  rounds: CombatRound[];
}

export interface CombatRound {
  roundNumber: number;
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerShipsLost: string[];
  defenderShipsLost: string[];
}

/**
 * Resolve combat between two players with evasion, point defense, and rounds.
 * Attacker fires first (initiative).
 */
export function resolveCombat(
  attacker: PlayerSchema,
  defender: PlayerSchema,
  attackerStance: CombatStance = CombatStance.Balanced,
  defenderStance: CombatStance = CombatStance.Balanced,
): CombatOutcome {
  const rounds: CombatRound[] = [];
  const maxRounds = 5;

  for (let r = 1; r <= maxRounds; r++) {
    const attackerShips = getLiveShips(attacker);
    const defenderShips = getLiveShips(defender);

    if (attackerShips.length === 0 || defenderShips.length === 0) break;

    const round: CombatRound = {
      roundNumber: r,
      attackerDamageDealt: 0,
      defenderDamageDealt: 0,
      attackerShipsLost: [],
      defenderShipsLost: [],
    };

    const aDmg = applyVolley(attackerShips, defenderShips, attackerStance);
    round.attackerDamageDealt = aDmg.totalDamage;
    round.defenderShipsLost = aDmg.shipsDestroyed;

    const survivingDefenders = getLiveShips(defender);
    if (survivingDefenders.length > 0) {
      const dDmg = applyVolley(survivingDefenders, attackerShips, defenderStance);
      round.defenderDamageDealt = dDmg.totalDamage;
      round.attackerShipsLost = dDmg.shipsDestroyed;
    }

    rounds.push(round);
  }

  const attackerHP = totalHullHp(attacker);
  const defenderHP = totalHullHp(defender);
  const attackerWins = attackerHP > 0 || defenderHP <= 0;

  const totalAttackerDmg = rounds.reduce((s, r) => s + r.defenderDamageDealt, 0);
  const totalDefenderDmg = rounds.reduce((s, r) => s + r.attackerDamageDealt, 0);

  return {
    winnerId: attackerWins ? attacker.id : defender.id,
    loserId: attackerWins ? defender.id : attacker.id,
    winnerDamage: attackerWins ? totalAttackerDmg : totalDefenderDmg,
    loserDamage: attackerWins ? totalDefenderDmg : totalAttackerDmg,
    rounds,
  };
}

interface VolleyResult {
  totalDamage: number;
  shipsDestroyed: string[];
}

function applyVolley(
  attackers: ShipSchema[],
  defenders: ShipSchema[],
  stance: CombatStance,
): VolleyResult {
  let totalDamage = 0;
  const shipsDestroyed: string[] = [];

  const totalFP = attackers.reduce((s, ship) => s + ship.firepower, 0);
  const stanceMult = stance === CombatStance.FocusFire ? 1.2 : 1.0;
  let remainingDamage = totalFP * stanceMult;

  const targetOrder = stance === CombatStance.ProtectHaulers
    ? [...defenders].sort((a, b) => a.mass - b.mass)
    : [...defenders];

  for (const target of targetOrder) {
    if (remainingDamage <= 0) break;
    if (target.hullHp <= 0) continue;

    const evasionChance = parseFloat((target as unknown as Record<string, string>).evasion ?? "0") || 0;
    if (Math.random() < evasionChance) continue;

    const actualDmg = Math.min(target.hullHp, remainingDamage);
    target.hullHp -= actualDmg;
    remainingDamage -= actualDmg;
    totalDamage += actualDmg;

    if (target.hullHp <= 0) {
      shipsDestroyed.push(target.id);
    }
  }

  return { totalDamage, shipsDestroyed };
}

function getLiveShips(player: PlayerSchema): ShipSchema[] {
  const ships: ShipSchema[] = [];
  for (const ship of player.ships) {
    if (ship.hullHp > 0) ships.push(ship);
  }
  return ships;
}

function totalHullHp(player: PlayerSchema): number {
  let hp = 0;
  for (const ship of player.ships) {
    hp += ship.hullHp;
  }
  return hp;
}
