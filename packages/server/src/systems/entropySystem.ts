import {
  ENTROPY_MAX,
  ENTROPY_PASSIVE_DECAY_PER_SEC,
  ENTROPY_COLLAPSE_THRESHOLD,
  ENTROPY_EMPTY_DESPAWN_THRESHOLD,
} from "@ogate/shared";
import type { OGateRoomState } from "../schemas/OGateRoomState.js";

/**
 * Tick the entropy system. Called every server tick (e.g. every 1 second).
 * Returns true if the instance should collapse/despawn.
 */
export function tickEntropy(state: OGateRoomState, deltaSeconds: number): { shouldCollapse: boolean; shouldDespawn: boolean } {
  const playerCount = state.players.size;

  if (playerCount === 0) {
    state.entropy -= ENTROPY_PASSIVE_DECAY_PER_SEC * deltaSeconds;
    if (state.entropy < ENTROPY_EMPTY_DESPAWN_THRESHOLD) {
      state.instanceState = "COLLAPSED";
      return { shouldCollapse: false, shouldDespawn: true };
    }
  }

  state.entropy = Math.max(state.entropy, 0);
  state.entropy = Math.min(state.entropy, ENTROPY_MAX);

  if (state.entropy <= ENTROPY_COLLAPSE_THRESHOLD && playerCount > 0) {
    state.instanceState = "COLLAPSED";
    return { shouldCollapse: true, shouldDespawn: false };
  }

  return { shouldCollapse: false, shouldDespawn: false };
}

/** Deduct entropy for a specific action. */
export function deductEntropy(state: OGateRoomState, amount: number): void {
  state.entropy = Math.max(0, state.entropy - amount);
}

/** Check if a fleet with the given mass can enter without breaching the 25% floor. */
export function canEnterInstance(state: OGateRoomState, entryCost: number): boolean {
  return (state.entropy - entryCost) >= 25;
}
