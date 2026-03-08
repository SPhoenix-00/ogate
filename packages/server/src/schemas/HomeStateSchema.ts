import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { SocialStateSchema } from "./SocialSchema.js";

export class BuildingSchema extends Schema {
  @type("string") buildingType: string = "";
  @type("int32") level: number = 0;
  @type("boolean") upgrading: boolean = false;
  @type("float64") upgradeCompleteAt: number = 0;
}

export class SkillSchema extends Schema {
  @type("string") skillId: string = "";
  @type("int32") level: number = 0;
}

export class SkillQueueItemSchema extends Schema {
  @type("string") skillId: string = "";
  @type("int32") targetLevel: number = 0;
  @type("float64") completeAt: number = 0;
}

export class HomeShipSchema extends Schema {
  @type("string") id: string = "";
  @type("string") shipClass: string = "";
  @type("float32") hullHp: number = 0;
  @type("float32") maxHullHp: number = 0;
  @type("float32") firepower: number = 0;
  @type("float32") mass: number = 0;
}

export class HomeStateSchema extends Schema {
  @type("string") playerId: string = "";
  @type("string") playerName: string = "";

  @type("float64") ore: number = 500;
  @type("float64") biomass: number = 300;
  @type("float64") energy: number = 200;
  @type("float64") nanites: number = 0;
  @type("float64") nebulite: number = 0;
  @type("float64") artifacts: number = 0;
  @type("int32") capacitors1MW: number = 3;
  @type("int32") capacitors1GW: number = 0;
  @type("int32") crystals: number = 0;

  @type({ map: BuildingSchema }) buildings = new MapSchema<BuildingSchema>();
  @type({ map: SkillSchema }) skills = new MapSchema<SkillSchema>();
  @type([SkillQueueItemSchema]) skillQueue = new ArraySchema<SkillQueueItemSchema>();
  @type([HomeShipSchema]) fleet = new ArraySchema<HomeShipSchema>();

  @type("float64") lastCollectedAt: number = Date.now();

  /** Ship class currently under construction (empty = shipyard idle). */
  @type("string") shipBuildClass: string = "";
  /** Unix-ms timestamp when the current ship build completes. */
  @type("float64") shipBuildCompleteAt: number = 0;

  @type(SocialStateSchema) social: SocialStateSchema = new SocialStateSchema();
}
