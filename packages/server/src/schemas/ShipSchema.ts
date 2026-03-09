import { Schema, type } from "@colyseus/schema";

export class ShipSchema extends Schema {
  @type("string") id: string = "";
  @type("string") shipClass: string = "";
  @type("float32") hullHp: number = 0;
  @type("float32") maxHullHp: number = 0;
  @type("float32") firepower: number = 0;
  @type("float32") mass: number = 0;
  @type("float32") evasion: number = 0;
  @type("float32") pointDefense: number = 0;
}
