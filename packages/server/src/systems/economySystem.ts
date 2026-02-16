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
  SHIP_BLUEPRINTS as FLEET_BLUEPRINTS,
  PROBE_HULL_HP,
  PROBE_FIREPOWER,
  PROBE_MASS,
} from "@ogate/shared";
import { v4 as uuid } from "uuid";
import type { HomeStateSchema } from "../schemas/HomeStateSchema.js";
import { BuildingSchema, SkillSchema, SkillQueueItemSchema, HomeShipSchema } from "../schemas/HomeStateSchema.js";

/**
 * Initialize the home state with default buildings at level 1.
 */
export function initializeHomeState(state: HomeStateSchema): void {
  const starterBuildings = [
    BuildingType.DeepCoreDrill,
    BuildingType.BioHarvester,
    BuildingType.SolarArray,
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

/**
 * Calculate and collect idle resources based on building levels and elapsed time.
 */
export function collectResources(state: HomeStateSchema): { ore: number; biomass: number; energy: number } {
  const now = Date.now();
  const elapsedHours = (now - state.lastCollectedAt) / (1000 * 60 * 60);
  state.lastCollectedAt = now;

  let oreGain = 0;
  let biomassGain = 0;
  let energyGain = 0;

  state.buildings.forEach((building) => {
    if (building.level <= 0) return;
    const prod = getProductionPerHour(building.buildingType as BuildingType, building.level);
    if (prod.ore) oreGain += prod.ore * elapsedHours;
    if (prod.biomass) biomassGain += prod.biomass * elapsedHours;
    if (prod.energy) energyGain += prod.energy * elapsedHours;
  });

  oreGain = Math.floor(oreGain);
  biomassGain = Math.floor(biomassGain);
  energyGain = Math.floor(energyGain);

  state.ore += oreGain;
  state.biomass += biomassGain;
  state.energy += energyGain;

  return { ore: oreGain, biomass: biomassGain, energy: energyGain };
}

/**
 * Attempt to upgrade a building. Returns error string or null on success.
 */
export function upgradeBuilding(state: HomeStateSchema, buildingType: BuildingType): string | null {
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

  if (state.ore < cost.ore) return `Not enough ore (need ${cost.ore}).`;
  if (state.biomass < cost.biomass) return `Not enough biomass (need ${cost.biomass}).`;
  if (state.energy < cost.energy) return `Not enough energy (need ${cost.energy}).`;

  state.ore -= cost.ore;
  state.biomass -= cost.biomass;
  state.energy -= cost.energy;

  const buildTimeSec = getBuildingUpgradeTime(def, targetLevel);
  building.upgrading = true;
  building.upgradeCompleteAt = Date.now() + buildTimeSec * 1000;

  return null;
}

/**
 * Check and complete any building upgrades that have finished.
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

/**
 * Queue a skill for training. Returns error string or null on success.
 */
export function queueSkill(state: HomeStateSchema, skillId: SkillId): string | null {
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

  let totalQueuedTime = 0;
  const now = Date.now();
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
 * Tick skill training queue. Returns completed skill names.
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
 * Build a ship using full fleet blueprints.
 * Checks shipyard level requirement and resource costs.
 */
export function buildShip(state: HomeStateSchema, shipClass: string): string | null {
  const bp = FLEET_BLUEPRINTS[shipClass as ShipClass];
  if (!bp) return "Unknown ship class or blueprint not available.";

  const shipyard = state.buildings.get(BuildingType.Shipyard);
  const shipyardLevel = shipyard?.level ?? 0;
  if (shipyardLevel < bp.minShipyardLevel) {
    return `Requires Shipyard level ${bp.minShipyardLevel} (current: ${shipyardLevel}).`;
  }

  if (state.ore < bp.costOre) return `Not enough ore (need ${bp.costOre}).`;
  if (state.biomass < bp.costBiomass) return `Not enough biomass (need ${bp.costBiomass}).`;
  if (state.energy < bp.costEnergy) return `Not enough energy (need ${bp.costEnergy}).`;

  state.ore -= bp.costOre;
  state.biomass -= bp.costBiomass;
  state.energy -= bp.costEnergy;

  const ship = new HomeShipSchema();
  ship.id = uuid();
  ship.shipClass = shipClass;
  ship.hullHp = bp.hullHp;
  ship.maxHullHp = bp.hullHp;
  ship.firepower = bp.firepower;
  ship.mass = bp.mass;
  state.fleet.push(ship);

  return null;
}
