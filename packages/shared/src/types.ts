/** Capacitor tier determines instance size and mass budget. */
export enum CapacitorTier {
  MW1 = "1MW",
  GW1 = "1GW",
  Void = "VOID",
}

/** Ship class identifiers. */
export enum ShipClass {
  Probe = "PROBE",
  Fighter = "FIGHTER",
  Hauler = "HAULER",
  IndustrialBarge = "INDUSTRIAL_BARGE",
  Interceptor = "INTERCEPTOR",
  Backbone = "BACKBONE",
  Cruiser = "CRUISER",
  Capital = "CAPITAL",
  StrategicLancer = "STRATEGIC_LANCER",
}

/** Resource types available in the game. */
export enum ResourceType {
  Ore = "ORE",
  Biomass = "BIOMASS",
  Energy = "ENERGY",
  Nanites = "NANITES",
  Artifacts = "ARTIFACTS",
}

/** Node types found inside an OGate instance. */
export enum NodeType {
  Planet = "PLANET",
  AsteroidBelt = "ASTEROID_BELT",
  GasCloud = "GAS_CLOUD",
  Station = "STATION",
  ExitFrame = "EXIT_FRAME",
}

/** Player state within an OGate instance. */
export enum PlayerInstanceState {
  Idle = "IDLE",
  Warping = "WARPING",
  Scanning = "SCANNING",
  InCombat = "IN_COMBAT",
  SpoolingExit = "SPOOLING_EXIT",
  Exited = "EXITED",
}

/** Instance lifecycle state. */
export enum InstanceState {
  Active = "ACTIVE",
  Collapsed = "COLLAPSED",
  Despawned = "DESPAWNED",
}

// ── Data interfaces ──────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

export interface ShipData {
  id: string;
  shipClass: ShipClass;
  hullHp: number;
  maxHullHp: number;
  firepower: number;
  mass: number;
}

export interface FleetData {
  ships: ShipData[];
  totalMass: number;
}

export interface InstanceNodeData {
  id: string;
  type: NodeType;
  name: string;
  position: Vec2;
  /** Resources available for looting at this node. */
  lootTable?: Partial<Record<ResourceType, number>>;
}

export interface PlayerResources {
  ore: number;
  biomass: number;
  energy: number;
  nanites: number;
  artifacts: number;
  capacitors1MW: number;
  capacitors1GW: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  resources: PlayerResources;
  fleet: FleetData;
}

export interface ScanResult {
  nodeId: string;
  position: Vec2;
  rippleMagnitude: number;
  threatAssessment: number;
}

export interface CombatResult {
  winnerId: string;
  loserId: string;
  winnerLosses: ShipData[];
  loserLosses: ShipData[];
  lootDropped: Partial<Record<ResourceType, number>>;
}
