import { Schema, type } from "@colyseus/schema";

export class ContingentSchema extends Schema {
  @type("string") id: string = "";
  @type("string") contingentType: string = "";
  @type("string") name: string = "";
  @type("int32") strength: number = 0;
  @type("int32") maxStrength: number = 0;
  @type("int32") xp: number = 0;
  @type("boolean") injured: boolean = false;
}
