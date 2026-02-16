/**
 * Core game constants derived from the HLDD.
 * All tunable values live here so Entropy, warp, and combat
 * can be adjusted without hunting through game logic.
 */

// ── Entropy ──────────────────────────────────────────────
export const ENTROPY_MAX = 100;
export const ENTROPY_PASSIVE_DECAY_PER_SEC = 0.1;
export const ENTROPY_COLLAPSE_THRESHOLD = 0;
export const ENTROPY_EMPTY_DESPAWN_THRESHOLD = 33;
export const ENTROPY_ENTRY_DENIAL_FLOOR = 25;

// ── Instance ─────────────────────────────────────────────
export const INSTANCE_NEW_CHANCE = 0.5;
export const INSTANCE_MAP_RADIUS = 1000;
export const INSTANCE_MIN_NODES = 3;
export const INSTANCE_MAX_NODES = 5;

// ── Capacitor tiers ──────────────────────────────────────
export const CAPACITOR_1MW_PLAYER_CAP = 4;
export const CAPACITOR_1GW_PLAYER_CAP = 16;
export const CAPACITOR_1MW_MASS_LIMIT = 100;
export const CAPACITOR_1GW_MASS_LIMIT = 1000;

// ── Warp ─────────────────────────────────────────────────
/** Minimum warp transit time in milliseconds */
export const WARP_MIN_MS = 30_000;
/** Maximum warp transit time in milliseconds */
export const WARP_MAX_MS = 300_000;

// ── Exfiltration ─────────────────────────────────────────
/** Base spool-up time for a light fleet (ms) */
export const EXIT_SPOOL_LIGHT_MS = 3_000;
/** Base spool-up time for a heavy fleet (ms) */
export const EXIT_SPOOL_HEAVY_MS = 10_000;

// ── Scanning ─────────────────────────────────────────────
/** Duration of a scanner pulse in milliseconds */
export const SCAN_DURATION_MS = 5_000;
/** Entropy cost of a scan action (percentage points) */
export const SCAN_ENTROPY_COST = 0;

// ── Combat ───────────────────────────────────────────────
/** Entropy cost of a combat engagement (percentage points) */
export const COMBAT_ENTROPY_COST = 5;

// ── Proximity Alert ──────────────────────────────────────
/** Base detection horizon in milliseconds before warp arrival */
export const PROXIMITY_ALERT_BASE_MS = 20_000;

// ── Movement entropy costs ───────────────────────────────
export const WARP_ENTROPY_COST = 1;
export const LOOT_ENTROPY_COST = 0.5;

// ── Starting resources (stub) ────────────────────────────
export const STARTING_ORE = 500;
export const STARTING_BIOMASS = 300;
export const STARTING_ENERGY = 200;
export const STARTING_CAPACITORS_1MW = 3;

// ── Ships (base stats for Phase 1) ──────────────────────
export const PROBE_HULL_HP = 50;
export const PROBE_FIREPOWER = 10;
export const PROBE_MASS = 5;

export const INTERCEPTOR_HULL_HP = 80;
export const INTERCEPTOR_FIREPOWER = 25;
export const INTERCEPTOR_MASS = 10;
