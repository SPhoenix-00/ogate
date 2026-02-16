import {
  WARP_MIN_MS,
  WARP_MAX_MS,
  WARP_ENTROPY_COST,
  INSTANCE_MAP_RADIUS,
  getProximityAlertMs,
  PROXIMITY_ALERT_BASE_MS,
} from "@ogate/shared";
import type { Vec2Schema } from "../schemas/Vec2Schema.js";

/** Calculate the distance between two points. */
export function distance(a: Vec2Schema, b: Vec2Schema): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Calculate the warp transit time in ms based on distance. */
export function calculateWarpTime(from: Vec2Schema, to: Vec2Schema): number {
  const dist = distance(from, to);
  const maxDist = INSTANCE_MAP_RADIUS * 2;
  const ratio = Math.min(dist / maxDist, 1);
  return Math.round(WARP_MIN_MS + ratio * (WARP_MAX_MS - WARP_MIN_MS));
}

/** Entropy cost for a warp action. */
export function getWarpEntropyCost(): number {
  return WARP_ENTROPY_COST;
}

/**
 * Calculate when the proximity alert should fire based on the incoming fleet's mass.
 * Returns the time in ms before arrival that the alert should trigger.
 */
export function getAlertLeadTimeMs(incomingMass: number): number {
  return getProximityAlertMs(incomingMass, PROXIMITY_ALERT_BASE_MS);
}
