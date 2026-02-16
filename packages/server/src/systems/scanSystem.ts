import type { PlayerSchema } from "../schemas/PlayerSchema.js";
import type { OGateRoomState } from "../schemas/OGateRoomState.js";
import { PlayerInstanceState, getPingsRequiredForLock } from "@ogate/shared";

export interface ScanHit {
  nodeId: string;
  positionX: number;
  positionY: number;
  rippleMagnitude: number;
  threatAssessment: number;
  /** Whether a full warp solution is available (enough pings). */
  hasWarpSolution: boolean;
  /** Number of pings required for a full lock. */
  pingsRequired: number;
}

/** Track how many pings a scanner has made toward each target. */
const pingCounts = new Map<string, Map<string, number>>();

/**
 * Reset ping counts for a player (e.g. on instance exit).
 */
export function resetPingCounts(playerId: string): void {
  pingCounts.delete(playerId);
}

/**
 * Perform a graviton scan from the given player's current node.
 * Implements the Collimation mechanic: large fleets lock in 1 ping,
 * small ships require multiple pings (each alerting the target).
 */
export function performScan(state: OGateRoomState, scannerId: string): ScanHit[] {
  const hits: ScanHit[] = [];

  if (!pingCounts.has(scannerId)) {
    pingCounts.set(scannerId, new Map());
  }
  const scannerPings = pingCounts.get(scannerId)!;

  state.players.forEach((player: PlayerSchema, playerId: string) => {
    if (playerId === scannerId) return;
    if (player.state === PlayerInstanceState.Exited) return;

    const currentPings = (scannerPings.get(playerId) ?? 0) + 1;
    scannerPings.set(playerId, currentPings);

    const pingsRequired = getPingsRequiredForLock(player.totalMass);
    const hasWarpSolution = currentPings >= pingsRequired;

    hits.push({
      nodeId: player.currentNodeId,
      positionX: player.position.x,
      positionY: player.position.y,
      rippleMagnitude: player.totalMass,
      threatAssessment: computeThreat(player),
      hasWarpSolution,
      pingsRequired,
    });
  });

  return hits;
}

function computeThreat(player: PlayerSchema): number {
  let totalFP = 0;
  for (const ship of player.ships) {
    if (ship.hullHp > 0) totalFP += ship.firepower;
  }
  if (totalFP > 100) return 5;
  if (totalFP > 50) return 4;
  if (totalFP > 30) return 3;
  if (totalFP > 15) return 2;
  return 1;
}
