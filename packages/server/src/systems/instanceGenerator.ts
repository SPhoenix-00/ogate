import { v4 as uuid } from "uuid";
import { NodeType } from "@ogate/shared";
import {
  INSTANCE_MAP_RADIUS,
  INSTANCE_MIN_NODES,
  INSTANCE_MAX_NODES,
} from "@ogate/shared";
import { InstanceNodeSchema } from "../schemas/InstanceNodeSchema.js";
import { Vec2Schema } from "../schemas/Vec2Schema.js";

const NODE_NAMES: Record<string, string[]> = {
  [NodeType.Planet]: [
    "Karrus Prime", "Nyx-7", "Obsidian IV", "Ashfall", "Duskworld",
    "Forge-9", "Halcyon", "Gloomreach", "Terminus", "Cinder",
  ],
  [NodeType.AsteroidBelt]: [
    "The Shatter", "Iron Veil", "Debris Arc", "Dust Ring", "Scrap Halo",
  ],
  [NodeType.GasCloud]: [
    "Nebulite Drift", "Crimson Shroud", "Void Haze", "Ember Cloud",
  ],
  [NodeType.Station]: [
    "Relay Sigma", "Beacon Outpost", "Derelict Hub",
  ],
};

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a random position inside the circular instance map. */
function randomInteriorPosition(radius: number): Vec2Schema {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius * 0.8;
  const pos = new Vec2Schema();
  pos.x = Math.round(Math.cos(angle) * r);
  pos.y = Math.round(Math.sin(angle) * r);
  return pos;
}

/** Generate a random position on the edge of the instance map (for exit frames). */
export function randomEdgePosition(radius: number): Vec2Schema {
  const angle = Math.random() * Math.PI * 2;
  const pos = new Vec2Schema();
  pos.x = Math.round(Math.cos(angle) * radius * 0.95);
  pos.y = Math.round(Math.sin(angle) * radius * 0.95);
  return pos;
}

/** Generate the static nodes for a new OGate instance. */
export function generateInstanceNodes(): InstanceNodeSchema[] {
  const count = Math.floor(randomInRange(INSTANCE_MIN_NODES, INSTANCE_MAX_NODES + 1));
  const nodeTypes = [NodeType.Planet, NodeType.AsteroidBelt, NodeType.GasCloud, NodeType.Station];
  const usedNames = new Set<string>();
  const nodes: InstanceNodeSchema[] = [];

  for (let i = 0; i < count; i++) {
    const type = pickRandom(nodeTypes);
    const namePool = NODE_NAMES[type] ?? ["Unknown"];
    let name = pickRandom(namePool);
    while (usedNames.has(name)) {
      name = pickRandom(namePool);
    }
    usedNames.add(name);

    const node = new InstanceNodeSchema();
    node.id = uuid();
    node.nodeType = type;
    node.name = name;
    node.position = randomInteriorPosition(INSTANCE_MAP_RADIUS);

    if (type === NodeType.AsteroidBelt || type === NodeType.Planet) {
      node.oreAmount = Math.round(randomInRange(50, 200));
    }
    if (type === NodeType.Planet || type === NodeType.GasCloud) {
      node.biomassAmount = Math.round(randomInRange(30, 150));
    }

    nodes.push(node);
  }

  return nodes;
}
