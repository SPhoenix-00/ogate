import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Vec2Schema } from "./Vec2Schema.js";
import { ShipSchema } from "./ShipSchema.js";

export class PlayerSchema extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") state: string = "IDLE";
  @type("string") currentNodeId: string = "";
  @type("string") exitFrameNodeId: string = "";
  @type(Vec2Schema) position: Vec2Schema = new Vec2Schema();
  @type([ShipSchema]) ships = new ArraySchema<ShipSchema>();
  @type("float32") totalMass: number = 0;
  @type("float32") cargoOre: number = 0;
  @type("float32") cargoBiomass: number = 0;
}
