# OGate

**4X Strategy / Extraction MMO** -- Mobile Web (Midcore)

OGate merges mobile 4X empire-building with high-stakes instanced PvPvE extraction. Players manage a safe Home System (idle layer) and launch sorties through the OGate into collapsing wormhole instances (active layer).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Phaser 3 (TypeScript) |
| Backend | Colyseus 0.15 (Node.js, TypeScript) |
| Database | MongoDB (player profiles) + Redis (live instance state) |
| Build | npm workspaces monorepo, Vite (client), tsx (server dev) |

---

## Repository Structure

```
ogate/
├── docs/                        # Game design documents (HLDD + breakdowns)
├── packages/
│   ├── shared/                  # @ogate/shared — types, constants, game data
│   │   └── src/
│   │       ├── constants.ts     # Tunable game values (entropy, warp, combat)
│   │       ├── types.ts         # Core enums and interfaces (ships, resources, nodes)
│   │       ├── messages.ts      # Client↔Server message types for OGate instances
│   │       ├── homeMessages.ts  # Client↔Server message types for Home System
│   │       ├── socialMessages.ts# Client↔Server message types for factions/research
│   │       ├── economy.ts       # Building and skill definitions, cost formulas
│   │       ├── fleet.ts         # Ship blueprints (all 9 classes), contingents, transponders
│   │       ├── social.ts        # Factions, Concordat contracts, research tree (19 nodes)
│   │       ├── shop.ts          # Premium shop items, crystal currency
│   │       └── index.ts         # Barrel export
│   │
│   ├── server/                  # @ogate/server — Colyseus authoritative game server
│   │   └── src/
│   │       ├── index.ts         # Express + Colyseus bootstrap, room registration
│   │       ├── db/
│   │       │   ├── mongo.ts     # MongoDB connection + Player model
│   │       │   └── redis.ts     # Redis connection + instance state cache
│   │       ├── rooms/
│   │       │   ├── OGateRoom.ts # Instance room: warp, scan, combat, entropy, exit
│   │       │   └── HomeRoom.ts  # Home room: economy, skills, social, research, shop
│   │       ├── schemas/
│   │       │   ├── OGateRoomState.ts   # Colyseus state for an OGate instance
│   │       │   ├── PlayerSchema.ts     # Player state inside an instance
│   │       │   ├── ShipSchema.ts       # Individual ship state
│   │       │   ├── InstanceNodeSchema.ts # Map node (planet, belt, gas cloud, etc.)
│   │       │   ├── Vec2Schema.ts       # 2D position
│   │       │   ├── HomeStateSchema.ts  # Player home system state (resources, buildings, fleet)
│   │       │   ├── SocialSchema.ts     # Faction standings, contracts, research progress
│   │       │   └── ContingentSchema.ts # Expeditionary contingent (marines, engineers, researchers)
│   │       └── systems/
│   │           ├── entropySystem.ts     # Shared stability budget: tick, deduct, entry check
│   │           ├── instanceGenerator.ts # Random node generation, edge spawn positions
│   │           ├── warpSystem.ts        # Transit time calculation, proximity alert timing
│   │           ├── scanSystem.ts        # Graviton scan with collimation (multi-ping for small targets)
│   │           ├── combatSystem.ts      # Multi-round automated combat (evasion, stances, point defense)
│   │           ├── transponderSystem.ts # Emergency warp escape with RNG damage rolls
│   │           ├── economySystem.ts     # Resource collection, building upgrades, skill queue, ship construction
│   │           ├── socialSystem.ts      # Factions, Concordat contracts, research tree progression
│   │           └── shopSystem.ts        # Premium item purchase and effect application
│   │
│   └── client/                  # @ogate/client — Phaser game client
│       ├── index.html           # Entry HTML
│       ├── vite.config.ts       # Vite config with @ogate/shared alias
│       └── src/
│           ├── main.ts          # Phaser game bootstrap (480x800 portrait, FIT scaling)
│           ├── network/
│           │   ├── NetworkManager.ts     # WebSocket client for OGate instance rooms
│           │   └── HomeNetworkManager.ts # WebSocket client for Home System rooms
│           └── scenes/
│               ├── HomeScene.ts      # Portrait UI: resources, buildings, skills, fleet, OGate button
│               └── InstanceScene.ts  # Portrait tactical dashboard: map, entropy gauge, actions
│
├── package.json                 # Root workspace config
├── tsconfig.base.json           # Shared TypeScript settings
└── .cursorrules                 # Project rules (authoritative server model, stack constraints)
```

---

## Architecture

All game logic runs on the server. The client is a renderer and input relay only.

```
┌─────────────────────────────────────────────────────┐
│  Phaser Client                                      │
│  ┌──────────────┐  ┌────────────────────────────┐   │
│  │  HomeScene    │  │  InstanceScene              │   │
│  │  (Portrait)   │  │  (Portrait)                 │   │
│  └──────┬───────┘  └──────────┬─────────────────┘   │
│         │ input               │ input                │
│  ┌──────┴───────────────────┬─┘                      │
│  │  NetworkManager / HomeNetworkManager              │
│  └──────────────┬───────────────────────────────┘   │
│                 │ WebSocket                          │
└─────────────────┼───────────────────────────────────┘
                  │
┌─────────────────┼───────────────────────────────────┐
│  Colyseus Server│                                    │
│  ┌──────────────┴──────────┐                         │
│  │  Matchmaker             │                         │
│  ├─────────────┬───────────┤                         │
│  │  HomeRoom   │ OGateRoom │                         │
│  │  (1 per     │ (1 per    │                         │
│  │   player)   │  instance)│                         │
│  └──────┬──────┴─────┬─────┘                         │
│         │            │                               │
│  ┌──────┴──────┐ ┌───┴──────────────────────┐       │
│  │ Economy     │ │ Entropy  Warp  Scan      │       │
│  │ Social      │ │ Combat   Transponder     │       │
│  │ Shop        │ │ InstanceGenerator        │       │
│  └──────┬──────┘ └───┬──────────────────────┘       │
│         │            │                               │
│  ┌──────┴────────────┴──────┐                        │
│  │  MongoDB       Redis     │                        │
│  │  (profiles)    (live)    │                        │
│  └──────────────────────────┘                        │
└──────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- MongoDB and Redis (optional -- the server falls back to in-memory if unavailable)

### Install

```bash
npm install
```

### Development

Run the server and client simultaneously:

```bash
npm run dev
```

Or run them individually:

```bash
npm run dev:server   # Colyseus on ws://localhost:2567
npm run dev:client   # Vite on http://localhost:3000
```

### Build

```bash
npm run build        # Builds shared → server → client
```

---

## Key Design Concepts

### Authoritative Server

The Colyseus server owns all game state. Clients send input messages (`warp_to_node`, `initiate_scan`, `attack`, etc.) and receive state patches. No game logic runs on the client.

### Dual-Session Economy

- **Coffee Break (5 min):** Home System in portrait mode -- collect resources, queue skills, build ships.
- **Deep Dive (1 hr+):** OGate instance in portrait mode -- scan, loot, fight, extract.

### Entropy (Shared Stability Budget)

OGate instances have no fixed timer. Instead, all players share an Entropy pool. Every action (entry, warp, combat, looting) drains it. When it hits 0%, the instance collapses and all assets inside are wiped.

### Submarine Warfare

Players are hidden by default inside instances. Active graviton scanning reveals targets but broadcasts a "sonar ping" to everyone. Small ships require multiple pings to lock (collimation), giving them time to escape.

---

## Shared Package Modules

| Module | Purpose |
|--------|---------|
| `constants.ts` | All tunable game values in one place |
| `types.ts` | Core enums (`ShipClass`, `NodeType`, `PlayerInstanceState`) and data interfaces |
| `messages.ts` | OGate instance message protocol (client → server and server → client) |
| `economy.ts` | 11 building types, 7 skills, cost/time formulas, production rates |
| `fleet.ts` | 9 ship class blueprints, 3 contingent types, transponder logic, collimation math |
| `social.ts` | 4 factions, Concordat contracts, 19-node research tree across 4 branches |
| `shop.ts` | 11 premium shop items across 4 categories |

---

## Server Systems

| System | File | Responsibility |
|--------|------|----------------|
| Entropy | `entropySystem.ts` | Tick decay, deduct on actions, 25% entry floor, 33% empty despawn, 0% collapse |
| Instance Gen | `instanceGenerator.ts` | Random node placement inside circular map, edge spawn points |
| Warp | `warpSystem.ts` | Distance-based transit time (30s--5min), entropy cost, proximity alert lead time |
| Scan | `scanSystem.ts` | Graviton pulse with collimation (1--3 pings based on target mass) |
| Combat | `combatSystem.ts` | Multi-round automated resolution with evasion, stances, point defense |
| Transponder | `transponderSystem.ts` | Emergency escape with RNG damage (0/25/50/100%) on hull, modules, contingents |
| Economy | `economySystem.ts` | Idle resource collection, building upgrades, skill training queue, ship construction |
| Social | `socialSystem.ts` | Faction pledge, reputation, contracts, 4-branch research tree |
| Shop | `shopSystem.ts` | Crystal purchases, speed-ups, transponders, cosmetics |
