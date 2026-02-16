import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";

export class FactionStandingSchema extends Schema {
  @type("string") factionId: string = "";
  @type("float32") reputation: number = 0;
}

export class ContractSchema extends Schema {
  @type("string") contractId: string = "";
  @type("string") contractType: string = "";
  @type("string") name: string = "";
  @type("int32") targetAmount: number = 0;
  @type("int32") currentProgress: number = 0;
  @type("boolean") completed: boolean = false;
  @type("int32") commendationReward: number = 0;
}

export class ResearchNodeSchema extends Schema {
  @type("string") nodeId: string = "";
  @type("int32") level: number = 0;
  @type("boolean") researching: boolean = false;
  @type("float64") completeAt: number = 0;
}

export class SocialStateSchema extends Schema {
  @type("string") pledgedFaction: string = "";
  @type("int32") commendations: number = 0;

  @type({ map: FactionStandingSchema }) factionStandings = new MapSchema<FactionStandingSchema>();
  @type([ContractSchema]) activeContracts = new ArraySchema<ContractSchema>();
  @type({ map: ResearchNodeSchema }) research = new MapSchema<ResearchNodeSchema>();

  @type("float64") factionContributedResources: number = 0;
}
