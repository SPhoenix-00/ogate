/**
 * Message types for Home System operations (REST-style or via WebSocket lobby).
 */

import type { BuildingType, SkillId } from "./economy.js";

export enum HomeAction {
  GetProfile = "home_get_profile",
  CollectResources = "home_collect_resources",
  UpgradeBuilding = "home_upgrade_building",
  QueueSkill = "home_queue_skill",
  CancelSkillQueue = "home_cancel_skill_queue",
  BuildShip = "home_build_ship",
}

export interface UpgradeBuildingPayload {
  buildingType: BuildingType;
}

export interface QueueSkillPayload {
  skillId: SkillId;
}

export interface BuildShipPayload {
  shipClass: string;
}

export enum HomeResponse {
  ProfileSync = "home_profile_sync",
  ResourcesCollected = "home_resources_collected",
  BuildingUpgraded = "home_building_upgraded",
  SkillQueued = "home_skill_queued",
  SkillCompleted = "home_skill_completed",
  ShipBuilt = "home_ship_built",
  HomeError = "home_error",
}
