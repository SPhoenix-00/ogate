import { ShipClass } from "./types.js";

/** Full ship blueprint definitions for all classes. */
export interface ShipBlueprint {
  shipClass: ShipClass;
  name: string;
  hullHp: number;
  firepower: number;
  mass: number;
  /** Max cargo capacity (resource units). */
  cargoCapacity: number;
  /** Can this ship use the OGate independently? */
  canJumpIndependently: boolean;
  /** Number of fighters this ship can carry (0 for non-carriers). */
  fighterCapacity: number;
  /** Evasion rating 0-1. Chance to dodge incoming fire. */
  evasion: number;
  /** Point defense value. Effective against fighters. */
  pointDefense: number;
  /** Does this ship get a Standard Transponder (unlimited) by default? */
  hasStandardTransponder: boolean;
  /** Build cost */
  costOre: number;
  costBiomass: number;
  costEnergy: number;
  buildTimeSec: number;
  /** Minimum shipyard level required. */
  minShipyardLevel: number;
}

export const SHIP_BLUEPRINTS: Record<ShipClass, ShipBlueprint> = {
  [ShipClass.Probe]: {
    shipClass: ShipClass.Probe,
    name: "Probe",
    hullHp: 50, firepower: 10, mass: 5, cargoCapacity: 10,
    canJumpIndependently: true, fighterCapacity: 0,
    evasion: 0.3, pointDefense: 0,
    hasStandardTransponder: true,
    costOre: 30, costBiomass: 10, costEnergy: 15, buildTimeSec: 30,
    minShipyardLevel: 1,
  },
  [ShipClass.Fighter]: {
    shipClass: ShipClass.Fighter,
    name: "Fighter",
    hullHp: 20, firepower: 8, mass: 1, cargoCapacity: 0,
    canJumpIndependently: false, fighterCapacity: 0,
    evasion: 0.6, pointDefense: 0,
    hasStandardTransponder: false,
    costOre: 15, costBiomass: 5, costEnergy: 10, buildTimeSec: 15,
    minShipyardLevel: 1,
  },
  [ShipClass.Hauler]: {
    shipClass: ShipClass.Hauler,
    name: "Hauler",
    hullHp: 80, firepower: 5, mass: 20, cargoCapacity: 200,
    canJumpIndependently: true, fighterCapacity: 0,
    evasion: 0.05, pointDefense: 0,
    hasStandardTransponder: false,
    costOre: 80, costBiomass: 30, costEnergy: 40, buildTimeSec: 90,
    minShipyardLevel: 2,
  },
  [ShipClass.IndustrialBarge]: {
    shipClass: ShipClass.IndustrialBarge,
    name: "Industrial Barge",
    hullHp: 100, firepower: 5, mass: 25, cargoCapacity: 150,
    canJumpIndependently: true, fighterCapacity: 0,
    evasion: 0.03, pointDefense: 0,
    hasStandardTransponder: false,
    costOre: 100, costBiomass: 40, costEnergy: 50, buildTimeSec: 120,
    minShipyardLevel: 3,
  },
  [ShipClass.Interceptor]: {
    shipClass: ShipClass.Interceptor,
    name: "Interceptor",
    hullHp: 80, firepower: 25, mass: 10, cargoCapacity: 20,
    canJumpIndependently: true, fighterCapacity: 0,
    evasion: 0.4, pointDefense: 2,
    hasStandardTransponder: true,
    costOre: 60, costBiomass: 20, costEnergy: 30, buildTimeSec: 60,
    minShipyardLevel: 2,
  },
  [ShipClass.Backbone]: {
    shipClass: ShipClass.Backbone,
    name: "Backbone (Light Carrier)",
    hullHp: 60, firepower: 0, mass: 12, cargoCapacity: 5,
    canJumpIndependently: true, fighterCapacity: 12,
    evasion: 0.1, pointDefense: 0,
    hasStandardTransponder: false,
    costOre: 70, costBiomass: 25, costEnergy: 35, buildTimeSec: 75,
    minShipyardLevel: 3,
  },
  [ShipClass.Cruiser]: {
    shipClass: ShipClass.Cruiser,
    name: "Cruiser",
    hullHp: 200, firepower: 50, mass: 40, cargoCapacity: 80,
    canJumpIndependently: true, fighterCapacity: 0,
    evasion: 0.1, pointDefense: 5,
    hasStandardTransponder: false,
    costOre: 200, costBiomass: 80, costEnergy: 100, buildTimeSec: 300,
    minShipyardLevel: 5,
  },
  [ShipClass.Capital]: {
    shipClass: ShipClass.Capital,
    name: "Capital Ship",
    hullHp: 500, firepower: 100, mass: 150, cargoCapacity: 300,
    canJumpIndependently: true, fighterCapacity: 200,
    evasion: 0.02, pointDefense: 15,
    hasStandardTransponder: false,
    costOre: 800, costBiomass: 300, costEnergy: 500, buildTimeSec: 900,
    minShipyardLevel: 8,
  },
  [ShipClass.StrategicLancer]: {
    shipClass: ShipClass.StrategicLancer,
    name: "Strategic Lancer",
    hullHp: 300, firepower: 80, mass: 60, cargoCapacity: 50,
    canJumpIndependently: true, fighterCapacity: 0,
    evasion: 0.08, pointDefense: 8,
    hasStandardTransponder: false,
    costOre: 500, costBiomass: 200, costEnergy: 300, buildTimeSec: 600,
    minShipyardLevel: 7,
  },
};

/** Contingent types for RPG layer. */
export enum ContingentType {
  Marine = "MARINE",
  Engineer = "ENGINEER",
  Research = "RESEARCH",
}

export interface ContingentDef {
  type: ContingentType;
  name: string;
  description: string;
  maxStrength: number;
  recruitCostBiomass: number;
  recruitTimeSec: number;
}

export const CONTINGENT_DEFS: Record<ContingentType, ContingentDef> = {
  [ContingentType.Marine]: {
    type: ContingentType.Marine,
    name: "Marine Detachment",
    description: "Boarding actions, repelling boarders, raiding outposts.",
    maxStrength: 100,
    recruitCostBiomass: 50,
    recruitTimeSec: 120,
  },
  [ContingentType.Engineer]: {
    type: ContingentType.Engineer,
    name: "Engineering Corps",
    description: "Salvaging wreckage, emergency hull repairs, artifact stabilization.",
    maxStrength: 60,
    recruitCostBiomass: 40,
    recruitTimeSec: 100,
  },
  [ContingentType.Research]: {
    type: ContingentType.Research,
    name: "Research Team",
    description: "Exploring hazardous derelicts and analyzing ruins without triggering traps.",
    maxStrength: 40,
    recruitCostBiomass: 30,
    recruitTimeSec: 80,
  },
};

/** Transponder types. */
export enum TransponderType {
  Standard = "STANDARD",
  Emergency = "EMERGENCY",
  None = "NONE",
}

/** RNG damage tiers for emergency warp escape. */
export const ESCAPE_DAMAGE_TIERS = [0, 0.25, 0.5, 1.0];

/** Roll escape damage for a single asset. */
export function rollEscapeDamage(): number {
  return ESCAPE_DAMAGE_TIERS[Math.floor(Math.random() * ESCAPE_DAMAGE_TIERS.length)];
}

/** Calculate the fleet's total mass (ships + fighters + cargo, modules/specialists are weightless). */
export function calculateFleetMass(
  ships: Array<{ mass: number }>,
  fighters: number,
  cargoWeight: number,
): number {
  let total = 0;
  for (const ship of ships) total += ship.mass;
  total += fighters * 1;
  total += cargoWeight;
  return total;
}

/**
 * Collimation: number of pings required to lock a target based on mass.
 * Large = 1 ping, medium = 2, small = 3+
 */
export function getPingsRequiredForLock(targetMass: number): number {
  if (targetMass >= 40) return 1;
  if (targetMass >= 15) return 2;
  return 3;
}

/**
 * Proximity alert base time adjusted by incoming ship mass.
 */
export function getProximityAlertMs(incomingMass: number, baseMsDefault: number = 20000): number {
  if (incomingMass >= 100) return baseMsDefault * 2.5;
  if (incomingMass >= 40) return baseMsDefault * 1.5;
  return baseMsDefault;
}
