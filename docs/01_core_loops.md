# Core Design & Loops

This document summarizes the fundamental gameplay loops of OGate from the High-Level Game Design Document: the **Dual-Session Economy** for the mobile midcore audience. The game is split into a low-friction management layer (Home System) and a high-stakes active layer (OGate instances).

---

## 1. Session Philosophy: The Dual-Session Economy

OGate does not target a single session length. It supports two distinct modes of play.

### A. The Coffee Break (5 Minutes)

- **Context:** Commuting, quick check-ins.
- **Primary mode:** Portrait mode (one-handed). Home System is playable entirely in portrait (HLDD §8.2).
- **Focus:** Management, logistics, social.
- **Risk:** Zero. The Home System is a Sanctuary; ships docked at home are safe from other players (HLDD §3.3).
- **Typical actions:**
  - Collecting passive resource generation (Ore, Biomass, Energy).
  - Queueing skill training (24h queue limit; HLDD §7.1).
  - Refreshing trade deals or Faction contracts.
  - Crafting or acquiring Capacitors for future OGate runs.

### B. The Deep Dive (1 Hour+)

- **Context:** Dedicated gaming time.
- **Primary mode:** Portrait mode (same as Home). OGate instances are also played in portrait; no rotation required (HLDD §8.2).
- **Focus:** Exploration, combat, high-stakes decision-making.
- **Risk:** High. Total asset loss is possible inside the instance.
- **Typical actions:**
  - Activating an OGate (consumes a Capacitor).
  - Scanning for entropy ripples and hidden anomalies.
  - Engaging in PvP or high-end PvE.
  - Extracting loot (Ore, Biomass, Nanites, Artifacts) and exfiltrating before collapse.

---

## 2. The Macro Loop (Idle / Management)

The Macro Loop takes place entirely in the Home System. It is the economic engine that fuels OGate sorties. The HLDD defines five steps (HLDD §2.1).

### Step 1: Production

- **Passive income:** Infrastructure extracts raw **Ore** (five tiers) and **Biomass**, and generates **Energy** (Solar, Biomass Incinerators, Fusion) to power refining and research (HLDD §3.1).
- **Refining:** Raw materials are processed at home:
  - **Mineral Refineries:** Ore → distinct mineral tiers (Common to Exotic).
  - **Bio-Processors:** Biomass → **Nutrients** (upkeep for Specialists/crews) and **Polymers** (hulls and tech).
  - *Note:* **Nebulite** fuel for Fusion reactors is not produced at home; it is harvested from Gas Clouds inside OGate instances (HLDD §3.1).

### Step 2: Preparation (The Hangars)

- **Fleet construction:** Building ships to replace losses (Shipyard).
- **Specialist training:** Recruiting and reinforcing Expeditionary Contingents (Marines, Engineers, Researchers) at the Barracks.
- **Capacitor crafting:** Manufacturing or acquiring the **Capacitors** (1MW, 1GW, or Void) required to open specific OGate tiers (HLDD §4.1).

### Step 3: The Gamble

- **Decision:** The player chooses a Capacitor tier based on available time and risk tolerance (instance size, mass budget, PvP probability).
- **Commitment:** Activating the OGate consumes the Capacitor immediately. There is no cooldown between activations; a player can jump in, scan briefly, and leave (HLDD §4.3).

### Step 4: Extraction

- **Bridge to the Micro Loop:** The player enters the instance to loot Ore, Biomass, Nanites, and Artifacts, then must exit before the instance collapses (HLDD §2.1).

### Step 5: Progression

- **Tech and upgrades:** Loot is used to upgrade the OGate, research better tech, or trade for rare Specialists (HLDD §2.1).
- **Diplomacy:** Managing standing with AI Factions to unlock market tiers and Faction benefits (HLDD §3.2).

---

## 3. The Micro Loop (Active / Sortie)

The Micro Loop takes place entirely inside an **OGate instance**. It is where resources are acquired and ships can be lost (HLDD §2.2).

### Step 1: Entry

- **Spawn:** The fleet spawns at a **random coordinate on the edge** of the circular instance. This coordinate is the **only** entry/exit for that player (HLDD §2.2, §4.2).
- **System view:** The entire **static geography** is fully revealed on entry (planets, belts, gas clouds, stations). There is no geographic fog of war. **Dynamic** content (other fleets, yields) requires scanning (HLDD §2.2, §4.2).

### Step 2: Scouting (Submarine Warfare)

- **Passive:** Planets and basic POIs are visible; avoiding detection by minimizing movement and ripple.
- **Active:** Players use **Graviton Scanners** to detect **Entropy Ripples** (other players) or hidden anomalies.
- **Risk:** Active scanning broadcasts a **“Sonar Ping”** to the entire system, revealing the scanner’s location (HLDD §4.4).

### Step 3: Engagement

- **Movement:** **Point-to-point Warp.** The player taps a celestial to initiate warp. Transit is not instantaneous (e.g. 30 seconds to 5 minutes depending on distance). Ships travel in “Subspace” and **cannot be intercepted** mid-transit. No warp lanes are visible; ripples appear at jump start and landing (HLDD §2.2, §4.4).
- **Local visibility:** If two fleets occupy the **same node**, they are automatically and instantly visible to each other; there is no stealth on grid (HLDD §4.4).
- **Actions:** Mining nodes, salvaging derelicts, or engaging enemy fleets.
- **Combat:** Combat is **manually initiated** (player presses Attack to lock and engage). The target **cannot decline**; both are pulled into the Combat Resolution screen. Resolution is **automated** (fleet composition, tech, modules), visualized in high-fidelity 2D (HLDD §4.4).

### Step 4: Destabilization (The Clock)

- **Entropy:** Every action (entry, movement, combat, looting) increases **Entropy**. The instance has a **shared public stability budget**; all players consume from the same pool, so one player’s actions shorten everyone’s window (HLDD §4.3).
- **Tension:** Players weigh the reward of “one more” action against the risk of collapse. When Entropy reaches 0%, the event horizon collapses and all assets inside are wiped (HLDD §4.3).

### Step 5: Exfiltration

- **Retreat:** Warp back to the player’s **Exit Frame** node (the entry/exit point). The Exit Frame can be scanned and camped; it emits a faint continuous signal (HLDD §4.6).
- **Activation:** The player must manually press **“Open OGate Connection”** to start the exit sequence (HLDD §4.6).
- **Spool-up:** A **mass-dependent delay** (e.g. 3 seconds light, 10 seconds heavy; reducible by skills). If the player is **engaged in combat** during spool-up, the exit is **cancelled** and combat ensues (HLDD §4.6).
- **Grace rule:** If the exit sequence is successfully **initiated before** Entropy hits 100%, the exit is guaranteed to complete even if the wormhole collapses during the spool-up animation (HLDD §4.6).
