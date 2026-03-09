import { Client, Room } from "colyseus.js";
import {
  ClientMessage,
  ServerMessage,
  type WarpToNodePayload,
  type AttackPayload,
  type LootNodePayload,
  type ExtractResourcesPayload,
  type SetCombatStancePayload,
  type CombatStance,
  type ResourceType,
  CapacitorTier,
} from "@ogate/shared";

const SERVER_URL = "ws://localhost:2567";

export type MessageHandler = (type: string, data: unknown) => void;

export class NetworkManager {
  private client: Client;
  private room: Room | null = null;
  private listeners: MessageHandler[] = [];

  constructor() {
    this.client = new Client(SERVER_URL);
  }

  onMessage(handler: MessageHandler): void {
    this.listeners.push(handler);
  }

  private emit(type: string, data: unknown): void {
    for (const listener of this.listeners) {
      listener(type, data);
    }
  }

  async joinOrCreate(capacitorTier: CapacitorTier = CapacitorTier.MW1, playerName?: string): Promise<Room> {
    this.room = await this.client.joinOrCreate("ogate", {
      capacitorTier,
      playerName: playerName ?? `Player-${Math.floor(Math.random() * 9999)}`,
    });

    this.registerServerMessages();
    return this.room;
  }

  private registerServerMessages(): void {
    if (!this.room) return;

    const messages = Object.values(ServerMessage);
    for (const msgType of messages) {
      this.room.onMessage(msgType, (data: unknown) => {
        this.emit(msgType, data);
      });
    }

    this.room.onStateChange((state) => {
      this.emit("state_change", state);
    });

    this.room.onLeave((code) => {
      this.emit("room_leave", { code });
    });

    this.room.onError((code, message) => {
      this.emit("room_error", { code, message });
    });
  }

  sendWarp(targetNodeId: string): void {
    this.room?.send(ClientMessage.WarpToNode, { targetNodeId } satisfies WarpToNodePayload);
  }

  sendScan(): void {
    this.room?.send(ClientMessage.InitiateScan);
  }

  sendAttack(targetPlayerId: string): void {
    this.room?.send(ClientMessage.Attack, { targetPlayerId } satisfies AttackPayload);
  }

  sendExit(): void {
    this.room?.send(ClientMessage.InitiateExit);
  }

  sendLoot(nodeId: string): void {
    this.room?.send(ClientMessage.LootNode, { nodeId } satisfies LootNodePayload);
  }

  sendEmergencyWarp(): void {
    this.room?.send(ClientMessage.EmergencyWarp);
  }

  sendExtractResources(nodeId: string, resourceType: ResourceType): void {
    this.room?.send(ClientMessage.ExtractResources, { nodeId, resourceType } satisfies ExtractResourcesPayload);
  }

  sendSetCombatStance(stance: CombatStance): void {
    this.room?.send(ClientMessage.SetCombatStance, { stance } satisfies SetCombatStancePayload);
  }

  getRoom(): Room | null {
    return this.room;
  }

  getSessionId(): string {
    return this.room?.sessionId ?? "";
  }

  disconnect(): void {
    this.room?.leave();
    this.room = null;
  }
}

export const networkManager = new NetworkManager();
