/**
 * Message types exchanged between client and server over WebSocket.
 * Client sends inputs; server broadcasts state patches.
 */

import type { CapacitorTier, ScanResult, CombatResult } from "./types.js";

// ── Client → Server ──────────────────────────────────────

export enum ClientMessage {
  ActivateOGate = "activate_ogate",
  WarpToNode = "warp_to_node",
  InitiateScan = "initiate_scan",
  Attack = "attack",
  InitiateExit = "initiate_exit",
  LootNode = "loot_node",
}

export interface ActivateOGatePayload {
  capacitorTier: CapacitorTier;
}

export interface WarpToNodePayload {
  targetNodeId: string;
}

export interface AttackPayload {
  targetPlayerId: string;
}

export interface LootNodePayload {
  nodeId: string;
}

// ── Server → Client ──────────────────────────────────────

export enum ServerMessage {
  /** Full state sync on join. */
  InstanceSync = "instance_sync",
  /** Entropy value changed. */
  EntropyUpdate = "entropy_update",
  /** A player's position/state changed. */
  PlayerUpdate = "player_update",
  /** A player joined the instance. */
  PlayerJoined = "player_joined",
  /** A player left the instance. */
  PlayerLeft = "player_left",
  /** Warp started — transit in progress. */
  WarpStarted = "warp_started",
  /** Warp completed — arrived at node. */
  WarpComplete = "warp_complete",
  /** Scan results delivered. */
  ScanResults = "scan_results",
  /** Another player pinged — alert. */
  ScanAlert = "scan_alert",
  /** Local visibility: another fleet is on your node. */
  FleetVisible = "fleet_visible",
  /** Combat resolved. */
  CombatResolved = "combat_resolved",
  /** Exit spool started. */
  ExitSpoolStarted = "exit_spool_started",
  /** Exit complete — player is out. */
  ExitComplete = "exit_complete",
  /** Instance is collapsing. */
  InstanceCollapse = "instance_collapse",
  /** Proximity alert — incoming warp detected. */
  ProximityAlert = "proximity_alert",
  /** Loot collected. */
  LootCollected = "loot_collected",
  /** Error message. */
  Error = "error",
}

export interface EntropyUpdatePayload {
  entropy: number;
}

export interface WarpStartedPayload {
  playerId: string;
  targetNodeId: string;
  arrivalTime: number;
}

export interface WarpCompletePayload {
  playerId: string;
  nodeId: string;
}

export interface ScanResultsPayload {
  results: ScanResult[];
}

export interface ScanAlertPayload {
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

export interface ExitSpoolStartedPayload {
  playerId: string;
  spoolDurationMs: number;
}

export interface ProximityAlertPayload {
  incomingPlayerId: string;
  etaMs: number;
}

export interface LootCollectedPayload {
  nodeId: string;
  resourceType: string;
  amount: number;
}

export interface ErrorPayload {
  message: string;
}
