import {
  BuildingType,
  BUILDING_DEFS,
  getBuildingUpgradeCost,
  getBuildingUpgradeTime,
  getProductionPerHour,
  SkillId,
  SKILL_DEFS,
  getSkillTrainTime,
  SKILL_QUEUE_MAX_SECONDS,
  ShipClass,
  SHIP_BLUEPRINTS,
  PROBE_HULL_HP,
  PROBE_FIREPOWER,
  PROBE_MASS,
  MINING_SKILL_BONUS_PER_LEVEL,
  HARVESTING_SKILL_BONUS_PER_LEVEL,
  BASE_SORTIE_SIZE,
  SORTIE_SIZE_PER_FLEET_COMMAND,
  REPAIR_COST_RATIO,
} from "@ogate/shared";
import { v4 as uuid } from "uuid";
import type { HomeStateSchema } from "../schemas/HomeStateSchema.js";
import {
  BuildingSchema,
  SkillSchema,
  SkillQueueItemSchema,
  HomeShipSchema,
} from "../schemas/HomeStateSchema.js";

// ═══════════════════════════════════════════════════════════
//  Initialization
// ═══════════════════════════════════════════════════════════

/**
 * Bootstrap a new player's home state with starter buildings,
 * the OGate Control Center, and a single probe.
 */
export function initializeHomeState(state: HomeStateSchema): void {
  const starterBuildings = [
    BuildingType.DeepCoreDrill,
    BuildingType.BioHarvester,
    BuildingType.SolarArray,
    BuildingType.OGateControlCenter,
  ];

  for (const bt of starterBuildings) {
    const b = new BuildingSchema();
    b.buildingType = bt;
    b.level = 1;
    state.buildings.set(bt, b);
  }

  const probe = new HomeShipSchema();
  probe.id = uuid();
  probe.shipClass = ShipClass.Probe;
  probe.hullHp = PROBE_HULL_HP;
  probe.maxHullHp = PROBE_HULL_HP;
  probe.firepower = PROBE_FIREPOWER;
  probe.mass = PROBE_MASS;
  state.fleet.push(probe);

  state.lastCollectedAt = Date.now();
}

// ═══════════════════════════════════════════════════════════
//  Idle Resource Collection
// ═══════════════════════════════════════════════════════════

export interface CollectionResult {
  ore: number;
  biomass: number;
  energy: number;
  elapsedHours: number;
}

/**
 * Collect idle resources accrued since the last collection.
 *
 * Production rates come from building levels (via `getProductionPerHour`).
 * Mining Proficiency and Harvesting Skill apply multiplicative bonuses
 * on ore and biomass respectively.
 */
export function collectResources(state: HomeStateSchema): CollectionResult {
  const now = Date.now();
  const elapsedHours = (now - state.lastCollectedAt) / (1000 * 60 * 60);
  state.lastCollectedAt = now;

  const rates = getEffectiveProductionRates(state);

  const oreGain = Math.floor(rates.ore * elapsedHours);
  const biomassGain = Math.floor(rates.biomass * elapsedHours);
  const energyGain = Math.floor(rates.energy * elapsedHours);

  state.ore += oreGain;
  state.biomass += biomassGain;
  state.energy += energyGain;

  return { ore: oreGain, biomass: biomassGain, energy: energyGain, elapsedHours };
}

/**
 * Effective hourly production rates with skill bonuses applied.
 * Useful for client-side display of "per hour" projections.
 */
export function getEffectiveProductionRates(
  state: HomeStateSchema,
): { ore: number; biomass: number; energy: number } {
  let ore = 0;
  let biomass = 0;
  let energy = 0;

  state.buildings.forEach((building) => {
    if (building.level <= 0) return;
    const prod = getProductionPerHour(building.buildingType as BuildingType, building.level);
    if (prod.ore) ore += prod.ore;
    if (prod.biomass) biomass += prod.biomass;
    if (prod.energy) energy += prod.energy;
  });

  const miningLevel = getSkillLevel(state, SkillId.MiningProficiency);
  const harvestLevel = getSkillLevel(state, SkillId.HarvestingSkill);

  ore *= 1 + miningLevel * MINING_SKILL_BONUS_PER_LEVEL;
  biomass *= 1 + harvestLevel * HARVESTING_SKILL_BONUS_PER_LEVEL;

  return { ore: Math.round(ore), biomass: Math.round(biomass), energy: Math.round(energy) };
}

// ═══════════════════════════════════════════════════════════
//  Building Upgrades
// ═══════════════════════════════════════════════════════════

/**
 * Start upgrading a building to the next level.
 * Deducts resources immediately; the upgrade completes after a timer
 * resolved by `tickBuildingUpgrades`.
 */
export function upgradeBuilding(
  state: HomeStateSchema,
  buildingType: BuildingType,
): string | null {
  const def = BUILDING_DEFS[buildingType];
  if (!def) return "Unknown building type.";

  let building = state.buildings.get(buildingType);
  if (!building) {
    building = new BuildingSchema();
    building.buildingType = buildingType;
    building.level = 0;
    state.buildings.set(buildingType, building);
  }

  if (building.upgrading) return "Building is already being upgraded.";
  if (building.level >= def.maxLevel) return "Building is at max level.";

  const targetLevel = building.level + 1;
  const cost = getBuildingUpgradeCost(def, targetLevel);

  const costError = checkResourceCost(state, cost);
  if (costError) return costError;

  state.ore -= cost.ore;
  state.biomass -= cost.biomass;
  state.energy -= cost.energy;

  const buildTimeSec = getBuildingUpgradeTime(def, targetLevel);
  building.upgrading = true;
  building.upgradeCompleteAt = Date.now() + buildTimeSec * 1000;

  return null;
}

/**
 * Check and complete any building upgrades whose timers have expired.
 * Returns the BuildingType strings that finished.
 */
export function tickBuildingUpgrades(state: HomeStateSchema): string[] {
  const completed: string[] = [];
  const now = Date.now();

  state.buildings.forEach((building) => {
    if (building.upgrading && now >= building.upgradeCompleteAt) {
      building.level += 1;
      building.upgrading = false;
      building.upgradeCompleteAt = 0;
      completed.push(building.buildingType);
    }
  });

  return completed;
}

// ═══════════════════════════════════════════════════════════
//  Skill Training Queue
// ═══════════════════════════════════════════════════════════

/**
 * Enqueue a skill level for training.
 *
 * Validates:
 * - Skill exists and hasn't hit max level (including already-queued levels).
 * - Adding this item won't push total queue duration past 24 hours.
 *
 * The item's `completeAt` is chained from the tail of the current queue
 * (or from now if the queue is empty).
 */
export function queueSkill(
  state: HomeStateSchema,
  skillId: SkillId,
): string | null {
  const def = SKILL_DEFS[skillId];
  if (!def) return "Unknown skill.";

  let currentLevel = 0;
  const existing = state.skills.get(skillId);
  if (existing) currentLevel = existing.level;

  let queuedLevels = 0;
  for (const item of state.skillQueue) {
    if (item.skillId === skillId) queuedLevels++;
  }

  const targetLevel = currentLevel + queuedLevels + 1;
  if (targetLevel > def.maxLevel) return "Skill is at max level.";

  const trainTimeSec = getSkillTrainTime(def, targetLevel);

  const now = Date.now();
  let totalQueuedTime = 0;
  for (const item of state.skillQueue) {
    const remaining = Math.max(0, (item.completeAt - now) / 1000);
    totalQueuedTime += remaining;
  }

  if (totalQueuedTime + trainTimeSec > SKILL_QUEUE_MAX_SECONDS) {
    return "Skill queue would exceed 24-hour limit.";
  }

  const lastItem = state.skillQueue.length > 0
    ? state.skillQueue.at(state.skillQueue.length - 1)
    : undefined;
  const lastEnd = lastItem ? lastItem.completeAt : now;

  const queueItem = new SkillQueueItemSchema();
  queueItem.skillId = skillId;
  queueItem.targetLevel = targetLevel;
  queueItem.completeAt = lastEnd + trainTimeSec * 1000;
  state.skillQueue.push(queueItem);

  return null;
}

/**
 * Tick the skill training queue — complete skills whose timers have
 * expired and promote them to the `skills` map.
 * Returns the SkillId strings that finished.
 */
export function tickSkillQueue(state: HomeStateSchema): string[] {
  const completed: string[] = [];
  const now = Date.now();

  while (state.skillQueue.length > 0) {
    const item = state.skillQueue.at(0);
    if (!item || now < item.completeAt) break;

    let skill = state.skills.get(item.skillId);
    if (!skill) {
      skill = new SkillSchema();
      skill.skillId = item.skillId;
      skill.level = 0;
      state.skills.set(item.skillId, skill);
    }
    skill.level = item.targetLevel;

    completed.push(item.skillId);
    state.skillQueue.splice(0, 1);
  }

  return completed;
}

/**
 * Cancel the last item in the skill training queue.
 * Returns an error string or null on success.
 */
export function cancelLastSkillQueueItem(state: HomeStateSchema): string | null {
  if (state.skillQueue.length === 0) return "Skill queue is empty.";

  state.skillQueue.splice(state.skillQueue.length - 1, 1);
  return null;
}

// ═══════════════════════════════════════════════════════════
//  Ship Construction
// ═══════════════════════════════════════════════════════════

export interface ShipBuildStarted {
  shipClass: string;
  buildTimeMs: number;
  completeAt: number;
}

/**
 * Start constructing a ship in the Shipyard.
 *
 * Validates:
 * - Blueprint exists.
 * - Shipyard level is sufficient.
 * - Shipyard is not already building another ship.
 * - Player can afford the resource cost.
 *
 * Resources are deducted immediately.  The build completes when
 * `tickShipBuild` finds the timer has expired.
 */
export function buildShip(
  state: HomeStateSchema,
  shipClass: string,
): { error: string | null; started?: ShipBuildStarted } {
  const bp = SHIP_BLUEPRINTS[shipClass as ShipClass];
  if (!bp) return { error: "Unknown ship class or blueprint not available." };

  const shipyard = state.buildings.get(BuildingType.Shipyard);
  const shipyardLevel = shipyard?.level ?? 0;
  if (shipyardLevel < bp.minShipyardLevel) {
    return { error: `Requires Shipyard level ${bp.minShipyardLevel} (current: ${shipyardLevel}).` };
  }

  if (state.shipBuildClass !== "") {
    return { error: "Shipyard is already building a ship." };
  }

  const cost = { ore: bp.costOre, biomass: bp.costBiomass, energy: bp.costEnergy };
  const costError = checkResourceCost(state, cost);
  if (costError) return { error: costError };

  state.ore -= cost.ore;
  state.biomass -= cost.biomass;
  state.energy -= cost.energy;

  const buildTimeMs = bp.buildTimeSec * 1000;
  const completeAt = Date.now() + buildTimeMs;

  state.shipBuildClass = shipClass;
  state.shipBuildCompleteAt = completeAt;

  return {
    error: null,
    started: { shipClass, buildTimeMs, completeAt },
  };
}

/**
 * Check whether the shipyard's current build has completed.
 * If so, add the finished ship to the fleet and clear the build slot.
 * Returns the ship class that was completed, or null if nothing finished.
 */
export function tickShipBuild(state: HomeStateSchema): string | null {
  if (state.shipBuildClass === "") return null;

  const now = Date.now();
  if (now < state.shipBuildCompleteAt) return null;

  const bp = SHIP_BLUEPRINTS[state.shipBuildClass as ShipClass];
  if (!bp) {
    state.shipBuildClass = "";
    state.shipBuildCompleteAt = 0;
    return null;
  }

  const ship = new HomeShipSchema();
  ship.id = uuid();
  ship.shipClass = state.shipBuildClass;
  ship.hullHp = bp.hullHp;
  ship.maxHullHp = bp.hullHp;
  ship.firepower = bp.firepower;
  ship.mass = bp.mass;
  state.fleet.push(ship);

  const completedClass = state.shipBuildClass;
  state.shipBuildClass = "";
  state.shipBuildCompleteAt = 0;

  return completedClass;
}

/**
 * Cancel the in-progress ship build.
 * The partially-constructed hull is scrapped — resources are not refunded.
 */
export function cancelShipBuild(state: HomeStateSchema): string | null {
  if (state.shipBuildClass === "") return "No ship is currently being built.";

  state.shipBuildClass = "";
  state.shipBuildCompleteAt = 0;
  return null;
}

// ═══════════════════════════════════════════════════════════
//  Ship Repair
// ═══════════════════════════════════════════════════════════

export interface RepairCost {
  ore: number;
  energy: number;
}

/**
 * Repair a damaged ship in the fleet.
 *
 * Cost is proportional to the missing HP, scaled by `REPAIR_COST_RATIO`
 * relative to the ship's original build cost.  Ships that have been
 * fully destroyed (hullHp ≤ 0) are wrecks and must be rebuilt from
 * scratch via `buildShip`.
 */
export function repairShip(
  state: HomeStateSchema,
  shipId: string,
): { error: string | null; cost?: RepairCost } {
  const ship = state.fleet.find(s => s.id === shipId);
  if (!ship) return { error: "Ship not found." };

  if (ship.hullHp <= 0) {
    return { error: "Ship is a wreck and cannot be repaired. Build a new one." };
  }

  if (ship.hullHp >= ship.maxHullHp) {
    return { error: "Ship is already at full hull integrity." };
  }

  const bp = SHIP_BLUEPRINTS[ship.shipClass as ShipClass];
  if (!bp) return { error: "Unknown ship class." };

  const missingHp = ship.maxHullHp - ship.hullHp;
  const damageRatio = missingHp / bp.hullHp;

  const cost: RepairCost = {
    ore: Math.ceil(bp.costOre * damageRatio * REPAIR_COST_RATIO),
    energy: Math.ceil(bp.costEnergy * damageRatio * REPAIR_COST_RATIO),
  };

  if (state.ore < cost.ore) return { error: `Not enough ore (need ${cost.ore}).` };
  if (state.energy < cost.energy) return { error: `Not enough energy (need ${cost.energy}).` };

  state.ore -= cost.ore;
  state.energy -= cost.energy;
  ship.hullHp = ship.maxHullHp;

  return { error: null, cost };
}

/**
 * Remove wrecked ships (hullHp ≤ 0) from the fleet roster.
 * Returns the number of wrecks scrapped.
 */
export function scrapWrecks(state: HomeStateSchema): number {
  let scrapped = 0;
  for (let i = state.fleet.length - 1; i >= 0; i--) {
    const ship = state.fleet.at(i);
    if (ship && ship.hullHp <= 0) {
      state.fleet.splice(i, 1);
      scrapped++;
    }
  }
  return scrapped;
}

// ═══════════════════════════════════════════════════════════
//  Skill & Fleet Queries
// ═══════════════════════════════════════════════════════════

/** Return the trained level of a skill (0 if untrained). */
export function getSkillLevel(state: HomeStateSchema, skillId: SkillId): number {
  return state.skills.get(skillId)?.level ?? 0;
}

/**
 * Maximum number of ships the player can take on an OGate sortie.
 * Base size + Fleet Command level bonus.
 */
export function getMaxSortieSize(state: HomeStateSchema): number {
  return BASE_SORTIE_SIZE + getSkillLevel(state, SkillId.FleetCommand) * SORTIE_SIZE_PER_FLEET_COMMAND;
}

/**
 * Wormhole Physics skill modifier for entropy cost reduction.
 * Returns a value 0 – 0.5 suitable for passing to `deductEntropy`'s
 * `skillModifier` parameter.
 */
export function getEntropySkillModifier(state: HomeStateSchema): number {
  const level = getSkillLevel(state, SkillId.WormholePhysics);
  return Math.min(level * 0.08, 0.5);
}

/**
 * Engineering skill modifier for emergency warp damage reduction.
 * Returns a multiplier 0 – 0.4 that should be subtracted from the
 * raw damage roll (higher = less damage).
 */
export function getEngineeringDamageReduction(state: HomeStateSchema): number {
  const level = getSkillLevel(state, SkillId.Engineering);
  return Math.min(level * 0.08, 0.4);
}

/** Sensor Analysis bonus: extra proximity alert lead time in ms. */
export function getSensorAlertBonusMs(state: HomeStateSchema): number {
  const level = getSkillLevel(state, SkillId.SensorAnalysis);
  return level * 3000;
}

/** Wormhole Navigation bonus: exit spool-up time reduction factor (0–0.3). */
export function getExitSpoolReduction(state: HomeStateSchema): number {
  const level = getSkillLevel(state, SkillId.WormholeNavigation);
  return Math.min(level * 0.06, 0.3);
}

// ═══════════════════════════════════════════════════════════
//  Internal helpers
// ═══════════════════════════════════════════════════════════

function checkResourceCost(
  state: HomeStateSchema,
  cost: { ore: number; biomass: number; energy: number },
): string | null {
  if (state.ore < cost.ore) return `Not enough ore (need ${cost.ore}).`;
  if (state.biomass < cost.biomass) return `Not enough biomass (need ${cost.biomass}).`;
  if (state.energy < cost.energy) return `Not enough energy (need ${cost.energy}).`;
  return null;
}
