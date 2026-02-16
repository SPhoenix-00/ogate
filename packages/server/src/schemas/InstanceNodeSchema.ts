import { Schema, type } from "@colyseus/schema";
import { Vec2Schema } from "./Vec2Schema.js";

export class InstanceNodeSchema extends Schema {
  @type("string") id: string = "";
  @type("string") nodeType: string = "";
  @type("string") name: string = "";
  @type(Vec2Schema) position: Vec2Schema = new Vec2Schema();
  @type("float32") oreAmount: number = 0;
  @type("float32") biomassAmount: number = 0;
}
