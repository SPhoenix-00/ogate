/** AI Factions for the social system. */
export enum FactionId {
  Hegemony = "HEGEMONY",
  Syndicate = "SYNDICATE",
  Covenant = "COVENANT",
  FreeStates = "FREE_STATES",
}

export interface FactionDef {
  id: FactionId;
  name: string;
  description: string;
  color: string;
}

export const FACTION_DEFS: Record<FactionId, FactionDef> = {
  [FactionId.Hegemony]: {
    id: FactionId.Hegemony,
    name: "The Hegemony",
    description: "Militaristic empire. Bonuses to fleet command and combat.",
    color: "#e53935",
  },
  [FactionId.Syndicate]: {
    id: FactionId.Syndicate,
    name: "The Syndicate",
    description: "Commerce-focused. Bonuses to trade, refining, and logistics.",
    color: "#fdd835",
  },
  [FactionId.Covenant]: {
    id: FactionId.Covenant,
    name: "The Covenant",
    description: "Research-driven. Bonuses to OGate science and scanning.",
    color: "#7e57c2",
  },
  [FactionId.FreeStates]: {
    id: FactionId.FreeStates,
    name: "The Free States",
    description: "Decentralized alliance. Bonuses to mining and home system production.",
    color: "#43a047",
  },
};

/** Concordat contract types. */
export enum ContractType {
  EliminatePirates = "ELIMINATE_PIRATES",
  RescueShuttle = "RESCUE_SHUTTLE",
  ScanAnomalies = "SCAN_ANOMALIES",
  DonateResources = "DONATE_RESOURCES",
}

export interface ContractDef {
  type: ContractType;
  name: string;
  description: string;
  commendationReward: number;
  /** Requirements (simplified for Phase 4). */
  targetAmount: number;
}

export const CONTRACT_DEFS: Record<ContractType, ContractDef> = {
  [ContractType.EliminatePirates]: {
    type: ContractType.EliminatePirates,
    name: "Eliminate Pirate Scouts",
    description: "Destroy pirate scout ships near the home system.",
    commendationReward: 10,
    targetAmount: 5,
  },
  [ContractType.RescueShuttle]: {
    type: ContractType.RescueShuttle,
    name: "Rescue Diplomatic Shuttle",
    description: "Locate and escort a stranded diplomatic shuttle to safety.",
    commendationReward: 15,
    targetAmount: 1,
  },
  [ContractType.ScanAnomalies]: {
    type: ContractType.ScanAnomalies,
    name: "Scan Anomalies",
    description: "Perform graviton scans on suspected anomaly sites.",
    commendationReward: 8,
    targetAmount: 3,
  },
  [ContractType.DonateResources]: {
    type: ContractType.DonateResources,
    name: "Donate Resources",
    description: "Contribute ore and biomass to the Concordat defense fund.",
    commendationReward: 12,
    targetAmount: 100,
  },
};

/** Faction research pool milestones. */
export interface FactionMilestone {
  resourcesRequired: number;
  buffDescription: string;
  buffDurationHours: number;
}

export const FACTION_MILESTONES: FactionMilestone[] = [
  { resourcesRequired: 10000, buffDescription: "+10% Mining Yield", buffDurationHours: 24 },
  { resourcesRequired: 50000, buffDescription: "+5% Ship Hull HP", buffDurationHours: 24 },
  { resourcesRequired: 100000, buffDescription: "Exclusive Faction Blueprint Unlock", buffDurationHours: 0 },
];

/** Faction war event structure. */
export interface FactionWarEvent {
  factionA: FactionId;
  factionB: FactionId;
  startTime: number;
  endTime: number;
  objectives: string[];
}

/** Research branch IDs. */
export enum ResearchBranch {
  HomeSystem = "HOME_SYSTEM",
  Blueprint = "BLUEPRINT",
  TechCenter = "TECH_CENTER",
  OGateInc = "OGATE_INC",
}

export interface ResearchNodeDef {
  id: string;
  branch: ResearchBranch;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  costOre: number;
  costBiomass: number;
  costEnergy: number;
  researchTimeSec: number;
  /** Prerequisite research node IDs. */
  prerequisites: string[];
}

export const RESEARCH_TREE: ResearchNodeDef[] = [
  // Home System Research
  { id: "solar_efficiency", branch: ResearchBranch.HomeSystem, name: "Solar Efficiency", description: "Increases solar array output.", level: 0, maxLevel: 5, costOre: 50, costBiomass: 0, costEnergy: 30, researchTimeSec: 600, prerequisites: [] },
  { id: "bio_combustion", branch: ResearchBranch.HomeSystem, name: "Bio-Combustion Output", description: "Increases biomass incinerator energy output.", level: 0, maxLevel: 5, costOre: 30, costBiomass: 50, costEnergy: 20, researchTimeSec: 600, prerequisites: [] },
  { id: "refinery_yields", branch: ResearchBranch.HomeSystem, name: "Refinery Yields", description: "Increases mineral refinery output.", level: 0, maxLevel: 5, costOre: 80, costBiomass: 20, costEnergy: 40, researchTimeSec: 900, prerequisites: ["solar_efficiency"] },
  { id: "diplomatic_protocols", branch: ResearchBranch.HomeSystem, name: "Diplomatic Protocols", description: "Improves faction standing gains.", level: 0, maxLevel: 3, costOre: 40, costBiomass: 40, costEnergy: 40, researchTimeSec: 1200, prerequisites: [] },
  { id: "defense_grids", branch: ResearchBranch.HomeSystem, name: "Automated Defense Grids", description: "Provides home system defenses.", level: 0, maxLevel: 3, costOre: 200, costBiomass: 50, costEnergy: 150, researchTimeSec: 1800, prerequisites: ["refinery_yields"] },

  // Blueprint Research
  { id: "cruiser_hulls", branch: ResearchBranch.Blueprint, name: "Cruiser Hulls", description: "Unlocks cruiser construction.", level: 0, maxLevel: 1, costOre: 300, costBiomass: 100, costEnergy: 200, researchTimeSec: 1800, prerequisites: [] },
  { id: "lancer_chassis", branch: ResearchBranch.Blueprint, name: "Strategic Lancer Chassis", description: "Unlocks strategic lancer construction.", level: 0, maxLevel: 1, costOre: 500, costBiomass: 200, costEnergy: 400, researchTimeSec: 3600, prerequisites: ["cruiser_hulls"] },
  { id: "marine_training", branch: ResearchBranch.Blueprint, name: "Marine Detachment Training", description: "Unlocks marine contingent recruitment.", level: 0, maxLevel: 1, costOre: 100, costBiomass: 150, costEnergy: 50, researchTimeSec: 900, prerequisites: [] },
  { id: "fighter_protocols", branch: ResearchBranch.Blueprint, name: "Fighter Squadron Protocols", description: "Unlocks fighter production.", level: 0, maxLevel: 1, costOre: 80, costBiomass: 40, costEnergy: 60, researchTimeSec: 600, prerequisites: [] },

  // Tech Center
  { id: "fusion_containment", branch: ResearchBranch.TechCenter, name: "Fusion Containment", description: "Enables fusion reactors and lance weapons.", level: 0, maxLevel: 3, costOre: 200, costBiomass: 100, costEnergy: 200, researchTimeSec: 1800, prerequisites: [] },
  { id: "deep_core_lasers", branch: ResearchBranch.TechCenter, name: "Deep Core Mining Lasers", description: "Increases mining yield and unlocks higher ore tiers.", level: 0, maxLevel: 5, costOre: 100, costBiomass: 30, costEnergy: 80, researchTimeSec: 900, prerequisites: [] },
  { id: "polymer_synthesis", branch: ResearchBranch.TechCenter, name: "Polymer Synthesis", description: "Unlocks advanced alloys for ship hulls.", level: 0, maxLevel: 3, costOre: 150, costBiomass: 150, costEnergy: 100, researchTimeSec: 1200, prerequisites: [] },
  { id: "shield_harmonics", branch: ResearchBranch.TechCenter, name: "Shield Harmonics", description: "Improves shield regeneration and damage absorption.", level: 0, maxLevel: 5, costOre: 120, costBiomass: 60, costEnergy: 120, researchTimeSec: 1200, prerequisites: ["fusion_containment"] },
  { id: "compression_tech", branch: ResearchBranch.TechCenter, name: "Compression Technology", description: "Enables cargo compression for hauler logistics.", level: 0, maxLevel: 3, costOre: 100, costBiomass: 80, costEnergy: 60, researchTimeSec: 900, prerequisites: [] },

  // OGate Inc.
  { id: "capacitor_science", branch: ResearchBranch.OGateInc, name: "Capacitor Science", description: "Unlocks 1GW+ capacitor tiers.", level: 0, maxLevel: 3, costOre: 200, costBiomass: 100, costEnergy: 200, researchTimeSec: 1800, prerequisites: [] },
  { id: "entropy_shielding", branch: ResearchBranch.OGateInc, name: "Entropy Shielding", description: "Reduces rift instability and entropy generation.", level: 0, maxLevel: 5, costOre: 150, costBiomass: 50, costEnergy: 150, researchTimeSec: 1200, prerequisites: ["capacitor_science"] },
  { id: "jump_calc_speed", branch: ResearchBranch.OGateInc, name: "Jump Calculation Speed", description: "Faster entry/exit from OGate instances.", level: 0, maxLevel: 3, costOre: 100, costBiomass: 30, costEnergy: 100, researchTimeSec: 900, prerequisites: [] },
  { id: "anomaly_scanning", branch: ResearchBranch.OGateInc, name: "Anomaly Scanning", description: "Better radar resolution for scanning.", level: 0, maxLevel: 5, costOre: 80, costBiomass: 40, costEnergy: 80, researchTimeSec: 600, prerequisites: [] },
];
