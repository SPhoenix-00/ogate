/**
 * Core type definitions for the OGate data contract.
 * Shared between client and server — nothing here should import
 * platform-specific modules (Colyseus, Phaser, etc.).
 */

// ── Enums ────────────────────────────────────────────────

/** Capacitor tier determines instance size, mass budget, and PvP density. */
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
  Nebulite = "NEBULITE",
  Artifacts = "ARTIFACTS",
}

/** Refined tier for ore → minerals pipeline. */
export enum OreTier {
  Common = 1,
  Uncommon = 2,
  Rare = 3,
  Precious = 4,
  Exotic = 5,
}

/** Node types found inside an OGate instance. */
export enum NodeType {
  Planet = "PLANET",
  AsteroidBelt = "ASTEROID_BELT",
  GasCloud = "GAS_CLOUD",
  Station = "STATION",
  ExitFrame = "EXIT_FRAME",
  Anomaly = "ANOMALY",
  RadarStation = "RADAR_STATION",
  QuestInstance = "QUEST_INSTANCE",
}

/** Player state within an OGate instance. */
export enum PlayerInstanceState {
  Idle = "IDLE",
  Warping = "WARPING",
  Scanning = "SCANNING",
  InCombat = "IN_COMBAT",
  Extracting = "EXTRACTING",
  SpoolingExit = "SPOOLING_EXIT",
  EmergencyWarping = "EMERGENCY_WARPING",
  Exited = "EXITED",
}

/** Instance lifecycle state. */
export enum InstanceState {
  Active = "ACTIVE",
  Collapsed = "COLLAPSED",
  Despawned = "DESPAWNED",
}

/**
 * Combat stances set by a player before engagement.
 * Determines targeting priority and damage modifiers.
 */
export enum CombatStance {
  FocusFire = "FOCUS_FIRE",
  ProtectHaulers = "PROTECT_HAULERS",
  Balanced = "BALANCED",
}

/** Swappable modules for Industrial Barge hulls. */
export enum BargeModule {
  DeepCoreLasers = "DEEP_CORE_LASERS",
  BioScytheArrays = "BIO_SCYTHE_ARRAYS",
  NebuliteScoops = "NEBULITE_SCOOPS",
  CompressionCore = "COMPRESSION_CORE",
}

/** Swappable subsystems for Strategic Lancer hulls. */
export enum LancerModule {
  Command = "COMMAND",
  FusionLance = "FUSION_LANCE",
  EWSuite = "EW_SUITE",
  LogisticsArray = "LOGISTICS_ARRAY",
  MissileBatteries = "MISSILE_BATTERIES",
}

/**
 * Tagged action type for entropy deductions.
 * Every action that draws from the shared entropy pool uses one of these.
 */
export enum EntropyAction {
  FleetEntry = "FLEET_ENTRY",
  Warp = "WARP",
  Scan = "SCAN",
  Combat = "COMBAT",
  Loot = "LOOT",
  Extract = "EXTRACT",
  PassiveDecay = "PASSIVE_DECAY",
}

// ── Data interfaces ──────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Runtime representation of a single ship inside an instance.
 * Static blueprint data (cost, build time) lives in fleet.ts;
 * this is the mutable combat/movement state.
 */
export interface ShipData {
  id: string;
  shipClass: ShipClass;
  hullHp: number;
  maxHullHp: number;
  firepower: number;
  mass: number;
  evasion: number;
  pointDefense: number;
  cargoCapacity: number;
  fighterCapacity: number;
}

export interface FleetData {
  ships: ShipData[];
  totalMass: number;
}

/** Cargo a player is carrying inside an instance (lootable on death). */
export interface CargoHold {
  [ResourceType.Ore]: number;
  [ResourceType.Biomass]: number;
  [ResourceType.Nebulite]: number;
  [ResourceType.Nanites]: number;
  [ResourceType.Artifacts]: number;
}

export interface InstanceNodeData {
  id: string;
  type: NodeType;
  name: string;
  position: Vec2;
  /** Resources available for extraction/looting at this node. */
  lootTable?: Partial<Record<ResourceType, number>>;
}

export interface PlayerResources {
  ore: number;
  biomass: number;
  energy: number;
  nanites: number;
  nebulite: number;
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

// ── Scan ─────────────────────────────────────────────────

/**
 * A single hit from a graviton scan pulse.
 * Collimation: large fleets lock in 1 ping, small ships need multiple.
 * Each ping broadcasts the scanner's location to the entire instance.
 */
export interface ScanResult {
  nodeId: string;
  position: Vec2;
  /** Fleet mass of the detected target. */
  rippleMagnitude: number;
  /** Threat level 1–5 based on aggregate firepower. */
  threatAssessment: number;
  /** True when enough pings have collimated a full warp solution. */
  hasWarpSolution: boolean;
  /** Total pings needed for a lock on this target. */
  pingsRequired: number;
}

// ── Combat ───────────────────────────────────────────────

/** Per-round breakdown of an automated combat engagement. */
export interface CombatRound {
  roundNumber: number;
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerShipsLost: string[];
  defenderShipsLost: string[];
}

/** Full result of a resolved combat engagement. */
export interface CombatResult {
  winnerId: string;
  loserId: string;
  winnerDamage: number;
  loserDamage: number;
  rounds: CombatRound[];
  lootDropped: Partial<Record<ResourceType, number>>;
}

// ── Transponder / Emergency Warp ─────────────────────────

/** Damage report for a single ship after an emergency warp. */
export interface EscapeDamageReport {
  shipId: string;
  shipClass: ShipClass;
  /** 0, 25, 50, or 100 — RNG structural damage tier. */
  structuralDamagePercent: number;
  isWreck: boolean;
}

/** Full result of an emergency warp (transponder activation). */
export interface EscapeResult {
  playerId: string;
  shipsEscaped: EscapeDamageReport[];
  cargoLost: Partial<Record<ResourceType, number>>;
  contingentCasualties: Array<{
    contingentId: string;
    casualtyPercent: number;
    wiped: boolean;
  }>;
}
