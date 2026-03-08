import {
  ENTROPY_MAX,
  ENTROPY_PASSIVE_DECAY_PER_SEC,
  ENTROPY_COLLAPSE_THRESHOLD,
  ENTROPY_EMPTY_DESPAWN_THRESHOLD,
  ENTROPY_ENTRY_DENIAL_FLOOR,
  FLEET_ENTRY_ENTROPY_PER_MASS,
  WARP_ENTROPY_COST,
  SCAN_ENTROPY_COST,
  COMBAT_ENTROPY_COST,
  LOOT_ENTROPY_COST,
  EXTRACT_ENTROPY_COST,
  EntropyAction,
} from "@ogate/shared";
import type { OGateRoomState } from "../schemas/OGateRoomState.js";

// ── Result types ─────────────────────────────────────────

export interface EntropyTickResult {
  shouldCollapse: boolean;
  shouldDespawn: boolean;
  previousEntropy: number;
  newEntropy: number;
  /** Signed delta (negative when draining). */
  delta: number;
}

export interface EntropyDeduction {
  /** True if a non-zero cost was actually subtracted. */
  applied: boolean;
  previousEntropy: number;
  newEntropy: number;
  /** Always ≤ 0. */
  delta: number;
  /** True if this deduction dropped entropy to the collapse threshold while players are present. */
  triggeredCollapse: boolean;
}

// ── Action → cost registry ───────────────────────────────
// FleetEntry and PassiveDecay are dynamic; their slot is zero here
// because the real cost is computed at call-time from mass / delta-time.

const BASE_ACTION_COSTS: Record<EntropyAction, number> = {
  [EntropyAction.FleetEntry]:   0,
  [EntropyAction.Warp]:         WARP_ENTROPY_COST,
  [EntropyAction.Scan]:         SCAN_ENTROPY_COST,
  [EntropyAction.Combat]:       COMBAT_ENTROPY_COST,
  [EntropyAction.Loot]:         LOOT_ENTROPY_COST,
  [EntropyAction.Extract]:      EXTRACT_ENTROPY_COST,
  [EntropyAction.PassiveDecay]: 0,
};

// ── Core API ─────────────────────────────────────────────

/**
 * Advance the entropy clock by `deltaSeconds`.
 *
 * - **Empty instance**: entropy drains at ENTROPY_PASSIVE_DECAY_PER_SEC.
 *   If it drops below the 33 % threshold the instance is marked COLLAPSED
 *   and `shouldDespawn` is set.
 * - **Occupied instance**: no passive drain (entropy only falls through
 *   action costs).  If entropy hits 0 % the instance collapses and
 *   `shouldCollapse` is set.
 */
export function tickEntropy(
  state: OGateRoomState,
  deltaSeconds: number,
): EntropyTickResult {
  const previousEntropy = state.entropy;
  const playerCount = state.players.size;

  if (playerCount === 0) {
    state.entropy -= ENTROPY_PASSIVE_DECAY_PER_SEC * deltaSeconds;
  }

  state.entropy = clamp(state.entropy);

  const delta = state.entropy - previousEntropy;
  const result: EntropyTickResult = {
    shouldCollapse: false,
    shouldDespawn: false,
    previousEntropy,
    newEntropy: state.entropy,
    delta,
  };

  if (playerCount === 0 && state.entropy < ENTROPY_EMPTY_DESPAWN_THRESHOLD) {
    state.instanceState = "COLLAPSED";
    result.shouldDespawn = true;
    return result;
  }

  if (state.entropy <= ENTROPY_COLLAPSE_THRESHOLD && playerCount > 0) {
    state.instanceState = "COLLAPSED";
    result.shouldCollapse = true;
    return result;
  }

  return result;
}

/**
 * Deduct entropy for a tagged action.
 *
 * For `FleetEntry` the cost is dynamic: pass the fleet's total mass as
 * `dynamicCost` and the function multiplies it by
 * `FLEET_ENTRY_ENTROPY_PER_MASS`.  For all other actions the cost comes
 * from the static registry.  You can still override any action's cost by
 * passing `dynamicCost` directly.
 *
 * `skillModifier` (0 – 0.5) reduces the final cost, modelling the
 * Wormhole Physics / Entropy Shielding skill line.
 */
export function deductEntropy(
  state: OGateRoomState,
  action: EntropyAction,
  dynamicCost: number = 0,
  skillModifier: number = 0,
): EntropyDeduction {
  const previousEntropy = state.entropy;

  let baseCost: number;
  if (action === EntropyAction.FleetEntry) {
    baseCost = calculateEntryCost(dynamicCost);
  } else if (dynamicCost > 0) {
    baseCost = dynamicCost;
  } else {
    baseCost = BASE_ACTION_COSTS[action];
  }

  const modifier = Math.min(Math.max(skillModifier, 0), 0.5);
  const finalCost = baseCost * (1 - modifier);

  state.entropy = clamp(state.entropy - finalCost);

  const actualDelta = state.entropy - previousEntropy;

  return {
    applied: finalCost > 0,
    previousEntropy,
    newEntropy: state.entropy,
    delta: actualDelta,
    triggeredCollapse:
      state.entropy <= ENTROPY_COLLAPSE_THRESHOLD &&
      state.players.size > 0,
  };
}

/**
 * Check whether a fleet with the given total mass can enter the instance
 * without breaching the 25 % Entropy floor.
 */
export function canEnterInstance(
  state: OGateRoomState,
  fleetMass: number,
): boolean {
  const cost = calculateEntryCost(fleetMass);
  return (state.entropy - cost) >= ENTROPY_ENTRY_DENIAL_FLOOR;
}

/** Compute the entropy cost for a fleet entering an instance. */
export function calculateEntryCost(fleetMass: number): number {
  return fleetMass * FLEET_ENTRY_ENTROPY_PER_MASS;
}

/** Look up the base entropy cost for an action type. */
export function getActionCost(action: EntropyAction): number {
  return BASE_ACTION_COSTS[action];
}

/**
 * Estimated seconds until the instance crosses the despawn threshold
 * at the current passive-decay rate.  Returns `Infinity` when the
 * instance is occupied (only explicit actions drain entropy).
 */
export function estimateTimeToCollapse(state: OGateRoomState): number {
  if (state.players.size > 0) return Infinity;
  const remaining = state.entropy - ENTROPY_EMPTY_DESPAWN_THRESHOLD;
  if (remaining <= 0) return 0;
  return remaining / ENTROPY_PASSIVE_DECAY_PER_SEC;
}

// ── Internal ─────────────────────────────────────────────

function clamp(value: number): number {
  return Math.max(0, Math.min(ENTROPY_MAX, value));
}
