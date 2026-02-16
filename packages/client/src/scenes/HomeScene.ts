import Phaser from "phaser";
import { networkManager } from "../network/NetworkManager.js";
import { homeNetworkManager } from "../network/HomeNetworkManager.js";
import {
  CapacitorTier,
  BUILDING_DEFS,
  BuildingType,
  SKILL_DEFS,
  SkillId,
  ShipClass,
  HomeResponse,
  getBuildingUpgradeCost,
  SHIP_BLUEPRINTS,
} from "@ogate/shared";

interface BuildingInfo {
  type: string;
  level: number;
  upgrading: boolean;
  upgradeCompleteAt: number;
}

interface SkillInfo {
  id: string;
  level: number;
}

interface SkillQueueItem {
  skillId: string;
  targetLevel: number;
  completeAt: number;
}

interface ShipInfo {
  id: string;
  shipClass: string;
  hullHp: number;
  mass: number;
}

const TAB_BUILDINGS = 0;
const TAB_SKILLS = 1;
const TAB_FLEET = 2;

/**
 * Home System scene — Portrait mode with full economy management.
 */
export class HomeScene extends Phaser.Scene {
  private ore = 0;
  private biomass = 0;
  private energy = 0;
  private capacitors1MW = 0;
  private buildings: BuildingInfo[] = [];
  private skills: SkillInfo[] = [];
  private skillQueue: SkillQueueItem[] = [];
  private fleet: ShipInfo[] = [];
  private activeTab = TAB_BUILDINGS;

  private resourceText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private contentContainer!: Phaser.GameObjects.Container;
  private tabButtons: Phaser.GameObjects.Text[] = [];
  private connected = false;

  constructor() {
    super({ key: "HomeScene" });
  }

  create(): void {
    try {
      this.scale.lockOrientation("portrait");
    } catch {
      // lockOrientation not supported (e.g. desktop); game remains portrait-sized
    }
    const { width, height } = this.scale;
    const cx = width / 2;

    this.add.rectangle(cx, height / 2, width, height, 0x0a0a14);

    this.add.text(cx, 14, "OGate — Home System", {
      fontSize: "20px", color: "#4fc3f7", fontFamily: "monospace",
    }).setOrigin(0.5);

    this.add.text(cx, 34, "SANCTUARY", {
      fontSize: "10px", color: "#607d8b", fontFamily: "monospace",
    }).setOrigin(0.5);

    this.resourceText = this.add.text(20, 52, "", {
      fontSize: "11px", color: "#b0bec5", fontFamily: "monospace",
      wordWrap: { width: width - 40 },
    });

    this.createTabs();
    this.contentContainer = this.add.container(0, 120);
    this.createBottomBar();

    this.statusText = this.add.text(cx, height - 18, "", {
      fontSize: "11px", color: "#ffab00", fontFamily: "monospace",
    }).setOrigin(0.5);

    this.connectToHome();
  }

  // ── Tabs ──────────────────────────────────────────────

  private createTabs(): void {
    const labels = ["BUILDINGS", "SKILLS", "FLEET"];
    const { width } = this.scale;
    const tabW = width / labels.length;

    labels.forEach((label, i) => {
      const x = tabW * i + tabW / 2;
      const text = this.add.text(x, 88, label, {
        fontSize: "12px",
        color: i === this.activeTab ? "#4fc3f7" : "#546e7a",
        fontFamily: "monospace",
        backgroundColor: i === this.activeTab ? "#1a237e" : undefined,
        padding: { x: 6, y: 3 },
      }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.switchTab(i));
      this.tabButtons.push(text);
    });
  }

  private switchTab(index: number): void {
    this.activeTab = index;
    this.tabButtons.forEach((btn, i) => {
      btn.setColor(i === index ? "#4fc3f7" : "#546e7a");
      btn.setBackgroundColor(i === index ? "#1a237e" : "");
    });
    this.renderContent();
  }

  // ── Bottom Bar (OGate button) ─────────────────────────

  private createBottomBar(): void {
    const { width, height } = this.scale;
    const btnY = height - 50;

    const collectBtn = this.add.rectangle(width * 0.25, btnY, 140, 34, 0x0d47a1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.collectResources());
    this.add.text(width * 0.25, btnY, "COLLECT", {
      fontSize: "12px", color: "#e0e0e0", fontFamily: "monospace",
    }).setOrigin(0.5);

    const ogateBtn = this.add.rectangle(width * 0.75, btnY, 140, 34, 0x1b5e20)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.activateOGate());
    this.add.text(width * 0.75, btnY, "ACTIVATE OGATE", {
      fontSize: "12px", color: "#a5d6a7", fontFamily: "monospace",
    }).setOrigin(0.5);
  }

  // ── Content Rendering ─────────────────────────────────

  private renderContent(): void {
    this.contentContainer.removeAll(true);

    switch (this.activeTab) {
      case TAB_BUILDINGS: this.renderBuildings(); break;
      case TAB_SKILLS: this.renderSkills(); break;
      case TAB_FLEET: this.renderFleet(); break;
    }
  }

  private renderBuildings(): void {
    const { width } = this.scale;
    const allTypes = Object.values(BuildingType);
    let y = 0;

    for (const bt of allTypes) {
      const def = BUILDING_DEFS[bt];
      const info = this.buildings.find(b => b.type === bt);
      const level = info?.level ?? 0;
      const upgrading = info?.upgrading ?? false;

      const labelColor = upgrading ? "#ffab00" : "#b0bec5";
      const statusStr = upgrading ? " [UPGRADING...]" : "";

      const text = this.add.text(10, y, `${def.name} (Lv ${level})${statusStr}`, {
        fontSize: "11px", color: labelColor, fontFamily: "monospace",
      });
      this.contentContainer.add(text);

      if (!upgrading && level < def.maxLevel) {
        const cost = getBuildingUpgradeCost(def, level + 1);
        const costStr = `O:${cost.ore} B:${cost.biomass} E:${cost.energy}`;
        const btn = this.add.text(width - 20, y, `[UP] ${costStr}`, {
          fontSize: "10px", color: "#66bb6a", fontFamily: "monospace",
        }).setOrigin(1, 0)
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => {
            homeNetworkManager.upgradeBuilding(bt);
            this.setStatus(`Upgrading ${def.name}...`);
          });
        this.contentContainer.add(btn);
      }

      y += 22;
    }
  }

  private renderSkills(): void {
    const { width } = this.scale;
    const allSkills = Object.values(SkillId);
    let y = 0;

    if (this.skillQueue.length > 0) {
      const queueHeader = this.add.text(10, y, "TRAINING QUEUE:", {
        fontSize: "10px", color: "#607d8b", fontFamily: "monospace",
      });
      this.contentContainer.add(queueHeader);
      y += 16;

      for (const item of this.skillQueue) {
        const def = SKILL_DEFS[item.skillId as SkillId];
        const remaining = Math.max(0, Math.ceil((item.completeAt - Date.now()) / 1000));
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        const qText = this.add.text(20, y, `${def?.name ?? item.skillId} Lv${item.targetLevel} — ${mins}m ${secs}s`, {
          fontSize: "10px", color: "#ffab00", fontFamily: "monospace",
        });
        this.contentContainer.add(qText);
        y += 14;
      }
      y += 8;
    }

    const skillHeader = this.add.text(10, y, "AVAILABLE SKILLS:", {
      fontSize: "10px", color: "#607d8b", fontFamily: "monospace",
    });
    this.contentContainer.add(skillHeader);
    y += 16;

    for (const sid of allSkills) {
      const def = SKILL_DEFS[sid];
      const info = this.skills.find(s => s.id === sid);
      const level = info?.level ?? 0;

      const text = this.add.text(10, y, `${def.name} (Lv ${level}/${def.maxLevel})`, {
        fontSize: "11px", color: "#b0bec5", fontFamily: "monospace",
      });
      this.contentContainer.add(text);

      if (level < def.maxLevel) {
        const btn = this.add.text(width - 20, y, "[TRAIN]", {
          fontSize: "10px", color: "#42a5f5", fontFamily: "monospace",
        }).setOrigin(1, 0)
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => {
            homeNetworkManager.queueSkill(sid);
            this.setStatus(`Queued ${def.name} for training`);
          });
        this.contentContainer.add(btn);
      }

      y += 20;
    }
  }

  private renderFleet(): void {
    const { width } = this.scale;
    let y = 0;

    const header = this.add.text(10, y, `FLEET (${this.fleet.length} ship${this.fleet.length !== 1 ? "s" : ""}):`, {
      fontSize: "10px", color: "#607d8b", fontFamily: "monospace",
    });
    this.contentContainer.add(header);
    y += 18;

    for (const ship of this.fleet) {
      const text = this.add.text(20, y, `${ship.shipClass} — HP: ${ship.hullHp} Mass: ${ship.mass}`, {
        fontSize: "11px", color: "#b0bec5", fontFamily: "monospace",
      });
      this.contentContainer.add(text);
      y += 16;
    }

    y += 16;
    const buildHeader = this.add.text(10, y, "BUILD SHIPS:", {
      fontSize: "10px", color: "#607d8b", fontFamily: "monospace",
    });
    this.contentContainer.add(buildHeader);
    y += 18;

    const buildable = Object.values(SHIP_BLUEPRINTS).map(bp => ({
      cls: bp.shipClass,
      label: `${bp.name} (O:${bp.costOre} B:${bp.costBiomass} E:${bp.costEnergy}) [Yard Lv${bp.minShipyardLevel}]`,
    }));

    for (const item of buildable) {
      const btn = this.add.text(20, y, `[BUILD] ${item.label}`, {
        fontSize: "11px", color: "#66bb6a", fontFamily: "monospace",
      }).setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          homeNetworkManager.buildShip(item.cls);
          this.setStatus(`Building ${item.cls}...`);
        });
      this.contentContainer.add(btn);
      y += 20;
    }
  }

  // ── Actions ───────────────────────────────────────────

  private collectResources(): void {
    homeNetworkManager.collectResources();
    this.setStatus("Collecting resources...");
  }

  private async activateOGate(): Promise<void> {
    if (this.capacitors1MW <= 0) {
      this.setStatus("No capacitors available!");
      return;
    }

    this.setStatus("Connecting to OGate...");
    homeNetworkManager.disconnect();

    try {
      await networkManager.joinOrCreate(CapacitorTier.MW1);
      this.setStatus("Connected! Entering instance...");
      this.scene.start("InstanceScene");
    } catch (err) {
      this.setStatus("Connection failed. Try again.");
      console.error("[HomeScene] Failed to join OGate:", err);
      this.connectToHome();
    }
  }

  // ── Network ───────────────────────────────────────────

  private async connectToHome(): Promise<void> {
    try {
      await homeNetworkManager.joinOrCreate();
      this.connected = true;
      this.registerNetworkHandlers();
    } catch (err) {
      console.error("[HomeScene] Failed to connect to home:", err);
      this.setStatus("Server offline — showing local state");
    }
  }

  private registerNetworkHandlers(): void {
    homeNetworkManager.onMessage((type, data) => {
      switch (type) {
        case "state_change":
          this.syncFromState(data);
          break;
        case HomeResponse.ResourcesCollected: {
          const rc = data as { ore: number; biomass: number; energy: number };
          this.setStatus(`Collected: +${rc.ore} ore, +${rc.biomass} bio, +${rc.energy} energy`);
          break;
        }
        case HomeResponse.BuildingUpgraded:
          this.setStatus("Building upgraded!");
          break;
        case HomeResponse.SkillQueued:
          this.setStatus("Skill queued for training.");
          break;
        case HomeResponse.SkillCompleted: {
          const sc = data as { skillId: string };
          this.setStatus(`Skill completed: ${sc.skillId}`);
          break;
        }
        case HomeResponse.ShipBuilt: {
          const sb = data as { shipClass: string };
          this.setStatus(`Ship built: ${sb.shipClass}`);
          break;
        }
        case HomeResponse.HomeError: {
          const he = data as { message: string };
          this.setStatus(`Error: ${he.message}`);
          break;
        }
      }
    });
  }

  private syncFromState(data: unknown): void {
    const state = data as {
      ore?: number; biomass?: number; energy?: number;
      capacitors1MW?: number;
      buildings?: { forEach: (cb: (b: BuildingInfo, key: string) => void) => void };
      skills?: { forEach: (cb: (s: SkillInfo, key: string) => void) => void };
      skillQueue?: Iterable<SkillQueueItem>;
      fleet?: Iterable<ShipInfo>;
    };
    if (!state) return;

    if (state.ore !== undefined) this.ore = state.ore;
    if (state.biomass !== undefined) this.biomass = state.biomass;
    if (state.energy !== undefined) this.energy = state.energy;
    if (state.capacitors1MW !== undefined) this.capacitors1MW = state.capacitors1MW;

    if (state.buildings) {
      this.buildings = [];
      state.buildings.forEach((b) => {
        this.buildings.push({
          type: b.type ?? (b as unknown as { buildingType: string }).buildingType,
          level: b.level,
          upgrading: b.upgrading,
          upgradeCompleteAt: b.upgradeCompleteAt,
        });
      });
    }

    if (state.skills) {
      this.skills = [];
      state.skills.forEach((s) => {
        this.skills.push({
          id: s.id ?? (s as unknown as { skillId: string }).skillId,
          level: s.level,
        });
      });
    }

    if (state.skillQueue) {
      this.skillQueue = [];
      for (const item of state.skillQueue) {
        this.skillQueue.push({
          skillId: item.skillId,
          targetLevel: item.targetLevel,
          completeAt: item.completeAt,
        });
      }
    }

    if (state.fleet) {
      this.fleet = [];
      for (const ship of state.fleet) {
        this.fleet.push({
          id: ship.id,
          shipClass: ship.shipClass,
          hullHp: ship.hullHp,
          mass: ship.mass,
        });
      }
    }

    this.updateResourceDisplay();
    this.renderContent();
  }

  private updateResourceDisplay(): void {
    this.resourceText.setText(
      `Ore: ${Math.floor(this.ore)}  |  Biomass: ${Math.floor(this.biomass)}  |  Energy: ${Math.floor(this.energy)}  |  1MW Caps: ${this.capacitors1MW}`
    );
  }

  private setStatus(msg: string): void {
    this.statusText.setText(msg);
    this.time.delayedCall(5000, () => {
      if (this.statusText.text === msg) this.statusText.setText("");
    });
  }
}
