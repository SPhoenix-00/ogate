import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema.js";
import { InstanceNodeSchema } from "./InstanceNodeSchema.js";

export class OGateRoomState extends Schema {
  @type("string") instanceId: string = "";
  @type("string") capacitorTier: string = "1MW";
  @type("float32") entropy: number = 100;
  @type("string") instanceState: string = "ACTIVE";
  @type("int32") playerCap: number = 4;
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type([InstanceNodeSchema]) nodes = new ArraySchema<InstanceNodeSchema>();
  @type("float32") mapRadius: number = 1000;
}
