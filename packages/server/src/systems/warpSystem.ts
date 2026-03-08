import {
  WARP_MIN_MS,
  WARP_MAX_MS,
  WARP_MASS_SPEED_FACTOR,
  WARP_MASS_REFERENCE,
  WARP_OVERCLOCKER_FACTOR,
  INSTANCE_MAP_RADIUS,
  EXIT_SPOOL_LIGHT_MS,
  EXIT_SPOOL_HEAVY_MS,
  EXIT_SPOOL_MASS_CEILING,
  getProximityAlertMs,
  PROXIMITY_ALERT_BASE_MS,
} from "@ogate/shared";
import type { Vec2Schema } from "../schemas/Vec2Schema.js";

// ── Geometry ─────────────────────────────────────────────

/** Euclidean distance between two points. */
export function distance(a: Vec2Schema, b: Vec2Schema): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ── Warp transit ─────────────────────────────────────────

/**
 * Calculate the warp transit time in milliseconds.
 *
 * The base duration is a linear interpolation between `WARP_MIN_MS` and
 * `WARP_MAX_MS` driven by the ratio of actual distance to the maximum
 * possible distance (2 × map radius).
 *
 * Fleet mass then applies a logarithmic penalty on top:
 *
 *     massMultiplier = 1 + ln(1 + mass / WARP_MASS_REFERENCE) × WARP_MASS_SPEED_FACTOR
 *
 * This keeps probes fast while capitals pay a noticeable ~40 % surcharge.
 *
 * If the fleet has a Warp Overclocker active, the final time is multiplied
 * by `WARP_OVERCLOCKER_FACTOR` (default 0.2 → 80 % reduction).
 */
export function calculateWarpTime(
  from: Vec2Schema,
  to: Vec2Schema,
  fleetMass: number = WARP_MASS_REFERENCE,
  overclocked: boolean = false,
): number {
  const dist = distance(from, to);
  const maxDist = INSTANCE_MAP_RADIUS * 2;
  const ratio = Math.min(dist / maxDist, 1);

  const baseTime = WARP_MIN_MS + ratio * (WARP_MAX_MS - WARP_MIN_MS);

  const massMultiplier =
    1 + Math.log(1 + fleetMass / WARP_MASS_REFERENCE) * WARP_MASS_SPEED_FACTOR;

  let finalTime = baseTime * massMultiplier;

  if (overclocked) {
    finalTime *= WARP_OVERCLOCKER_FACTOR;
  }

  return Math.round(finalTime);
}

// ── Exit spool-up ────────────────────────────────────────

/**
 * OGate exit spool-up duration in milliseconds.
 *
 * Linearly interpolates between the light and heavy extremes based on
 * the fleet's total mass, clamped at `EXIT_SPOOL_MASS_CEILING`.
 *
 *     t = clamp(mass / ceiling, 0, 1)
 *     spool = LIGHT + t × (HEAVY − LIGHT)
 *
 * A probe (mass 5) spools in ~3.2 s; a capital (mass 150) maxes at 10 s.
 */
export function calculateExitSpoolTime(fleetMass: number): number {
  const t = Math.min(Math.max(fleetMass / EXIT_SPOOL_MASS_CEILING, 0), 1);
  return Math.round(
    EXIT_SPOOL_LIGHT_MS + t * (EXIT_SPOOL_HEAVY_MS - EXIT_SPOOL_LIGHT_MS),
  );
}

// ── Proximity alert ──────────────────────────────────────

/**
 * How many milliseconds before arrival the proximity alert should fire,
 * based on the incoming fleet's mass.
 *
 * Larger signatures are detected further out — capitals trigger alerts
 * ~50 s before arrival, probes only ~20 s.
 */
export function getAlertLeadTimeMs(incomingMass: number): number {
  return getProximityAlertMs(incomingMass, PROXIMITY_ALERT_BASE_MS);
}

/**
 * Given the total warp duration and the alert lead time, compute the
 * delay (ms from warp start) at which the alert should be dispatched.
 * If the warp is shorter than the alert window the alert fires immediately.
 */
export function getAlertDispatchDelay(
  totalWarpMs: number,
  alertLeadMs: number,
): number {
  return Math.max(0, totalWarpMs - alertLeadMs);
}
