import { Room, Client } from "@colyseus/core";
import { v4 as uuid } from "uuid";
import {
  ClientMessage,
  ServerMessage,
  PlayerInstanceState,
  InstanceState,
  NodeType,
  EntropyAction,
  CombatStance,
  CAPACITOR_1MW_PLAYER_CAP,
  CAPACITOR_1GW_PLAYER_CAP,
  SCAN_DURATION_MS,
  INSTANCE_MAP_RADIUS,
  SHIP_BLUEPRINTS,
  type ShipClass,
} from "@ogate/shared";
import type {
  WarpToNodePayload,
  AttackPayload,
  LootNodePayload,
  SetCombatStancePayload,
  ExtractResourcesPayload,
} from "@ogate/shared";
import { OGateRoomState } from "../schemas/OGateRoomState.js";
import { PlayerSchema } from "../schemas/PlayerSchema.js";
import { ShipSchema } from "../schemas/ShipSchema.js";
import { Vec2Schema } from "../schemas/Vec2Schema.js";
import { InstanceNodeSchema } from "../schemas/InstanceNodeSchema.js";
import { ContingentSchema } from "../schemas/ContingentSchema.js";
import { generateInstanceNodes, randomEdgePosition } from "../systems/instanceGenerator.js";
import { tickEntropy, deductEntropy, canEnterInstance } from "../systems/entropySystem.js";
import { calculateWarpTime, calculateExitSpoolTime, getAlertLeadTimeMs, getAlertDispatchDelay } from "../systems/warpSystem.js";
import { resolveCombat } from "../systems/combatSystem.js";
import { performScan, resetPingCounts, purgeTarget } from "../systems/scanSystem.js";
import { processEmergencyEscape } from "../systems/transponderSystem.js";

const TICK_RATE_MS = 1000;

export class OGateRoom extends Room<OGateRoomState> {
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private warpTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private scanTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private exitTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private playerStances = new Map<string, CombatStance>();

  onCreate(options: { capacitorTier?: string }): void {
    const state = new OGateRoomState();
    state.instanceId = uuid();
    state.capacitorTier = options.capacitorTier ?? "1MW";
    state.playerCap = state.capacitorTier === "1GW"
      ? CAPACITOR_1GW_PLAYER_CAP
      : CAPACITOR_1MW_PLAYER_CAP;
    state.entropy = 100;
    state.instanceState = InstanceState.Active;
    state.mapRadius = INSTANCE_MAP_RADIUS;

    const nodes = generateInstanceNodes();
    for (const node of nodes) {
      state.nodes.push(node);
    }

    this.setState(state);
    this.maxClients = state.playerCap;

    this.registerMessages();
    this.startTick();

    console.log(`[OGateRoom] Created instance ${state.instanceId} (${state.capacitorTier}) with ${nodes.length} nodes`);
  }

  onJoin(client: Client, options: {
    playerId?: string;
    playerName?: string;
    ships?: Array<{
      shipClass: string;
      hullHp: number;
      maxHullHp: number;
      firepower: number;
      mass: number;
      evasion?: number;
      pointDefense?: number;
    }>;
    contingents?: Array<{
      contingentType: string;
      name: string;
      strength: number;
      maxStrength: number;
      xp?: number;
    }>;
  }): void {
    const state = this.state;

    if (state.instanceState !== InstanceState.Active) {
      client.send(ServerMessage.Error, { message: "Instance is collapsed or despawned." });
      client.leave();
      return;
    }

    const playerId = options.playerId ?? client.sessionId;
    const playerName = options.playerName ?? `Player-${client.sessionId.substring(0, 4)}`;

    const player = new PlayerSchema();
    player.id = playerId;
    player.name = playerName;
    player.state = PlayerInstanceState.Idle;

    const exitPos = randomEdgePosition(state.mapRadius);
    const exitNode = new InstanceNodeSchema();
    exitNode.id = uuid();
    exitNode.nodeType = NodeType.ExitFrame;
    exitNode.name = `Exit Frame (${playerName})`;
    exitNode.position = exitPos;
    state.nodes.push(exitNode);

    player.exitFrameNodeId = exitNode.id;
    player.currentNodeId = exitNode.id;
    player.position = exitPos;

    if (options.ships && options.ships.length > 0) {
      for (const shipData of options.ships) {
        const bp = SHIP_BLUEPRINTS[shipData.shipClass as ShipClass];
        const ship = new ShipSchema();
        ship.id = uuid();
        ship.shipClass = shipData.shipClass;
        ship.hullHp = shipData.hullHp;
        ship.maxHullHp = shipData.maxHullHp;
        ship.firepower = shipData.firepower;
        ship.mass = shipData.mass;
        ship.evasion = shipData.evasion ?? bp?.evasion ?? 0;
        ship.pointDefense = shipData.pointDefense ?? bp?.pointDefense ?? 0;
        player.ships.push(ship);
      }
    } else {
      const bp = SHIP_BLUEPRINTS["PROBE" as ShipClass];
      const probe = new ShipSchema();
      probe.id = uuid();
      probe.shipClass = "PROBE";
      probe.hullHp = bp.hullHp;
      probe.maxHullHp = bp.hullHp;
      probe.firepower = bp.firepower;
      probe.mass = bp.mass;
      probe.evasion = bp.evasion;
      probe.pointDefense = bp.pointDefense;
      player.ships.push(probe);
    }

    if (options.contingents) {
      for (const cData of options.contingents) {
        const contingent = new ContingentSchema();
        contingent.id = uuid();
        contingent.contingentType = cData.contingentType;
        contingent.name = cData.name;
        contingent.strength = cData.strength;
        contingent.maxStrength = cData.maxStrength;
        contingent.xp = cData.xp ?? 0;
        player.contingents.push(contingent);
      }
    }

    player.totalMass = 0;
    for (const ship of player.ships) {
      player.totalMass += ship.mass;
    }

    if (!canEnterInstance(state, player.totalMass)) {
      client.send(ServerMessage.Error, { message: "Fleet mass would breach the 25% Entropy floor." });
      client.leave();
      return;
    }

    deductEntropy(state, EntropyAction.FleetEntry, player.totalMass);
    state.players.set(client.sessionId, player);

    this.broadcast(ServerMessage.PlayerJoined, {
      playerId: player.id,
      playerName: player.name,
      nodeId: player.currentNodeId,
    });

    this.broadcastLocalVisibility(player.currentNodeId);

    console.log(`[OGateRoom] ${player.name} joined instance ${state.instanceId} (entropy: ${state.entropy.toFixed(1)}%)`);
  }

  onLeave(client: Client): void {
    this.clearPlayerTimers(client.sessionId);
    this.playerStances.delete(client.sessionId);
    const player = this.state.players.get(client.sessionId);
    if (player) {
      resetPingCounts(player.id);
      purgeTarget(player.id);
      this.broadcast(ServerMessage.PlayerLeft, { playerId: player.id });
      this.state.players.delete(client.sessionId);
    }
    console.log(`[OGateRoom] Client ${client.sessionId} left`);
  }

  onDispose(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    for (const timer of this.warpTimers.values()) clearTimeout(timer);
    for (const timer of this.scanTimers.values()) clearTimeout(timer);
    for (const timer of this.exitTimers.values()) clearTimeout(timer);
    console.log(`[OGateRoom] Instance ${this.state.instanceId} disposed`);
  }

  private registerMessages(): void {
    this.onMessage(ClientMessage.WarpToNode, (client, payload: WarpToNodePayload) => {
      this.handleWarp(client, payload);
    });

    this.onMessage(ClientMessage.InitiateScan, (client) => {
      this.handleScan(client);
    });

    this.onMessage(ClientMessage.Attack, (client, payload: AttackPayload) => {
      this.handleAttack(client, payload);
    });

    this.onMessage(ClientMessage.InitiateExit, (client) => {
      this.handleExit(client);
    });

    this.onMessage(ClientMessage.LootNode, (client, payload: LootNodePayload) => {
      this.handleLoot(client, payload);
    });

    this.onMessage(ClientMessage.EmergencyWarp, (client) => {
      this.handleEmergencyWarp(client);
    });

    this.onMessage(ClientMessage.ExtractResources, (client, payload: ExtractResourcesPayload) => {
      this.handleExtractResources(client, payload);
    });

    this.onMessage(ClientMessage.SetCombatStance, (client, payload: SetCombatStancePayload) => {
      this.playerStances.set(client.sessionId, payload.stance);
    });
  }

  private startTick(): void {
    this.tickInterval = setInterval(() => {
      const result = tickEntropy(this.state, TICK_RATE_MS / 1000);

      if (result.shouldCollapse) {
        this.broadcast(ServerMessage.InstanceCollapse, { reason: "Entropy reached 0%" });
        this.handleCollapse();
      }

      if (result.shouldDespawn) {
        console.log(`[OGateRoom] Instance ${this.state.instanceId} despawned (empty, entropy < 33%)`);
        this.disconnect();
      }
    }, TICK_RATE_MS);
  }

  // ── Warp ─────────────────────────────────────────────

  private handleWarp(client: Client, payload: WarpToNodePayload): void {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    if (player.state !== PlayerInstanceState.Idle) {
      client.send(ServerMessage.Error, { message: "Cannot warp while busy." });
      return;
    }

    const targetNode = this.state.nodes.find(n => n.id === payload.targetNodeId);
    if (!targetNode) {
      client.send(ServerMessage.Error, { message: "Invalid target node." });
      return;
    }

    if (player.currentNodeId === payload.targetNodeId) {
      client.send(ServerMessage.Error, { message: "Already at this node." });
      return;
    }

    const warpTime = calculateWarpTime(player.position, targetNode.position, player.totalMass);
    deductEntropy(this.state, EntropyAction.Warp);

    player.state = PlayerInstanceState.Warping;

    const arrivalTime = Date.now() + warpTime;
    this.broadcast(ServerMessage.WarpStarted, {
      playerId: player.id,
      targetNodeId: payload.targetNodeId,
      arrivalTime,
    });

    this.broadcastProximityAlert(client.sessionId, payload.targetNodeId, warpTime);

    const timer = setTimeout(() => {
      player.state = PlayerInstanceState.Idle;
      player.currentNodeId = targetNode.id;
      player.position.x = targetNode.position.x;
      player.position.y = targetNode.position.y;

      this.broadcast(ServerMessage.WarpComplete, {
        playerId: player.id,
        nodeId: targetNode.id,
      });

      this.broadcastLocalVisibility(targetNode.id);
      this.warpTimers.delete(client.sessionId);
    }, warpTime);

    this.warpTimers.set(client.sessionId, timer);
  }

  // ── Scan ─────────────────────────────────────────────

  private handleScan(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    if (player.state !== PlayerInstanceState.Idle) {
      client.send(ServerMessage.Error, { message: "Cannot scan while busy." });
      return;
    }

    player.state = PlayerInstanceState.Scanning;

    this.broadcast(ServerMessage.ScanAlert, {
      scannerNodeId: player.currentNodeId,
      scannerPlayerId: player.id,
    }, { except: client });

    const timer = setTimeout(() => {
      player.state = PlayerInstanceState.Idle;

      const hits = performScan(this.state, player.id);
      const results = hits.map(h => ({
        nodeId: h.nodeId,
        position: { x: h.positionX, y: h.positionY },
        rippleMagnitude: h.rippleMagnitude,
        threatAssessment: h.threatAssessment,
        hasWarpSolution: h.hasWarpSolution,
        pingsRequired: h.pingsRequired,
      }));

      client.send(ServerMessage.ScanResults, { results });
      this.scanTimers.delete(client.sessionId);
    }, SCAN_DURATION_MS);

    this.scanTimers.set(client.sessionId, timer);
  }

  // ── Attack ───────────────────────────────────────────

  private handleAttack(client: Client, payload: AttackPayload): void {
    const attacker = this.state.players.get(client.sessionId);
    if (!attacker) return;

    if (attacker.state !== PlayerInstanceState.Idle) {
      client.send(ServerMessage.Error, { message: "Cannot attack while busy." });
      return;
    }

    const found = this.findPlayerByPlayerId(payload.targetPlayerId);
    if (!found) {
      client.send(ServerMessage.Error, { message: "Target not found." });
      return;
    }

    const { sessionId: defenderSessionId, player: defender } = found;

    if (attacker.currentNodeId !== defender.currentNodeId) {
      client.send(ServerMessage.Error, { message: "Target is not at the same node." });
      return;
    }

    if (defender.state === PlayerInstanceState.Exited) {
      client.send(ServerMessage.Error, { message: "Target has already exited." });
      return;
    }

    const exitTimer = this.exitTimers.get(defenderSessionId);
    if (exitTimer) {
      clearTimeout(exitTimer);
      this.exitTimers.delete(defenderSessionId);
      defender.state = PlayerInstanceState.Idle;
    }

    attacker.state = PlayerInstanceState.InCombat;
    defender.state = PlayerInstanceState.InCombat;

    deductEntropy(this.state, EntropyAction.Combat);

    const attackerStance = payload.stance
      ?? this.playerStances.get(client.sessionId)
      ?? CombatStance.Balanced;
    const defenderStance = this.playerStances.get(defenderSessionId)
      ?? CombatStance.Balanced;

    const outcome = resolveCombat(attacker, defender, attackerStance, defenderStance);

    attacker.state = PlayerInstanceState.Idle;
    defender.state = PlayerInstanceState.Idle;

    const result = {
      winnerId: outcome.winnerId,
      loserId: outcome.loserId,
      winnerDamage: outcome.winnerDamage,
      loserDamage: outcome.loserDamage,
    };

    this.broadcast(ServerMessage.CombatResolved, { result });
  }

  // ── Exit ─────────────────────────────────────────────

  private handleExit(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    if (player.state !== PlayerInstanceState.Idle) {
      client.send(ServerMessage.Error, { message: "Cannot exit while busy." });
      return;
    }

    if (player.currentNodeId !== player.exitFrameNodeId) {
      client.send(ServerMessage.Error, { message: "Must be at your Exit Frame to leave." });
      return;
    }

    const spoolTime = calculateExitSpoolTime(player.totalMass);
    player.state = PlayerInstanceState.SpoolingExit;

    this.broadcast(ServerMessage.ExitSpoolStarted, {
      playerId: player.id,
      spoolDurationMs: spoolTime,
    });

    const timer = setTimeout(() => {
      player.state = PlayerInstanceState.Exited;

      client.send(ServerMessage.ExitComplete, {
        playerId: player.id,
        cargoOre: player.cargoOre,
        cargoBiomass: player.cargoBiomass,
      });

      this.broadcast(ServerMessage.PlayerLeft, { playerId: player.id }, { except: client });
      this.exitTimers.delete(client.sessionId);
    }, spoolTime);

    this.exitTimers.set(client.sessionId, timer);
  }

  // ── Loot ─────────────────────────────────────────────

  private handleLoot(client: Client, payload: LootNodePayload): void {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    if (player.state !== PlayerInstanceState.Idle) {
      client.send(ServerMessage.Error, { message: "Cannot loot while busy." });
      return;
    }

    const node = this.state.nodes.find(n => n.id === payload.nodeId);
    if (!node) {
      client.send(ServerMessage.Error, { message: "Node not found." });
      return;
    }

    if (player.currentNodeId !== node.id) {
      client.send(ServerMessage.Error, { message: "Not at this node." });
      return;
    }

    let looted = false;
    if (node.oreAmount > 0) {
      const amount = Math.min(node.oreAmount, 50);
      node.oreAmount -= amount;
      player.cargoOre += amount;
      looted = true;
      client.send(ServerMessage.LootCollected, { nodeId: node.id, resourceType: "ORE", amount });
    }
    if (node.biomassAmount > 0) {
      const amount = Math.min(node.biomassAmount, 30);
      node.biomassAmount -= amount;
      player.cargoBiomass += amount;
      looted = true;
      client.send(ServerMessage.LootCollected, { nodeId: node.id, resourceType: "BIOMASS", amount });
    }

    if (looted) {
      deductEntropy(this.state, EntropyAction.Loot);
    } else {
      client.send(ServerMessage.Error, { message: "Nothing to loot here." });
    }
  }

  // ── Emergency Warp ───────────────────────────────────

  private handleEmergencyWarp(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    if (player.state === PlayerInstanceState.Exited) {
      client.send(ServerMessage.Error, { message: "Already exited." });
      return;
    }

    this.clearPlayerTimers(client.sessionId);

    player.state = PlayerInstanceState.EmergencyWarping;
    const result = processEmergencyEscape(player);
    player.state = PlayerInstanceState.Exited;

    resetPingCounts(player.id);
    purgeTarget(player.id);

    client.send(ServerMessage.EmergencyWarpResult, { result });
    this.broadcast(ServerMessage.PlayerLeft, { playerId: player.id }, { except: client });
  }

  // ── Extract Resources ───────────────────────────────

  private handleExtractResources(client: Client, payload: ExtractResourcesPayload): void {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    if (player.state !== PlayerInstanceState.Idle) {
      client.send(ServerMessage.Error, { message: "Cannot extract while busy." });
      return;
    }

    const node = this.state.nodes.find(n => n.id === payload.nodeId);
    if (!node) {
      client.send(ServerMessage.Error, { message: "Node not found." });
      return;
    }

    if (player.currentNodeId !== node.id) {
      client.send(ServerMessage.Error, { message: "Not at this node." });
      return;
    }

    player.state = PlayerInstanceState.Extracting;

    let extracted = false;
    if (payload.resourceType === "ORE" && node.oreAmount > 0) {
      const amount = Math.min(node.oreAmount, 25);
      node.oreAmount -= amount;
      player.cargoOre += amount;
      extracted = true;
      client.send(ServerMessage.LootCollected, { nodeId: node.id, resourceType: "ORE", amount });
    } else if (payload.resourceType === "BIOMASS" && node.biomassAmount > 0) {
      const amount = Math.min(node.biomassAmount, 15);
      node.biomassAmount -= amount;
      player.cargoBiomass += amount;
      extracted = true;
      client.send(ServerMessage.LootCollected, { nodeId: node.id, resourceType: "BIOMASS", amount });
    }

    if (extracted) {
      deductEntropy(this.state, EntropyAction.Extract);
      if (node.oreAmount <= 0 && node.biomassAmount <= 0) {
        this.broadcast(ServerMessage.NodeDepleted, { nodeId: node.id });
      }
    } else {
      client.send(ServerMessage.Error, { message: "No resources of that type available." });
    }

    player.state = PlayerInstanceState.Idle;
  }

  // ── Helpers ──────────────────────────────────────────

  private broadcastLocalVisibility(nodeId: string): void {
    const playersAtNode: PlayerSchema[] = [];
    this.state.players.forEach((p) => {
      if (p.currentNodeId === nodeId && p.state !== PlayerInstanceState.Exited) {
        playersAtNode.push(p);
      }
    });

    if (playersAtNode.length > 1) {
      for (const p of playersAtNode) {
        for (const other of playersAtNode) {
          if (other.id !== p.id) {
            const clientObj = this.clients.find(c => {
              const cp = this.state.players.get(c.sessionId);
              return cp?.id === p.id;
            });
            if (clientObj) {
              clientObj.send(ServerMessage.FleetVisible, {
                playerId: other.id,
                shipCount: other.ships.length,
                totalMass: other.totalMass,
              });
            }
          }
        }
      }
    }
  }

  private broadcastProximityAlert(warperSessionId: string, targetNodeId: string, totalWarpMs: number): void {
    const warper = this.state.players.get(warperSessionId);
    const warperMass = warper?.totalMass ?? 10;
    const alertLeadMs = getAlertLeadTimeMs(warperMass);
    const alertDelay = getAlertDispatchDelay(totalWarpMs, alertLeadMs);

    this.state.players.forEach((p, sid) => {
      if (sid === warperSessionId) return;
      if (p.currentNodeId === targetNodeId && p.state !== PlayerInstanceState.Exited) {
        const clientObj = this.clients.find(c => c.sessionId === sid);
        if (clientObj) {
          setTimeout(() => {
            clientObj.send(ServerMessage.ProximityAlert, {
              incomingPlayerId: warper?.id ?? "unknown",
              etaMs: alertLeadMs,
            });
          }, alertDelay);
        }
      }
    });
  }

  private handleCollapse(): void {
    this.state.instanceState = InstanceState.Collapsed;
    this.clients.forEach(client => {
      client.leave();
    });
  }

  private findPlayerByPlayerId(playerId: string): { sessionId: string; player: PlayerSchema } | null {
    let result: { sessionId: string; player: PlayerSchema } | null = null;
    this.state.players.forEach((p: PlayerSchema, sid: string) => {
      if (p.id === playerId && !result) {
        result = { sessionId: sid, player: p };
      }
    });
    return result;
  }

  private clearPlayerTimers(sessionId: string): void {
    const warpTimer = this.warpTimers.get(sessionId);
    if (warpTimer) { clearTimeout(warpTimer); this.warpTimers.delete(sessionId); }

    const scanTimer = this.scanTimers.get(sessionId);
    if (scanTimer) { clearTimeout(scanTimer); this.scanTimers.delete(sessionId); }

    const exitTimer = this.exitTimers.get(sessionId);
    if (exitTimer) { clearTimeout(exitTimer); this.exitTimers.delete(sessionId); }
  }
}
