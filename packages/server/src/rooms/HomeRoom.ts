import { Room, Client } from "@colyseus/core";
import {
  HomeAction,
  HomeResponse,
  SocialAction,
  SocialResponse,
  ShopAction,
  ShopResponse,
  ShopItemId,
  type UpgradeBuildingPayload,
  type QueueSkillPayload,
  type BuildShipPayload,
  type RepairShipPayload,
  type PledgeFactionPayload,
  type ContributeFactionResourcesPayload,
  type ProgressContractPayload,
  type StartResearchPayload,
  type PurchaseItemPayload,
  BuildingType,
  SkillId,
  FactionId,
} from "@ogate/shared";
import { HomeStateSchema } from "../schemas/HomeStateSchema.js";
import {
  initializeHomeState,
  collectResources,
  getEffectiveProductionRates,
  upgradeBuilding,
  tickBuildingUpgrades,
  queueSkill,
  tickSkillQueue,
  cancelLastSkillQueueItem,
  buildShip,
  tickShipBuild,
  cancelShipBuild,
  repairShip,
} from "../systems/economySystem.js";
import {
  initializeSocialState,
  pledgeFaction,
  contributeFactionResources,
  progressContract,
  startResearch,
  tickResearch,
  generateDailyContracts,
} from "../systems/socialSystem.js";
import { purchaseShopItem } from "../systems/shopSystem.js";

const TICK_RATE_MS = 5000;

export class HomeRoom extends Room<HomeStateSchema> {
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  onCreate(options: { playerId?: string; playerName?: string }): void {
    const state = new HomeStateSchema();
    state.playerId = options.playerId ?? "unknown";
    state.playerName = options.playerName ?? "Player";

    initializeHomeState(state);
    initializeSocialState(state.social);
    this.setState(state);
    this.maxClients = 1;

    this.registerMessages();
    this.startTick();

    console.log(`[HomeRoom] Created for ${state.playerName}`);
  }

  onJoin(client: Client): void {
    collectResources(this.state);
    const rates = getEffectiveProductionRates(this.state);
    client.send(HomeResponse.ProfileSync, { connected: true, productionRates: rates });
    console.log(`[HomeRoom] ${this.state.playerName} connected`);
  }

  onLeave(_client: Client): void {
    console.log(`[HomeRoom] ${this.state.playerName} disconnected`);
  }

  onDispose(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    console.log(`[HomeRoom] Disposed for ${this.state.playerName}`);
  }

  private registerMessages(): void {
    // ── Economy ────────────────────────────────────────

    this.onMessage(HomeAction.CollectResources, (client) => {
      const gains = collectResources(this.state);
      client.send(HomeResponse.ResourcesCollected, gains);
    });

    this.onMessage(HomeAction.UpgradeBuilding, (client, payload: UpgradeBuildingPayload) => {
      const error = upgradeBuilding(this.state, payload.buildingType as BuildingType);
      if (error) {
        client.send(HomeResponse.HomeError, { message: error });
      } else {
        client.send(HomeResponse.BuildingUpgraded, { buildingType: payload.buildingType });
      }
    });

    this.onMessage(HomeAction.QueueSkill, (client, payload: QueueSkillPayload) => {
      const error = queueSkill(this.state, payload.skillId as SkillId);
      if (error) {
        client.send(HomeResponse.HomeError, { message: error });
      } else {
        client.send(HomeResponse.SkillQueued, { skillId: payload.skillId });
      }
    });

    this.onMessage(HomeAction.CancelSkillQueue, (client) => {
      const error = cancelLastSkillQueueItem(this.state);
      if (error) {
        client.send(HomeResponse.HomeError, { message: error });
      } else {
        client.send(HomeResponse.SkillQueueCancelled, {});
      }
    });

    this.onMessage(HomeAction.BuildShip, (client, payload: BuildShipPayload) => {
      const result = buildShip(this.state, payload.shipClass);
      if (result.error) {
        client.send(HomeResponse.HomeError, { message: result.error });
      } else {
        client.send(HomeResponse.ShipBuildStarted, {
          shipClass: payload.shipClass,
          buildTimeMs: result.started!.buildTimeMs,
          completeAt: result.started!.completeAt,
        });
      }
    });

    this.onMessage(HomeAction.CancelShipBuild, (client) => {
      const error = cancelShipBuild(this.state);
      if (error) {
        client.send(HomeResponse.HomeError, { message: error });
      } else {
        client.send(HomeResponse.ShipBuildCancelled, {});
      }
    });

    this.onMessage(HomeAction.RepairShip, (client, payload: RepairShipPayload) => {
      const result = repairShip(this.state, payload.shipId);
      if (result.error) {
        client.send(HomeResponse.HomeError, { message: result.error });
      } else {
        client.send(HomeResponse.ShipRepaired, {
          shipId: payload.shipId,
          cost: result.cost,
        });
      }
    });

    // ── Social ─────────────────────────────────────────

    this.onMessage(SocialAction.PledgeFaction, (client, payload: PledgeFactionPayload) => {
      const error = pledgeFaction(this.state.social, payload.factionId as FactionId);
      if (error) {
        client.send(SocialResponse.SocialError, { message: error });
      } else {
        client.send(SocialResponse.FactionPledged, { factionId: payload.factionId });
      }
    });

    this.onMessage(SocialAction.ContributeFactionResources, (client, payload: ContributeFactionResourcesPayload) => {
      const error = contributeFactionResources(
        this.state, this.state.social,
        payload.oreAmount, payload.biomassAmount,
      );
      if (error) {
        client.send(SocialResponse.SocialError, { message: error });
      } else {
        client.send(SocialResponse.ResourcesContributed, {
          oreAmount: payload.oreAmount,
          biomassAmount: payload.biomassAmount,
        });
      }
    });

    this.onMessage(SocialAction.ProgressContract, (client, payload: ProgressContractPayload) => {
      const completed = progressContract(this.state.social, payload.contractId, payload.amount);
      if (completed) {
        client.send(SocialResponse.ContractCompleted, { contractId: payload.contractId });
      } else {
        client.send(SocialResponse.ContractProgressed, { contractId: payload.contractId });
      }
    });

    this.onMessage(SocialAction.StartResearch, (client, payload: StartResearchPayload) => {
      const error = startResearch(this.state, this.state.social, payload.nodeId);
      if (error) {
        client.send(SocialResponse.SocialError, { message: error });
      } else {
        client.send(SocialResponse.ResearchStarted, { nodeId: payload.nodeId });
      }
    });

    this.onMessage(SocialAction.RefreshContracts, (client) => {
      generateDailyContracts(this.state.social);
      client.send(SocialResponse.ContractsRefreshed, {});
    });

    // ── Shop ───────────────────────────────────────────

    this.onMessage(ShopAction.PurchaseItem, (client, payload: PurchaseItemPayload) => {
      const result = purchaseShopItem(this.state, this.state.crystals, payload.itemId as ShopItemId);
      if (result.error) {
        client.send(ShopResponse.ShopError, { message: result.error });
      } else {
        this.state.crystals = result.newCrystals;
        client.send(ShopResponse.PurchaseSuccess, { itemId: payload.itemId, remainingCrystals: result.newCrystals });
      }
    });

    this.onMessage(ShopAction.GetBalance, (client) => {
      client.send(ShopResponse.BalanceUpdate, { crystals: this.state.crystals });
    });
  }

  private startTick(): void {
    this.tickInterval = setInterval(() => {
      const completedBuildings = tickBuildingUpgrades(this.state);
      for (const bt of completedBuildings) {
        this.broadcast(HomeResponse.BuildingUpgraded, { buildingType: bt, completed: true });
      }

      const completedSkills = tickSkillQueue(this.state);
      for (const sk of completedSkills) {
        this.broadcast(HomeResponse.SkillCompleted, { skillId: sk });
      }

      const completedShip = tickShipBuild(this.state);
      if (completedShip) {
        this.broadcast(HomeResponse.ShipBuildComplete, { shipClass: completedShip });
      }

      const completedResearch = tickResearch(this.state.social);
      for (const nodeId of completedResearch) {
        this.broadcast(SocialResponse.ResearchCompleted, { nodeId });
      }
    }, TICK_RATE_MS);
  }
}
