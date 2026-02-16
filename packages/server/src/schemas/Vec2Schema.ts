import { Schema, type } from "@colyseus/schema";

export class Vec2Schema extends Schema {
  @type("float32") x: number = 0;
  @type("float32") y: number = 0;
}
