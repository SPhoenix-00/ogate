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
/** ln-based scaling factor for fleet mass → warp duration penalty. */
export const WARP_MASS_SPEED_FACTOR = 0.12;
/** Reference mass for the speed curve baseline (probe = no penalty). */
export const WARP_MASS_REFERENCE = 5;
/** Warp Overclocker speed multiplier (0.2 = 80% time reduction). */
export const WARP_OVERCLOCKER_FACTOR = 0.2;

// ── Exfiltration ─────────────────────────────────────────
/** Base spool-up time for a light fleet (ms) */
export const EXIT_SPOOL_LIGHT_MS = 3_000;
/** Base spool-up time for a heavy fleet (ms) */
export const EXIT_SPOOL_HEAVY_MS = 10_000;
/** Fleet mass at which spool-up saturates to EXIT_SPOOL_HEAVY_MS. */
export const EXIT_SPOOL_MASS_CEILING = 150;

// ── Scanning ─────────────────────────────────────────────
/** Duration of a scanner pulse in milliseconds */
export const SCAN_DURATION_MS = 5_000;
/** Entropy cost of a scan action (percentage points) */
export const SCAN_ENTROPY_COST = 0;
/** Max position jitter radius (world units) for an unfocused scan lock. */
export const SCAN_FUZZ_RADIUS = 200;
/** Threat-level firepower thresholds (ascending from level 1→5). */
export const SCAN_THREAT_THRESHOLDS = [0, 15, 30, 50, 100];

// ── Combat ───────────────────────────────────────────────
/** Entropy cost of a combat engagement (percentage points) */
export const COMBAT_ENTROPY_COST = 5;

// ── Proximity Alert ──────────────────────────────────────
/** Base detection horizon in milliseconds before warp arrival */
export const PROXIMITY_ALERT_BASE_MS = 20_000;

// ── Movement entropy costs ───────────────────────────────
export const WARP_ENTROPY_COST = 1;
export const LOOT_ENTROPY_COST = 0.5;
export const EXTRACT_ENTROPY_COST = 0.3;

// ── Fleet entry ─────────────────────────────────────────
/** Entropy cost per unit of fleet mass on instance entry. */
export const FLEET_ENTRY_ENTROPY_PER_MASS = 0.1;

// ── Skill effects ───────────────────────────────────────
/** Ore production bonus per Mining Proficiency level. */
export const MINING_SKILL_BONUS_PER_LEVEL = 0.1;
/** Biomass production bonus per Harvesting Skill level. */
export const HARVESTING_SKILL_BONUS_PER_LEVEL = 0.1;
/** Base number of ships allowed in a sortie. */
export const BASE_SORTIE_SIZE = 3;
/** Additional ships per Fleet Command level. */
export const SORTIE_SIZE_PER_FLEET_COMMAND = 1;

// ── Ship repair ─────────────────────────────────────────
/** Fraction of build cost charged per unit of HP restored. */
export const REPAIR_COST_RATIO = 0.3;

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
