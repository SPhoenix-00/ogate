import Phaser from "phaser";
import { networkManager } from "../network/NetworkManager.js";
import { ServerMessage, PlayerInstanceState, ResourceType } from "@ogate/shared";

interface NodeInfo {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  ore: number;
  biomass: number;
}

interface ScanResultInfo {
  nodeId: string;
  position: { x: number; y: number };
  rippleMagnitude: number;
  threatAssessment: number;
}

/**
 * OGate Instance scene — Portrait tactical dashboard.
 * Renders the node map, entropy gauge, fleet info, and action buttons.
 */
export class InstanceScene extends Phaser.Scene {
  private entropy = 100;
  private playerState = PlayerInstanceState.Idle;
  private currentNodeId = "";
  private exitFrameNodeId = "";
  private nodes: NodeInfo[] = [];
  private scanResults: ScanResultInfo[] = [];
  private cargoOre = 0;
  private cargoBiomass = 0;

  private entropyBar!: Phaser.GameObjects.Rectangle;
  private entropyText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private alertText!: Phaser.GameObjects.Text;
  private cargoText!: Phaser.GameObjects.Text;
  private nodeListContainer!: Phaser.GameObjects.Container;
  private nodeButtons: Phaser.GameObjects.Container[] = [];
  private mapContainer!: Phaser.GameObjects.Container;
  private playerDot!: Phaser.GameObjects.Arc;

  constructor() {
    super({ key: "InstanceScene" });
  }

  create(): void {
    try {
      this.scale.lockOrientation("portrait");
    } catch {
      // lockOrientation not supported (e.g. desktop)
    }
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x05050f);

    this.createEntropyGauge();
    this.createMapView();
    this.createNodeList();
    this.createActionButtons();
    this.createInfoPanel();
    this.registerNetworkHandlers();
    this.syncInitialState();
  }

  // ── Entropy Gauge ─────────────────────────────────────

  private createEntropyGauge(): void {
    const { width } = this.scale;
    const barWidth = width - 40;

    this.add.text(20, 10, "ENTROPY", {
      fontSize: "11px",
      color: "#607d8b",
      fontFamily: "monospace",
    });

    this.add.rectangle(20 + barWidth / 2, 32, barWidth, 14, 0x1a1a2e);

    this.entropyBar = this.add.rectangle(20, 32, barWidth, 12, 0x4fc3f7)
      .setOrigin(0, 0.5);

    this.entropyText = this.add.text(width - 20, 32, "100.0%", {
      fontSize: "12px",
      color: "#4fc3f7",
      fontFamily: "monospace",
    }).setOrigin(1, 0.5);
  }

  private updateEntropyDisplay(): void {
    const { width } = this.scale;
    const barWidth = width - 40;
    const ratio = Math.max(0, this.entropy / 100);
    this.entropyBar.width = barWidth * ratio;

    let color = 0x4fc3f7;
    if (this.entropy < 30) color = 0xff1744;
    else if (this.entropy < 60) color = 0xffab00;
    this.entropyBar.setFillStyle(color);
    this.entropyText.setText(`${this.entropy.toFixed(1)}%`);
    this.entropyText.setColor(this.entropy < 30 ? "#ff1744" : this.entropy < 60 ? "#ffab00" : "#4fc3f7");
  }

  // ── Map View ──────────────────────────────────────────

  private createMapView(): void {
    const { width, height } = this.scale;
    const mapCx = width / 2;
    const mapCy = height * 0.26;
    const mapR = Math.min(width * 0.38, height * 0.16);

    this.mapContainer = this.add.container(mapCx, mapCy);

    const border = this.add.circle(0, 0, mapR, 0x0d1b2a).setStrokeStyle(1, 0x1a3a5c);
    this.mapContainer.add(border);

    const grid1 = this.add.circle(0, 0, mapR * 0.66).setStrokeStyle(0.5, 0x0f2238);
    const grid2 = this.add.circle(0, 0, mapR * 0.33).setStrokeStyle(0.5, 0x0f2238);
    this.mapContainer.add([grid1, grid2]);

    this.playerDot = this.add.circle(0, 0, 5, 0x4fc3f7);
    this.mapContainer.add(this.playerDot);

    this.mapContainer.setData("radius", mapR);
  }

  private updateMapNodes(): void {
    const mapR = this.mapContainer.getData("radius") as number;
    const room = networkManager.getRoom();
    if (!room) return;

    const mapRadius = (room.state as { mapRadius?: number })?.mapRadius ?? 1000;

    this.mapContainer.each((child: Phaser.GameObjects.GameObject) => {
      if (child.getData("isNode")) child.destroy();
    });

    for (const node of this.nodes) {
      const nx = (node.x / mapRadius) * mapR;
      const ny = (node.y / mapRadius) * mapR;

      let color = 0x546e7a;
      if (node.type === "EXIT_FRAME") color = 0x00e676;
      else if (node.type === "PLANET") color = 0xffa726;
      else if (node.type === "ASTEROID_BELT") color = 0x8d6e63;
      else if (node.type === "GAS_CLOUD") color = 0xce93d8;
      else if (node.type === "STATION") color = 0x42a5f5;

      const dot = this.add.circle(nx, ny, node.type === "EXIT_FRAME" ? 6 : 4, color);
      dot.setData("isNode", true);
      this.mapContainer.add(dot);

      const label = this.add.text(nx + 8, ny - 6, node.name, {
        fontSize: "9px",
        color: "#78909c",
        fontFamily: "monospace",
      });
      label.setData("isNode", true);
      this.mapContainer.add(label);
    }

    for (const sr of this.scanResults) {
      const sx = (sr.position.x / mapRadius) * mapR;
      const sy = (sr.position.y / mapRadius) * mapR;
      const ping = this.add.circle(sx, sy, 3 + sr.rippleMagnitude * 0.5, 0xff1744, 0.6);
      ping.setData("isNode", true);
      this.mapContainer.add(ping);
    }

    this.updatePlayerPosition();
  }

  private updatePlayerPosition(): void {
    const mapR = this.mapContainer.getData("radius") as number;
    const room = networkManager.getRoom();
    if (!room) return;
    const mapRadius = (room.state as { mapRadius?: number })?.mapRadius ?? 1000;

    const currentNode = this.nodes.find(n => n.id === this.currentNodeId);
    if (currentNode) {
      this.playerDot.x = (currentNode.x / mapRadius) * mapR;
      this.playerDot.y = (currentNode.y / mapRadius) * mapR;
    }
  }

  // ── Node List (right panel) ───────────────────────────

  private createNodeList(): void {
    const { width } = this.scale;
    const listX = 20;
    const listTopY = 200;

    this.add.text(listX, listTopY - 22, "SYSTEM NODES", {
      fontSize: "11px",
      color: "#607d8b",
      fontFamily: "monospace",
    });

    this.nodeListContainer = this.add.container(listX, listTopY);
  }

  private updateNodeList(): void {
    this.nodeListContainer.removeAll(true);
    this.nodeButtons = [];

    this.nodes.forEach((node, i) => {
      const y = i * 32;
      const isHere = node.id === this.currentNodeId;
      const isExit = node.id === this.exitFrameNodeId;

      let prefix = "";
      if (isHere) prefix = "> ";
      if (isExit) prefix += "[EXIT] ";

      const color = isHere ? "#4fc3f7" : isExit ? "#00e676" : "#b0bec5";
      const text = this.add.text(0, y, `${prefix}${node.name}`, {
        fontSize: "12px",
        color,
        fontFamily: "monospace",
      }).setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.onNodeClick(node));

      const container = this.add.container(0, 0, [text]);
      this.nodeListContainer.add(container);
      this.nodeButtons.push(container);
    });
  }

  private onNodeClick(node: NodeInfo): void {
    if (this.playerState !== PlayerInstanceState.Idle) return;
    if (node.id === this.currentNodeId) return;

    networkManager.sendWarp(node.id);
    this.setStatus(`Warping to ${node.name}...`);
  }

  // ── Action Buttons ────────────────────────────────────

  private createActionButtons(): void {
    const { width, height } = this.scale;
    const btnH = 32;
    const gap = 8;

    const primaryY = height - 46;
    const primaryBtns = [
      { label: "SCAN", color: 0x0d47a1, action: () => this.onScan() },
      { label: "EXTRACT", color: 0x4a148c, action: () => this.onExtract() },
      { label: "LOOT", color: 0x4e342e, action: () => this.onLoot() },
    ];
    const pBtnW = Math.floor((width - 40 - gap * (primaryBtns.length - 1)) / primaryBtns.length);
    this.layoutButtonRow(primaryBtns, primaryY, pBtnW, btnH, gap);

    const secondaryY = primaryY - btnH - gap;
    const secondaryBtns = [
      { label: "EXIT", color: 0x1b5e20, action: () => this.onExit() },
      { label: "EMERGENCY WARP", color: 0xb71c1c, action: () => this.onEmergencyWarp() },
    ];
    const sBtnW = Math.floor((width - 40 - gap * (secondaryBtns.length - 1)) / secondaryBtns.length);
    this.layoutButtonRow(secondaryBtns, secondaryY, sBtnW, btnH, gap);
  }

  private layoutButtonRow(
    buttons: Array<{ label: string; color: number; action: () => void }>,
    y: number, btnW: number, btnH: number, gap: number,
  ): void {
    const { width } = this.scale;
    const totalW = buttons.length * btnW + (buttons.length - 1) * gap;
    const startX = width / 2 - totalW / 2 + btnW / 2;

    buttons.forEach((b, i) => {
      const x = startX + i * (btnW + gap);
      this.add.rectangle(x, y, btnW, btnH, b.color)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", b.action);
      this.add.text(x, y, b.label, {
        fontSize: "11px",
        color: "#e0e0e0",
        fontFamily: "monospace",
      }).setOrigin(0.5);
    });
  }

  private onScan(): void {
    if (this.playerState !== PlayerInstanceState.Idle) return;
    networkManager.sendScan();
    this.setStatus("Scanning... (5s)");
  }

  private onExtract(): void {
    if (this.playerState !== PlayerInstanceState.Idle) return;
    const node = this.nodes.find(n => n.id === this.currentNodeId);
    if (!node) return;

    if (node.ore > 0) {
      networkManager.sendExtractResources(this.currentNodeId, ResourceType.Ore);
      this.setStatus("Extracting ore...");
    } else if (node.biomass > 0) {
      networkManager.sendExtractResources(this.currentNodeId, ResourceType.Biomass);
      this.setStatus("Extracting biomass...");
    } else {
      this.setStatus("Nothing to extract here.");
    }
  }

  private onLoot(): void {
    if (this.playerState !== PlayerInstanceState.Idle) return;
    networkManager.sendLoot(this.currentNodeId);
  }

  private onExit(): void {
    if (this.playerState !== PlayerInstanceState.Idle) return;
    if (this.currentNodeId !== this.exitFrameNodeId) {
      this.setStatus("Must be at your Exit Frame!");
      return;
    }
    networkManager.sendExit();
    this.setStatus("Spooling exit...");
  }

  private onEmergencyWarp(): void {
    if (this.playerState === PlayerInstanceState.Exited) return;
    networkManager.sendEmergencyWarp();
    this.setStatus("EMERGENCY WARP ACTIVATED!");
  }

  // ── Info Panel ────────────────────────────────────────

  private createInfoPanel(): void {
    const { height } = this.scale;

    this.statusText = this.add.text(20, height - 80, "", {
      fontSize: "12px",
      color: "#ffab00",
      fontFamily: "monospace",
      wordWrap: { width: 300 },
    });

    this.alertText = this.add.text(20, height - 100, "", {
      fontSize: "13px",
      color: "#ff1744",
      fontFamily: "monospace",
    });

    this.cargoText = this.add.text(20, 52, "Cargo: Ore 0 | Biomass 0", {
      fontSize: "12px",
      color: "#a5d6a7",
      fontFamily: "monospace",
    });
  }

  private setStatus(msg: string): void {
    this.statusText.setText(msg);
  }

  private setAlert(msg: string): void {
    this.alertText.setText(msg);
    this.time.delayedCall(4000, () => this.alertText.setText(""));
  }

  private updateCargoDisplay(): void {
    this.cargoText.setText(`Cargo: Ore ${this.cargoOre} | Biomass ${this.cargoBiomass}`);
  }

  // ── Network Handlers ──────────────────────────────────

  private registerNetworkHandlers(): void {
    networkManager.onMessage((type, data) => {
      switch (type) {
        case "state_change":
          this.onStateChange(data);
          break;
        case ServerMessage.EntropyUpdate:
          this.entropy = (data as { entropy: number }).entropy;
          this.updateEntropyDisplay();
          break;
        case ServerMessage.WarpStarted: {
          const ws = data as { playerId: string; targetNodeId: string };
          this.playerState = PlayerInstanceState.Warping;
          const target = this.nodes.find(n => n.id === ws.targetNodeId);
          this.setStatus(`Warping to ${target?.name ?? "unknown"}...`);
          break;
        }
        case ServerMessage.WarpComplete: {
          const wc = data as { playerId: string; nodeId: string };
          this.playerState = PlayerInstanceState.Idle;
          this.currentNodeId = wc.nodeId;
          const arrived = this.nodes.find(n => n.id === wc.nodeId);
          this.setStatus(`Arrived at ${arrived?.name ?? "unknown"}`);
          this.updateNodeList();
          this.updatePlayerPosition();
          break;
        }
        case ServerMessage.ScanResults: {
          const sr = data as { results: ScanResultInfo[] };
          this.scanResults = sr.results;
          this.playerState = PlayerInstanceState.Idle;
          this.setStatus(`Scan complete: ${sr.results.length} signal(s) detected`);
          this.updateMapNodes();
          break;
        }
        case ServerMessage.ScanAlert: {
          this.setAlert("ACTIVE SCAN DETECTED!");
          break;
        }
        case ServerMessage.FleetVisible: {
          const fv = data as { playerId: string; shipCount: number; totalMass: number };
          this.setAlert(`Fleet detected! ${fv.shipCount} ship(s), mass ${fv.totalMass}`);
          break;
        }
        case ServerMessage.CombatResolved: {
          const cr = data as { result: { winnerId: string; loserId: string } };
          this.playerState = PlayerInstanceState.Idle;
          this.setStatus(`Combat resolved. Winner: ${cr.result.winnerId}`);
          break;
        }
        case ServerMessage.ExitSpoolStarted: {
          this.playerState = PlayerInstanceState.SpoolingExit;
          const es = data as { spoolDurationMs: number };
          this.setStatus(`Exit spool: ${(es.spoolDurationMs / 1000).toFixed(1)}s...`);
          break;
        }
        case ServerMessage.ExitComplete: {
          const ec = data as { cargoOre: number; cargoBiomass: number };
          this.setStatus(`Exfiltrated! Ore: ${ec.cargoOre}, Biomass: ${ec.cargoBiomass}`);
          this.time.delayedCall(2000, () => {
            networkManager.disconnect();
            this.scene.start("HomeScene");
          });
          break;
        }
        case ServerMessage.ProximityAlert: {
          const pa = data as { etaMs: number };
          this.setAlert(`PROXIMITY ALERT: Incoming warp ETA ${(pa.etaMs / 1000).toFixed(0)}s`);
          break;
        }
        case ServerMessage.LootCollected: {
          const lc = data as { resourceType: string; amount: number };
          if (lc.resourceType === "ORE") this.cargoOre += lc.amount;
          if (lc.resourceType === "BIOMASS") this.cargoBiomass += lc.amount;
          this.updateCargoDisplay();
          this.setStatus(`Looted ${lc.amount} ${lc.resourceType}`);
          break;
        }
        case ServerMessage.EmergencyWarpResult: {
          const ew = data as { result: { cargoLost: { ore: number; biomass: number }; shipsEscaped: Array<{ isWreck: boolean }> } };
          const wrecks = ew.result.shipsEscaped.filter(s => s.isWreck).length;
          this.setAlert(`Emergency warp! Lost cargo. ${wrecks} ship(s) wrecked.`);
          this.cargoOre = 0;
          this.cargoBiomass = 0;
          this.updateCargoDisplay();
          this.time.delayedCall(2000, () => {
            networkManager.disconnect();
            this.scene.start("HomeScene");
          });
          break;
        }
        case ServerMessage.NodeDepleted: {
          const nd = data as { nodeId: string };
          const depletedNode = this.nodes.find(n => n.id === nd.nodeId);
          if (depletedNode) {
            depletedNode.ore = 0;
            depletedNode.biomass = 0;
          }
          this.setStatus("Node depleted.");
          this.updateNodeList();
          break;
        }
        case ServerMessage.InstanceCollapse: {
          this.setAlert("INSTANCE COLLAPSING!");
          this.time.delayedCall(3000, () => {
            networkManager.disconnect();
            this.scene.start("HomeScene");
          });
          break;
        }
        case ServerMessage.Error: {
          const err = data as { message: string };
          this.setStatus(`Error: ${err.message}`);
          break;
        }
        case "room_leave": {
          break;
        }
      }
    });
  }

  private syncInitialState(): void {
    const room = networkManager.getRoom();
    if (!room) return;

    room.onStateChange.once((state: Record<string, unknown>) => {
      this.onStateChange(state);
    });
  }

  private onStateChange(data: unknown): void {
    const state = data as {
      entropy?: number;
      mapRadius?: number;
      nodes?: Iterable<{ id: string; name: string; nodeType: string; position: { x: number; y: number }; oreAmount: number; biomassAmount: number }>;
      players?: { forEach: (cb: (p: { id: string; state: string; currentNodeId: string; exitFrameNodeId: string; cargoOre: number; cargoBiomass: number }, key: string) => void) => void };
    };
    if (!state) return;

    if (state.entropy !== undefined) {
      this.entropy = state.entropy;
      this.updateEntropyDisplay();
    }

    if (state.nodes) {
      this.nodes = [];
      for (const n of state.nodes) {
        this.nodes.push({
          id: n.id,
          name: n.name,
          type: n.nodeType,
          x: n.position.x,
          y: n.position.y,
          ore: n.oreAmount,
          biomass: n.biomassAmount,
        });
      }
      this.updateMapNodes();
      this.updateNodeList();
    }

    if (state.players) {
      const sessionId = networkManager.getSessionId();
      state.players.forEach((p, key) => {
        if (key === sessionId) {
          this.currentNodeId = p.currentNodeId;
          this.exitFrameNodeId = p.exitFrameNodeId;
          this.playerState = p.state as PlayerInstanceState;
          this.cargoOre = p.cargoOre;
          this.cargoBiomass = p.cargoBiomass;
          this.updateCargoDisplay();
          this.updateNodeList();
          this.updatePlayerPosition();
        }
      });
    }
  }
}
