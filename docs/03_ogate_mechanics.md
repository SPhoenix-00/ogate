# OGate Mechanics & Entropy

This document summarizes the core rules governing OGate instances from the HLDD: the **Capacitor System**, the **Entropy** (shared stability budget) mechanic, **instance lifecycle**, and **exfiltration**. These define the high-stakes environment. The active sortie loop (entry → scouting → engagement → exfiltration) is covered in **Core Design & Loops** (docs/01_core_loops.md).

---

## 1. The Capacitor System

The OGate requires a **Capacitor** to fire. The Capacitor determines instance generation parameters and the **Mass Transmission Budget** (how much mass can be brought in). Capacitors are crafted or acquired at the Home System (docs/02_home_system.md); see HLDD §4.1.

### Capacitor Tiers

| Tier | Instance profile | Mass budget | Player cap (HLDD §4.2) |
|------|-------------------|-------------|-------------------------|
| **1MW Capacitor** | Small, low-reward stable pocket. Low PvP chance. Basic Ore/Biomass. | **Low** — light ships only (HLDD §4.1, §5.1). | ~4 players |
| **1GW Capacitor** | Massive system. High-tier resources (Nanites, Exotic Matter). High PvP probability. | **High** — Cruisers/Capitals (HLDD §4.1). | ~16 players |
| **Void Capacitor (Endgame / Phase 2)** | **Persistent Wormhole Space.** Systems do not collapse; allow player-owned outposts and Corporations. | High-level strategic content, not part of the early game loop (HLDD §4.1). | — |

*Note:* The HLDD does not list exact “allowed/forbidden” hulls per tier beyond “Light ships only” (1MW) and “Cruisers/Capitals” (1GW). Ship classes and mass calculation are in HLDD §5.1.

---

## 2. Instance Topology (Brief)

- **Shape:** Circular map bounded by an **Event Horizon** (lethal damage zone) (HLDD §4.2).
- **System view:** Players do not pilot in a 3D/2D flight sim. The view is a **tactical dashboard** (backdrop + overlay UI). Locations (planets, belts, gas clouds) and detected signals are selectable nodes or a list. Static geography is always visible; dynamic content (fleets, yields) requires scanning (HLDD §4.2).
- **Spawn:** Each player has a **unique entry/exit coordinate** on the edge of the instance (HLDD §2.2, §4.2).

---

## 3. Entropy: The Shared Stability Budget

OGate instances do **not** use a fixed timer. They use a **Shared Public Stability Budget** called **Entropy**. Every player in the instance consumes from the same pool, so one player’s actions shorten everyone’s window (HLDD §4.3).

### Behaviour

- **Elasticity:** Duration depends on player activity (e.g. a single stealth ship vs. a battleship fleet in combat) (HLDD §4.3).
- **Actions that increase Entropy:** Entry, movement, combat, looting (HLDD §4.3). Ripples are visible on the Entropy gauge; skilled players can read them to detect others (HLDD §4.3).
- **Exiting** does **not** restore Entropy; it only creates an exit ripple (HLDD §4.3).

### Decay Rules

- **Passive decay (empty instance):** When **0 players** are present, Entropy decays at a fixed rate of **0.1% per second** (6% per minute) (HLDD §4.3).
- **Active decay (occupied):** Standard decay applies based on player count and actions (HLDD §4.3).

### The 25% Entry Rule

A player **cannot enter** an existing instance if their fleet’s mass would reduce the current Entropy **below 25%**. Example: if the instance is at 30% Entropy, the player can only bring a fleet whose mass “cost” is 5% or less (HLDD §5.1). Mass = (Ship Hulls) + (Fighters) + (Total Cargo); modules and Specialists do not count (HLDD §5.1).

### Collapse & Despawn

- **Total collapse (non-empty):** If a *non-empty* instance drops to **0% Entropy**, the event horizon collapses. **All assets inside are wiped.** The instance is then despawned (HLDD §4.3). Escape is only possible via Emergency Transponder (HLDD §5.3); see Risk & Loss doc.
- **33% floor (empty):** If an *empty* instance drops **below 33% Entropy**, it is flagged as “Collapsed/Unstable.” No new players can join. **It is then despawned** (HLDD §4.3).
- **Re-entry:** Players can join an existing instance (including one with 0 players) if its Entropy is **above 33%** and it is not at the player cap (HLDD §4.3).

---

## 4. Instance Lifecycle & Population

### Spawning & Selection

- **Trigger:** An instance is created when a player activates an OGate and the system decides a new instance is needed (HLDD §4.2).
- **Selection logic:** By default, **50% chance** to create a new instance and **50% chance** to join an existing, non-full instance (HLDD §4.2).
- **Modifiers:** Players can craft/buy **Capacitor Modifiers** to skew this (e.g. *Isolation Modifier* = 100% new instance; *Hunter Modifier* = 100% join existing) (HLDD §4.2).
- **Region locking:** Instances are clustered geographically (server-side) to minimize latency (HLDD §4.2).
- **No intentional grouping:** Players cannot choose to join the same instance as a friend; matchmaking is randomized. Faction alignment has no influence (HLDD §4.2).

### Player Caps & Enforcement

- **Caps:** Small Capacitors ~4 players, Large Capacitors ~16 players (HLDD §4.2).
- **Pre-entry check:** The cap is enforced *before* the ship enters; a player cannot “spike” a full instance’s Entropy (HLDD §4.2).
- **Overflow fallback:** If two players attempt to fill the final slot at once (race condition), the “excess” player is pushed into a **brand new, empty** instance so the jump never fails (HLDD §4.2).

### Session Commitment (Frictionless Play)

- **No cooldown** between OGate activations. **No minimum time** in the instance; a player can jump in, scan briefly, and leave (only the Capacitor is consumed) (HLDD §4.3). This supports the **Micro Loop** and “poke and leave” design (docs/01_core_loops.md).

---

## 5. Exfiltration Sequence

Leaving the wormhole is a **deliberate action** at the **Exit Frame**, not automatic. See also **Micro Loop — Step 5: Exfiltration** in docs/01_core_loops.md (HLDD §4.6).

### The Exit Frame

- The player’s entry/exit point is a **specific node** in space called the **Exit Frame**. Like any other node, it can be scanned, camped, and occupied (HLDD §4.6).
- It emits a faint, continuous Entropy signal (**“Harmonic Hum”**), making it discoverable by scanners (HLDD §4.6).

### Activation & Spool-Up

- **Manual trigger:** The player must press **“Open OGate Connection”** to start the exit sequence (HLDD §4.6).
- **Mass-based delay:** Spool-up time depends on total fleet mass (e.g. light fleet ~3 s, heavy ~10 s). High-level **Wormhole Navigation** skills reduce this time (HLDD §4.6).

### Interruption & Grace Rule

- **Combat:** If the player is **engaged in combat** (engaged by an enemy) during spool-up, the exit is **cancelled immediately** and combat ensues (HLDD §4.6).
- **Grace rule (magnanimous exit):** If the player **successfully initiates** the exit sequence (presses the button) **before** Entropy hits 100% (collapse), the exit is **guaranteed to complete**, even if the wormhole collapses during the spool-up animation (HLDD §4.6).
