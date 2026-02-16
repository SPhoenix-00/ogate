/** Building types in the Home System. */
export enum BuildingType {
  DeepCoreDrill = "DEEP_CORE_DRILL",
  BioHarvester = "BIO_HARVESTER",
  SolarArray = "SOLAR_ARRAY",
  BiomassIncinerator = "BIOMASS_INCINERATOR",
  FusionReactor = "FUSION_REACTOR",
  MineralRefinery = "MINERAL_REFINERY",
  BioProcessor = "BIO_PROCESSOR",
  ComponentFactory = "COMPONENT_FACTORY",
  Shipyard = "SHIPYARD",
  OGateControlCenter = "OGATE_CONTROL_CENTER",
  Barracks = "BARRACKS",
}

/** Skill categories for the training queue. */
export enum SkillId {
  MiningProficiency = "MINING_PROFICIENCY",
  HarvestingSkill = "HARVESTING_SKILL",
  WormholePhysics = "WORMHOLE_PHYSICS",
  FleetCommand = "FLEET_COMMAND",
  WormholeNavigation = "WORMHOLE_NAVIGATION",
  SensorAnalysis = "SENSOR_ANALYSIS",
  Engineering = "ENGINEERING",
}

/** Static definition of a building tier. */
export interface BuildingDef {
  type: BuildingType;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: { ore: number; biomass: number; energy: number };
  /** Cost multiplier per level (exponential). */
  costMultiplier: number;
  /** Base construction time in seconds. */
  baseTimeSec: number;
}

/** Static definition of a trainable skill. */
export interface SkillDef {
  id: SkillId;
  name: string;
  description: string;
  maxLevel: number;
  /** Time to train 1 level in seconds. */
  baseTrainTimeSec: number;
  /** Train time multiplier per level. */
  timeMultiplier: number;
}

/** Production rates per building level for extraction buildings. */
export interface ProductionRate {
  ore?: number;
  biomass?: number;
  energy?: number;
}

// ── Building Definitions ────────────────────────────────

export const BUILDING_DEFS: Record<BuildingType, BuildingDef> = {
  [BuildingType.DeepCoreDrill]: {
    type: BuildingType.DeepCoreDrill,
    name: "Deep Core Drill",
    description: "Extracts ore from planetary deposits. Higher levels unlock higher ore tiers.",
    maxLevel: 10,
    baseCost: { ore: 50, biomass: 0, energy: 20 },
    costMultiplier: 1.5,
    baseTimeSec: 60,
  },
  [BuildingType.BioHarvester]: {
    type: BuildingType.BioHarvester,
    name: "Bio-Harvester",
    description: "Gathers biomass from the local ecosystem. Regenerates over time.",
    maxLevel: 10,
    baseCost: { ore: 30, biomass: 20, energy: 10 },
    costMultiplier: 1.5,
    baseTimeSec: 45,
  },
  [BuildingType.SolarArray]: {
    type: BuildingType.SolarArray,
    name: "Solar Array",
    description: "Passive, maintenance-free energy generation. Limited by orbital surface area.",
    maxLevel: 8,
    baseCost: { ore: 40, biomass: 0, energy: 0 },
    costMultiplier: 1.6,
    baseTimeSec: 30,
  },
  [BuildingType.BiomassIncinerator]: {
    type: BuildingType.BiomassIncinerator,
    name: "Biomass Incinerator",
    description: "Burns biomass for high-output energy. Trade-off: less biomass for refining.",
    maxLevel: 8,
    baseCost: { ore: 60, biomass: 40, energy: 10 },
    costMultiplier: 1.5,
    baseTimeSec: 50,
  },
  [BuildingType.FusionReactor]: {
    type: BuildingType.FusionReactor,
    name: "Fusion Reactor",
    description: "Massive energy output for late-game. Requires Nebulite fuel from OGate.",
    maxLevel: 5,
    baseCost: { ore: 200, biomass: 100, energy: 100 },
    costMultiplier: 2.0,
    baseTimeSec: 300,
  },
  [BuildingType.MineralRefinery]: {
    type: BuildingType.MineralRefinery,
    name: "Mineral Refinery",
    description: "Processes ore into refined minerals. Higher levels yield rarer mineral tiers.",
    maxLevel: 10,
    baseCost: { ore: 80, biomass: 0, energy: 30 },
    costMultiplier: 1.5,
    baseTimeSec: 90,
  },
  [BuildingType.BioProcessor]: {
    type: BuildingType.BioProcessor,
    name: "Bio-Processor",
    description: "Converts biomass into nutrients (upkeep) and polymers (construction).",
    maxLevel: 10,
    baseCost: { ore: 40, biomass: 60, energy: 20 },
    costMultiplier: 1.5,
    baseTimeSec: 75,
  },
  [BuildingType.ComponentFactory]: {
    type: BuildingType.ComponentFactory,
    name: "Component Factory",
    description: "Combines polymers and minerals into advanced alloys and tech components.",
    maxLevel: 8,
    baseCost: { ore: 100, biomass: 50, energy: 50 },
    costMultiplier: 1.6,
    baseTimeSec: 120,
  },
  [BuildingType.Shipyard]: {
    type: BuildingType.Shipyard,
    name: "Shipyard",
    description: "Constructs and repairs ship hulls. Higher levels unlock larger ship classes.",
    maxLevel: 10,
    baseCost: { ore: 120, biomass: 30, energy: 60 },
    costMultiplier: 1.7,
    baseTimeSec: 150,
  },
  [BuildingType.OGateControlCenter]: {
    type: BuildingType.OGateControlCenter,
    name: "OGate Control Center",
    description: "The heart of the game. Upgrading unlocks higher-tier capacitors.",
    maxLevel: 5,
    baseCost: { ore: 150, biomass: 50, energy: 100 },
    costMultiplier: 2.0,
    baseTimeSec: 300,
  },
  [BuildingType.Barracks]: {
    type: BuildingType.Barracks,
    name: "Barracks",
    description: "Recruits and replenishes Expeditionary Contingents (Marines, Engineers, Researchers).",
    maxLevel: 8,
    baseCost: { ore: 60, biomass: 80, energy: 20 },
    costMultiplier: 1.5,
    baseTimeSec: 90,
  },
};

// ── Skill Definitions ───────────────────────────────────

export const SKILL_DEFS: Record<SkillId, SkillDef> = {
  [SkillId.MiningProficiency]: {
    id: SkillId.MiningProficiency,
    name: "Mining Proficiency",
    description: "Decreases cycle time of mining lasers.",
    maxLevel: 5,
    baseTrainTimeSec: 3600,
    timeMultiplier: 1.5,
  },
  [SkillId.HarvestingSkill]: {
    id: SkillId.HarvestingSkill,
    name: "Harvesting Skill",
    description: "Increases biomass harvesting yield.",
    maxLevel: 5,
    baseTrainTimeSec: 3600,
    timeMultiplier: 1.5,
  },
  [SkillId.WormholePhysics]: {
    id: SkillId.WormholePhysics,
    name: "Wormhole Physics",
    description: "Reduces the amount of Entropy a ship generates.",
    maxLevel: 5,
    baseTrainTimeSec: 7200,
    timeMultiplier: 1.8,
  },
  [SkillId.FleetCommand]: {
    id: SkillId.FleetCommand,
    name: "Fleet Command",
    description: "Increases the maximum number of ships controllable in a sortie.",
    maxLevel: 5,
    baseTrainTimeSec: 7200,
    timeMultiplier: 2.0,
  },
  [SkillId.WormholeNavigation]: {
    id: SkillId.WormholeNavigation,
    name: "Wormhole Navigation",
    description: "Reduces exfiltration spool-up time.",
    maxLevel: 5,
    baseTrainTimeSec: 5400,
    timeMultiplier: 1.6,
  },
  [SkillId.SensorAnalysis]: {
    id: SkillId.SensorAnalysis,
    name: "Sensor Analysis",
    description: "Extends the Detection Horizon for earlier proximity alerts.",
    maxLevel: 5,
    baseTrainTimeSec: 5400,
    timeMultiplier: 1.6,
  },
  [SkillId.Engineering]: {
    id: SkillId.Engineering,
    name: "Engineering",
    description: "Reduces severity of module damage and specialist injury on emergency warp.",
    maxLevel: 5,
    baseTrainTimeSec: 5400,
    timeMultiplier: 1.6,
  },
};

/** Calculate the cost for upgrading a building to a given level. */
export function getBuildingUpgradeCost(def: BuildingDef, targetLevel: number): { ore: number; biomass: number; energy: number } {
  const mult = Math.pow(def.costMultiplier, targetLevel - 1);
  return {
    ore: Math.round(def.baseCost.ore * mult),
    biomass: Math.round(def.baseCost.biomass * mult),
    energy: Math.round(def.baseCost.energy * mult),
  };
}

/** Calculate the construction time (seconds) for a building at target level. */
export function getBuildingUpgradeTime(def: BuildingDef, targetLevel: number): number {
  return Math.round(def.baseTimeSec * Math.pow(def.costMultiplier, targetLevel - 1));
}

/** Calculate the training time (seconds) for a skill at target level. */
export function getSkillTrainTime(def: SkillDef, targetLevel: number): number {
  return Math.round(def.baseTrainTimeSec * Math.pow(def.timeMultiplier, targetLevel - 1));
}

/** Hourly production rate for a resource-producing building at a given level. */
export function getProductionPerHour(type: BuildingType, level: number): ProductionRate {
  if (level <= 0) return {};
  switch (type) {
    case BuildingType.DeepCoreDrill:
      return { ore: 20 * level };
    case BuildingType.BioHarvester:
      return { biomass: 15 * level };
    case BuildingType.SolarArray:
      return { energy: 10 * level };
    case BuildingType.BiomassIncinerator:
      return { energy: 25 * level };
    case BuildingType.FusionReactor:
      return { energy: 100 * level };
    default:
      return {};
  }
}

/** Max skill queue duration in seconds (24 hours). */
export const SKILL_QUEUE_MAX_SECONDS = 86400;
