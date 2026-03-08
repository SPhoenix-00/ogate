/**
 * Message types exchanged between client and server over WebSocket.
 * Client sends commands; server broadcasts events and state patches.
 *
 * Colyseus schema sync handles the room state automatically.
 * These messages cover discrete events that need explicit payloads
 * beyond what the schema patch conveys (scan results, combat outcomes,
 * proximity alerts, etc.).
 */

import type {
  CapacitorTier,
  CombatStance,
  CombatResult,
  EntropyAction,
  EscapeResult,
  ResourceType,
  ScanResult,
} from "./types.js";

// ── Client → Server ──────────────────────────────────────

export enum ClientMessage {
  /** Request an OGate instance (sent from Home/lobby). */
  ActivateOGate = "activate_ogate",
  /** Begin point-to-point warp to a target node. */
  WarpToNode = "warp_to_node",
  /** Fire a graviton scan pulse (broadcasts location to all). */
  InitiateScan = "initiate_scan",
  /** Set pre-combat rules of engagement. */
  SetCombatStance = "set_combat_stance",
  /** Lock and engage a target fleet at the same node. */
  Attack = "attack",
  /** Begin resource extraction cycle at the current node. */
  ExtractResources = "extract_resources",
  /** Collect already-exposed loot at the current node. */
  LootNode = "loot_node",
  /** Open OGate connection at the player's exit frame. */
  InitiateExit = "initiate_exit",
  /** Panic button — activate transponder for emergency escape. */
  EmergencyWarp = "emergency_warp",
}

// ── Client payloads ──────────────────────────────────────

export interface ActivateOGatePayload {
  capacitorTier: CapacitorTier;
}

export interface WarpToNodePayload {
  targetNodeId: string;
}

export interface SetCombatStancePayload {
  stance: CombatStance;
}

export interface AttackPayload {
  targetPlayerId: string;
  stance?: CombatStance;
}

export interface ExtractResourcesPayload {
  nodeId: string;
  resourceType: ResourceType;
}

export interface LootNodePayload {
  nodeId: string;
}

// EmergencyWarp and InitiateScan carry no payload.
// InitiateExit carries no payload (server knows the player's exit frame).

// ── Server → Client ──────────────────────────────────────

export enum ServerMessage {
  /** Full state sync on join (Colyseus handles schema, this adds metadata). */
  InstanceSync = "instance_sync",

  // ── Entropy ──
  /** Discrete entropy change notification (supplements schema sync). */
  EntropyUpdate = "entropy_update",

  // ── Players ──
  PlayerUpdate = "player_update",
  PlayerJoined = "player_joined",
  PlayerLeft = "player_left",

  // ── Movement ──
  WarpStarted = "warp_started",
  WarpComplete = "warp_complete",
  ProximityAlert = "proximity_alert",

  // ── Scanning ──
  ScanResults = "scan_results",
  /** Alert broadcast to all OTHER players when someone pings. */
  ScanAlert = "scan_alert",

  // ── Visibility ──
  /** Local visibility: another fleet is at your node. */
  FleetVisible = "fleet_visible",

  // ── Combat ──
  CombatResolved = "combat_resolved",

  // ── Extraction / Loot ──
  /** Resources collected from a node. */
  LootCollected = "loot_collected",
  /** A node's resource deposit is now empty. */
  NodeDepleted = "node_depleted",

  // ── Exit / Escape ──
  ExitSpoolStarted = "exit_spool_started",
  ExitComplete = "exit_complete",
  EmergencyWarpResult = "emergency_warp_result",

  // ── Instance lifecycle ──
  InstanceCollapse = "instance_collapse",

  // ── Errors ──
  Error = "error",
}

// ── Server payloads ──────────────────────────────────────

export interface EntropyUpdatePayload {
  /** Current entropy percentage (0–100). */
  entropy: number;
  /** Signed delta from previous value. */
  delta: number;
  /** What triggered the change. */
  source: EntropyAction;
}

export interface PlayerJoinedPayload {
  playerId: string;
  playerName: string;
  nodeId: string;
}

export interface PlayerLeftPayload {
  playerId: string;
}

export interface WarpStartedPayload {
  playerId: string;
  targetNodeId: string;
  /** Unix-ms timestamp when the warp will complete. */
  arrivalTime: number;
}

export interface WarpCompletePayload {
  playerId: string;
  nodeId: string;
}

export interface ProximityAlertPayload {
  incomingPlayerId: string;
  /** Milliseconds until arrival. */
  etaMs: number;
}

export interface ScanResultsPayload {
  results: ScanResult[];
}

export interface ScanAlertPayload {
  /** Node the scanner was at when the pulse fired. */
  scannerNodeId: string;
  scannerPlayerId: string;
}

export interface FleetVisiblePayload {
  playerId: string;
  shipCount: number;
  totalMass: number;
}

export interface CombatResolvedPayload {
  result: CombatResult;
}

export interface LootCollectedPayload {
  nodeId: string;
  resourceType: ResourceType;
  amount: number;
}

export interface NodeDepletedPayload {
  nodeId: string;
}

export interface ExitSpoolStartedPayload {
  playerId: string;
  /** Duration in ms before exit completes. */
  spoolDurationMs: number;
}

export interface ExitCompletePayload {
  playerId: string;
  cargo: Partial<Record<ResourceType, number>>;
}

export interface EmergencyWarpResultPayload {
  result: EscapeResult;
}

export interface InstanceCollapsePayload {
  reason: string;
}

export interface ErrorPayload {
  /** Machine-readable error code for client-side branching. */
  code?: string;
  message: string;
}
