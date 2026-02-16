import { Client, Room } from "colyseus.js";
import { HomeAction, HomeResponse, type BuildingType, type SkillId } from "@ogate/shared";

const SERVER_URL = "ws://localhost:2567";

export type HomeMessageHandler = (type: string, data: unknown) => void;

export class HomeNetworkManager {
  private client: Client;
  private room: Room | null = null;
  private listeners: HomeMessageHandler[] = [];

  constructor() {
    this.client = new Client(SERVER_URL);
  }

  onMessage(handler: HomeMessageHandler): void {
    this.listeners.push(handler);
  }

  private emit(type: string, data: unknown): void {
    for (const listener of this.listeners) {
      listener(type, data);
    }
  }

  async joinOrCreate(playerName?: string): Promise<Room> {
    this.room = await this.client.joinOrCreate("home", {
      playerName: playerName ?? `Player-${Math.floor(Math.random() * 9999)}`,
    });

    const messages = Object.values(HomeResponse);
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

    return this.room;
  }

  collectResources(): void {
    this.room?.send(HomeAction.CollectResources);
  }

  upgradeBuilding(buildingType: BuildingType): void {
    this.room?.send(HomeAction.UpgradeBuilding, { buildingType });
  }

  queueSkill(skillId: SkillId): void {
    this.room?.send(HomeAction.QueueSkill, { skillId });
  }

  buildShip(shipClass: string): void {
    this.room?.send(HomeAction.BuildShip, { shipClass });
  }

  getRoom(): Room | null {
    return this.room;
  }

  disconnect(): void {
    this.room?.leave();
    this.room = null;
  }
}

export const homeNetworkManager = new HomeNetworkManager();
