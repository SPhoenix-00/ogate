/**
 * Message types for Home System operations (REST-style or via WebSocket lobby).
 */

import type { BuildingType, SkillId } from "./economy.js";
import type { ShipClass } from "./types.js";

// ── Client → Server ──────────────────────────────────────

export enum HomeAction {
  GetProfile = "home_get_profile",
  CollectResources = "home_collect_resources",
  UpgradeBuilding = "home_upgrade_building",
  QueueSkill = "home_queue_skill",
  CancelSkillQueue = "home_cancel_skill_queue",
  BuildShip = "home_build_ship",
  CancelShipBuild = "home_cancel_ship_build",
  RepairShip = "home_repair_ship",
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

export interface RepairShipPayload {
  shipId: string;
}

// ── Server → Client ──────────────────────────────────────

export enum HomeResponse {
  ProfileSync = "home_profile_sync",
  ResourcesCollected = "home_resources_collected",
  BuildingUpgraded = "home_building_upgraded",
  SkillQueued = "home_skill_queued",
  SkillCompleted = "home_skill_completed",
  SkillQueueCancelled = "home_skill_queue_cancelled",
  ShipBuildStarted = "home_ship_build_started",
  ShipBuildComplete = "home_ship_build_complete",
  ShipBuildCancelled = "home_ship_build_cancelled",
  ShipBuilt = "home_ship_built",
  ShipRepaired = "home_ship_repaired",
  HomeError = "home_error",
}
