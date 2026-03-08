import { v4 as uuid } from "uuid";
import {
  FactionId,
  FACTION_DEFS,
  ContractType,
  CONTRACT_DEFS,
  RESEARCH_TREE,
  ResearchBranch,
  type ResearchNodeDef,
} from "@ogate/shared";
import type { HomeStateSchema } from "../schemas/HomeStateSchema.js";
import {
  SocialStateSchema,
  FactionStandingSchema,
  ContractSchema,
  ResearchNodeSchema,
} from "../schemas/SocialSchema.js";

/**
 * Initialize social state with default standings and daily contracts.
 */
export function initializeSocialState(social: SocialStateSchema): void {
  for (const fid of Object.values(FactionId)) {
    const standing = new FactionStandingSchema();
    standing.factionId = fid;
    standing.reputation = 0;
    social.factionStandings.set(fid, standing);
  }

  generateDailyContracts(social);
}

/**
 * Pledge loyalty to a faction.
 */
export function pledgeFaction(social: SocialStateSchema, factionId: FactionId): string | null {
  if (!FACTION_DEFS[factionId]) return "Unknown faction.";
  if (social.pledgedFaction === factionId) return "Already pledged to this faction.";

  social.pledgedFaction = factionId;
  return null;
}

/**
 * Contribute resources to the faction research pool.
 */
export function contributeFactionResources(
  homeState: HomeStateSchema,
  social: SocialStateSchema,
  oreAmount: number,
  biomassAmount: number,
): string | null {
  if (!social.pledgedFaction) return "Not pledged to any faction.";
  if (homeState.ore < oreAmount) return "Not enough ore.";
  if (homeState.biomass < biomassAmount) return "Not enough biomass.";

  homeState.ore -= oreAmount;
  homeState.biomass -= biomassAmount;
  social.factionContributedResources += oreAmount + biomassAmount;

  const standing = social.factionStandings.get(social.pledgedFaction);
  if (standing) {
    standing.reputation += (oreAmount + biomassAmount) * 0.01;
  }

  return null;
}

/**
 * Generate fresh daily contracts from the SDI (Stellar Defense Initiative).
 */
export function generateDailyContracts(social: SocialStateSchema): void {
  social.activeContracts.splice(0, social.activeContracts.length);

  const types = Object.values(ContractType);
  const count = Math.min(3, types.length);
  const selected = shuffle(types).slice(0, count);

  for (const ct of selected) {
    const def = CONTRACT_DEFS[ct];
    const contract = new ContractSchema();
    contract.contractId = uuid();
    contract.contractType = ct;
    contract.name = def.name;
    contract.targetAmount = def.targetAmount;
    contract.currentProgress = 0;
    contract.completed = false;
    contract.commendationReward = def.commendationReward;
    social.activeContracts.push(contract);
  }
}

/**
 * Progress a contract by a certain amount. Returns true if the contract was completed.
 */
export function progressContract(social: SocialStateSchema, contractId: string, amount: number): boolean {
  for (const contract of social.activeContracts) {
    if (contract.contractId === contractId && !contract.completed) {
      contract.currentProgress += amount;
      if (contract.currentProgress >= contract.targetAmount) {
        contract.completed = true;
        social.commendations += contract.commendationReward;
        return true;
      }
      return false;
    }
  }
  return false;
}

/**
 * Start researching a node. Returns error or null.
 */
export function startResearch(
  homeState: HomeStateSchema,
  social: SocialStateSchema,
  nodeId: string,
): string | null {
  const def = RESEARCH_TREE.find(n => n.id === nodeId);
  if (!def) return "Unknown research node.";

  let node = social.research.get(nodeId);
  if (!node) {
    node = new ResearchNodeSchema();
    node.nodeId = nodeId;
    node.level = 0;
    social.research.set(nodeId, node);
  }

  if (node.researching) return "Already researching this node.";
  if (node.level >= def.maxLevel) return "Already at max level.";

  for (const prereq of def.prerequisites) {
    const prereqNode = social.research.get(prereq);
    if (!prereqNode || prereqNode.level < 1) {
      return `Prerequisite not met: ${prereq}`;
    }
  }

  const levelMult = Math.pow(1.5, node.level);
  const costOre = Math.round(def.costOre * levelMult);
  const costBiomass = Math.round(def.costBiomass * levelMult);
  const costEnergy = Math.round(def.costEnergy * levelMult);

  if (homeState.ore < costOre) return `Not enough ore (need ${costOre}).`;
  if (homeState.biomass < costBiomass) return `Not enough biomass (need ${costBiomass}).`;
  if (homeState.energy < costEnergy) return `Not enough energy (need ${costEnergy}).`;

  homeState.ore -= costOre;
  homeState.biomass -= costBiomass;
  homeState.energy -= costEnergy;

  const timeSec = Math.round(def.researchTimeSec * levelMult);
  node.researching = true;
  node.completeAt = Date.now() + timeSec * 1000;

  return null;
}

/**
 * Tick research timers. Returns completed node IDs.
 */
export function tickResearch(social: SocialStateSchema): string[] {
  const completed: string[] = [];
  const now = Date.now();

  social.research.forEach((node) => {
    if (node.researching && now >= node.completeAt) {
      node.level += 1;
      node.researching = false;
      node.completeAt = 0;
      completed.push(node.nodeId);
    }
  });

  return completed;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
