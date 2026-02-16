import type { FactionId } from "./social.js";

export enum SocialAction {
  PledgeFaction = "social_pledge_faction",
  ContributeFactionResources = "social_contribute_resources",
  ProgressContract = "social_progress_contract",
  StartResearch = "social_start_research",
  RefreshContracts = "social_refresh_contracts",
}

export interface PledgeFactionPayload {
  factionId: FactionId;
}

export interface ContributeFactionResourcesPayload {
  oreAmount: number;
  biomassAmount: number;
}

export interface ProgressContractPayload {
  contractId: string;
  amount: number;
}

export interface StartResearchPayload {
  nodeId: string;
}

export enum SocialResponse {
  FactionPledged = "social_faction_pledged",
  ResourcesContributed = "social_resources_contributed",
  ContractProgressed = "social_contract_progressed",
  ContractCompleted = "social_contract_completed",
  ResearchStarted = "social_research_started",
  ResearchCompleted = "social_research_completed",
  ContractsRefreshed = "social_contracts_refreshed",
  SocialError = "social_error",
}
