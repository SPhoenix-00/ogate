import type { PlayerSchema } from "../schemas/PlayerSchema.js";
import type { OGateRoomState } from "../schemas/OGateRoomState.js";
import {
  PlayerInstanceState,
  getPingsRequiredForLock,
  SCAN_FUZZ_RADIUS,
  SCAN_THREAT_THRESHOLDS,
} from "@ogate/shared";

// ── Result types ─────────────────────────────────────────

export interface ScanHit {
  /** Target's current node ID. */
  nodeId: string;
  /**
   * Reported position.  When the scanner hasn't collimated a full warp
   * solution, this is *fuzzy* — offset from the true position by a random
   * jitter that shrinks with each successive ping.
   */
  positionX: number;
  positionY: number;
  /** Fleet mass of the detected target. */
  rippleMagnitude: number;
  /** Threat level 1–5 derived from aggregate firepower. */
  threatAssessment: number;
  /** True when enough pings have been accumulated for a direct warp. */
  hasWarpSolution: boolean;
  /** Total pings required for a full lock on this target. */
  pingsRequired: number;
  /** How many pings the scanner has accumulated toward this target. */
  currentPings: number;
}

// ── Collimation state ────────────────────────────────────
// Keyed by scannerId → targetId → ping count.
// Module-level because it must persist across scan calls within the same
// instance lifetime.  Cleaned up via resetPingCounts / purgeTarget.

const pingCounts = new Map<string, Map<string, number>>();

/** Reset all ping state for a scanner (e.g. when they leave the instance). */
export function resetPingCounts(scannerId: string): void {
  pingCounts.delete(scannerId);
}

/**
 * Remove a target from every scanner's collimation table.
 * Call this when a player exits the instance so stale entries don't
 * accumulate.
 */
export function purgeTarget(targetId: string): void {
  for (const targets of pingCounts.values()) {
    targets.delete(targetId);
  }
}

/** Wipe the entire collimation table (e.g. on instance dispose). */
export function resetAllPingCounts(): void {
  pingCounts.clear();
}

// ── Core scan logic ──────────────────────────────────────

/**
 * Execute a graviton scan pulse from the given scanner.
 *
 * Mechanic overview (HLDD §4 "Submarine Warfare"):
 *
 * 1. The pulse is instance-wide — every non-exited player is detected.
 * 2. Each detection increments the scanner's ping counter for that target.
 * 3. **Collimation**: large fleets need only 1 ping for a full warp lock;
 *    small ships need 2–3 pings, each of which alerts the target that
 *    they've been pinged (handled by the room via `ScanAlert`).
 * 4. Until a full warp solution is achieved, the reported position is
 *    *fuzzed* — displaced by a random offset whose radius shrinks linearly
 *    with each additional ping.
 */
export function performScan(
  state: OGateRoomState,
  scannerId: string,
): ScanHit[] {
  const hits: ScanHit[] = [];

  if (!pingCounts.has(scannerId)) {
    pingCounts.set(scannerId, new Map());
  }
  const scannerPings = pingCounts.get(scannerId)!;

  state.players.forEach((player: PlayerSchema, playerId: string) => {
    if (playerId === scannerId) return;
    if (player.state === PlayerInstanceState.Exited) return;
    if (player.state === PlayerInstanceState.EmergencyWarping) return;

    const currentPings = (scannerPings.get(playerId) ?? 0) + 1;
    scannerPings.set(playerId, currentPings);

    const pingsRequired = getPingsRequiredForLock(player.totalMass);
    const hasWarpSolution = currentPings >= pingsRequired;

    const { x: fuzzedX, y: fuzzedY } = fuzzPosition(
      player.position.x,
      player.position.y,
      currentPings,
      pingsRequired,
    );

    hits.push({
      nodeId: player.currentNodeId,
      positionX: fuzzedX,
      positionY: fuzzedY,
      rippleMagnitude: player.totalMass,
      threatAssessment: computeThreat(player),
      hasWarpSolution,
      pingsRequired,
      currentPings,
    });
  });

  return hits;
}

/**
 * Query the current ping count a scanner has on a specific target,
 * without incrementing it.
 */
export function getPingCount(scannerId: string, targetId: string): number {
  return pingCounts.get(scannerId)?.get(targetId) ?? 0;
}

// ── Internals ────────────────────────────────────────────

/**
 * Displace a position by a random jitter that shrinks toward zero as
 * pings approach the required count.  Once a full lock is achieved the
 * exact position is returned.
 */
function fuzzPosition(
  trueX: number,
  trueY: number,
  currentPings: number,
  pingsRequired: number,
): { x: number; y: number } {
  if (currentPings >= pingsRequired) {
    return { x: trueX, y: trueY };
  }

  const fuzzFactor = 1 - currentPings / pingsRequired;
  const radius = SCAN_FUZZ_RADIUS * fuzzFactor;
  const angle = Math.random() * Math.PI * 2;

  return {
    x: Math.round(trueX + Math.cos(angle) * radius),
    y: Math.round(trueY + Math.sin(angle) * radius),
  };
}

/**
 * Derive a 1–5 threat level from the surviving firepower of a fleet.
 * Uses the tunable threshold array from constants.
 */
function computeThreat(player: PlayerSchema): number {
  let totalFP = 0;
  for (const ship of player.ships) {
    if (ship.hullHp > 0) totalFP += ship.firepower;
  }

  let level = 1;
  for (let i = 1; i < SCAN_THREAT_THRESHOLDS.length; i++) {
    if (totalFP > SCAN_THREAT_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}
