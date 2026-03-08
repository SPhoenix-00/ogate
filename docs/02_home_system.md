# The Home System (Sanctuary)

This document summarizes the mechanics, economy, and infrastructure of the player's Home System from the HLDD. Unlike traditional conquest 4X games (e.g. OGame), the Home System in OGate is **not a target for total destruction**. It is a strategic anchor designed for low-stress, idle-style progression (HLDD §3).

---

## 1. Sanctuary Rules

The Home System is a safe harbor: risk is entirely contained within OGate instances (HLDD §3.3).

- **No PvP:** Other players cannot attack or target the Home System. Ships docked at the Home System are safe from other players.
- **No fleet saving:** There is no need to fly ships away to "save" them while offline; docking at home is sufficient (HLDD §3.3).
- **Asset safety:** The design treats the Home System as the anchor; resources and assets at home are not at risk from other players.

**Return from OGate:** Ships that escape a collapsing OGate (e.g. via Emergency Transponder) return to the Home System in a damaged state and must be repaired/reconstructed (HLDD §5.3: reconstruction at the Shipyard for wrecked hulls).

---

## 2. Resource Economy

The economy follows **Extraction → Refining → Manufacturing**. Raw materials are extracted and refined at home; some late-game inputs (e.g. Nebulite) come from OGate (HLDD §3.1). This aligns with the **Macro Loop** in Core Design & Loops (docs/01_core_loops.md).

### A. Primary Resources (Extraction)

- **Ore**
  - **Source:** Deep Core Drills on planets.
  - **Tiers:** 5 distinct Ore Tiers (Tier 1: Common to Tier 5: Exotic). Each planet has a unique distribution—some rich in certain tiers, others balanced or devoid of high-tier (HLDD §3.1).
  - **Yield:** Determined by **Drill Technology Level** and the player's **Mining Efficiency Skill** (HLDD §3.1).

- **Biomass**
  - **Source:** Bio-Harvesters.
  - **Yield:** Determined by **Bio-Harvester Technology Level** and the player's **Harvesting Skill** (HLDD §3.1).
  - **Regeneration:** Biomass regenerates slowly over time. Even at **0%**, the local ecosystem eventually recovers so the resource loop is not permanently broken; recovery from 0% takes significant time (HLDD §3.1).

- **Energy**
  - **Use:** Powers Refineries, Factories, research, and the OGate Control Center (HLDD §3.1).

### B. The Energy Triad (Power Generation)

Players balance three generation methods, each with constraints (HLDD §3.1).

| Method | Pros | Constraint / trade-off |
|--------|------|-------------------------|
| **Solar Arrays** | Passive, maintenance-free | Limited by "Orbital Surface Area"; finite number before diminishing returns/hard caps |
| **Biomass Incinerators** | High output, scalable | Consumes raw Biomass: burn for power vs. refine into Nutrients/Polymers |
| **Fusion Reactors** | Massive output for late-game | Requires **Nebulite** fuel blocks. Nebulite **cannot be produced at home**; it must be harvested from **Gas Clouds** inside OGate instances (HLDD §3.1). |

---

## 3. Infrastructure & Facilities

### Extraction & Processing

- **Deep Core Drills:** Extract specific Ore Tiers available on the planet. Yield is determined by Drill Technology Level and the player's Mining Efficiency Skill (HLDD §3.1).
- **Bio-Harvesters:** Gather Biomass. Yield is determined by Bio-Harvester Technology Level and the player's Harvesting Skill (HLDD §3.1).
- **Mineral Refineries:** Process Ore into 5 distinct mineral tiers (Common to Exotic). Higher-level Refineries give greater yield and variety from the same ore batch (HLDD §3.1).
- **Bio-Processors:** Convert Biomass into:
  - **Nutrients:** Consumed by Specialists and crews (upkeep); essential for long-range OGate sorties.
  - **Polymers:** Base material for advanced ship hulls and tech (HLDD §3.1).

### Manufacturing & Military

- **Component Factory:** Combines Polymers and specific Minerals to create advanced alloys and tech components (HLDD §3.1).
- **Shipyard:** Construction of hulls. Also used for extensive/expensive reconstruction of wrecked hulls (e.g. after Emergency Warp with 100% structural damage) (HLDD §3.1, §5.3).
- **Barracks:** Recruits and reinforces Expeditionary Contingents (Marines, Engineers, Researchers). Contingents do not heal automatically; they must be brought back to full strength here (HLDD §5.2).

### Strategic Infrastructure

- **OGate Control Center:** The heart of the game. Upgrading it allows for **higher-tier Capacitors** (1MW, 1GW, etc.) and **better stability analysis** (HLDD §3.1). Capacitor tier and preparation are part of the Macro Loop (see docs/01_core_loops.md).

---

## 4. PvE Diplomacy & AI (The Social Glue)

**There are no player Corporations in the early game.** Social cohesion is driven by **Faction Alignment** (HLDD §3.2).

### The Faction Web

- **Faction Alignment:** Players pledge loyalty to a specific AI Faction. This grants access to a shared **Faction Chat** for coordination without the overhead of a Corp (HLDD §3.2).
- **Collaborative Research:** Faction members contribute to a global "Faction Research Pool." When milestones are hit, all members gain temporary buffs (e.g. "+10% Mining Yield for 24h") or unlock exclusive Faction Blueprints (HLDD §3.2).
- **Faction War Events:** Weekly global events where two Factions go to war. Players contribute by completing specific PvE objectives (e.g. "Donate 10,000 Iron," "Destroy 50 Pirate Ships"). Progress is aggregate and global; rewards are distributed weekly based on Faction success (HLDD §3.2).

### The SDI (Stellar Defense Initiative) (Home Security)

An interstellar alliance dedicated to the safety of developed systems (akin to Concord) (HLDD §3.2).

- **Security Contracts:** Daily PvE quests (e.g. "Eliminate Pirate Scouts," "Rescue Diplomatic Shuttle," "Scan Anomalies").
- **Rewards:** **Concordat Commendations**, used to purchase defensive orbital platforms, safe-logistics ships, or hire temporary AI wingmen (HLDD §3.2).

This supports the **Coffee Break** and **Progression** elements in the Macro Loop: refreshing contracts and managing Faction standing (docs/01_core_loops.md).

---

## 5. Research Branches

Research is divided into four disciplines, each with its own progression tree (HLDD §7.2). These are the main sinks for progression and loot from the Macro Loop.

| Branch | Focus | Examples (HLDD §7.2) |
|--------|--------|----------------------|
| **Home System Research** | Economy & infrastructure | Solar Efficiency, Bio-Combustion Output, Refinery Yields, Diplomatic Protocols, Automated Defense Grids |
| **Blueprint Research (The Armory)** | Hulls and Contingent types | Cruiser Hulls, Strategic Lancer Chassis, Marine Detachment Training, Fighter Squadron Protocols |
| **Tech Center** | Modules & materials | Fusion Containment, Deep Core Mining Lasers, Polymer Synthesis, Shield Harmonics, Compression Technology |
| **OGate Inc. (Wormhole Science)** | OGate mechanism | Capacitor Science (1GW+ tiers), Entropy Shielding, Jump Calculation Speed, Anomaly Scanning |
