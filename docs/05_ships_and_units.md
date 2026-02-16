# Fleet & Units

This document summarizes the naval assets and specialized personnel (Expeditionary Contingents) from the HLDD. The fleet is built around **Mass Budget** constraints and **modular specialization**; what you bring into the wormhole is limited by the Capacitor tier and the 25% Entropy rule (docs/03_ogate_mechanics.md). Preparation (Shipyard, Barracks, Capacitors) is covered in **Core Design & Loops** (docs/01_core_loops.md) and **Home System** (docs/02_home_system.md).

---

## 1. Mass Budget & Entry Constraints

Every Capacitor tier has a **strict Mass Limit**. Players must fit their fleet into the pipe (HLDD §5.1).

### Mass Calculation

- **Mass =** (Sum of Ship Hulls) + (Sum of Fighters) + (Total Cargo) (HLDD §5.1).
- **Weightless:** Modules and Specialists do **not** count toward Mass (HLDD §5.1).

### Entry Constraints

- **Capacitor limit:** A fleet cannot enter if its mass exceeds the Capacitor’s Mass Transmission Budget. The HLDD specifies “Light ships only” for 1MW and “Cruisers/Capitals” for 1GW; exact hull lists are not enumerated (HLDD §4.1, §5.1; see docs/03_ogate_mechanics.md).
- **25% Entropy rule:** A player **cannot enter** an existing instance if their fleet’s mass would reduce the current Entropy **below 25%**. Example: if the instance is at 30% Entropy, the player can only bring a fleet whose mass “cost” is 5% or less (HLDD §5.1).

---

## 2. Ship Classes (HLDD §5.1)

Ships are listed in HLDD order. Fit into 1MW vs 1GW is determined by mass (light ships only vs Cruisers/Capitals).

### Probes (Scouts)

- **Role:** High speed, essential for checking safety (HLDD §5.1).
- **Trade-off:** Advanced **Graviton Scanners** (needed for detailed resource/quest info) are extremely heavy. Fitting a scanner consumes a large part of the Mass Budget, so you often cannot bring a heavy combat ship *and* a high-end scout (HLDD §5.1).

### Fighters

- **Role:** Harassment. High evasion; they dodge most heavy munitions but are shredded by Point Defense (HLDD §5.1).
- **Restriction:** Very small, single-seat craft. **Sublight only**; cannot use the OGate independently. Must be carried by a **Backbone** or **Capital Ship** (HLDD §5.1).

### Haulers

- **Role:** High cargo, weak defense. Designed for logistics; they rely on Industrial Barges (or other ships) to fill their holds (HLDD §5.1).

### Industrial Barges (Modular Platforms)

- **Role:** Workhorses of the extraction economy. Versatile hulls that adapt to the resource node via expensive subsystems (HLDD §5.1).
- **Modules (HLDD §5.1):**
  - **Deep Core Lasers:** Optimized for high-yield Ore extraction.
  - **Bio-Scythe Arrays:** Specialized for Biomass harvesting without damaging the ecosystem.
  - **Nebulite Scoops:** Required to harvest gas from volatile clouds.
  - **Compression Core:** Sacrifices extraction hardpoints to compress raw resources in the hold. Nearby Haulers can then transport **10x the volume** (one ship mines, another compresses/hauls) (HLDD §5.1).

### Interceptors

- **Role:** Fast attack, good for catching Haulers (HLDD §5.1).

### Backbones (Light Carriers)

- **Role:** “Mini-carrier” capable of transporting a squadron of **~12 Fighters** through the OGate (HLDD §5.1).
- **Weakness:** Completely defenseless (no hardpoints) and fragile. Relies entirely on its fighter screen (HLDD §5.1).

### Cruisers

- **Role:** The versatile backbone of any fleet. Multirole platforms balancing armor, firepower, and speed; can be fitted for combat, scanning, or light transport (HLDD §5.1).
- **Trade-off:** Jack-of-all-trades, master of none. A specialized ship will outclass a Cruiser in its specific domain (HLDD §5.1).

### Capital Ships

- **Role:** Massive force projection and Fighter Carriers. Can launch **hundreds of fighters** to swarm enemies (HLDD §5.1).
- **Restriction:** Massive hulls requiring **Fusion Reactors** for sublight propulsion. **Cannot jump** without active **Nebulite** fuel in the hold (HLDD §5.1). Nebulite is harvested from Gas Clouds in OGate (docs/02_home_system.md).

### Strategic Lancers (Modular Platforms)

- **Role:** Highly advanced, expensive hulls that act as blank slates for specialized **“Subsystem Modules.”** The hull is moderately expensive; the **Modules** are very expensive and define the ship’s identity (HLDD §5.1).
- **Versatility:** A single ship can be refitted for entirely different roles (HLDD §5.1).
- **Module loadouts (HLDD §5.1):**
  - **Command Modules:** Enhanced fleet-wide bonuses or superior **Entropy Intelligence** (e.g. clearer ripple signals). Does *not* weaponize or manipulate Entropy; it is a clean signal tool.
  - **Fusion Lance:** Devastating DPS.
  - **EW Suite:** Jams enemy sensors.
  - **Logistics Array:** Long-range tractor beams for looting or shield repair.
  - **Missile Batteries:** High-volume bombardment.
- **Impact:** Can single-handedly turn the tide of battle; losing one is a catastrophic economic event (HLDD §5.1).

---

## 3. Expeditionary Contingents (The RPG Layer)

Ships carry specialized **Military & Science Contingents** for ground operations, boarding, and hazardous exploration (HLDD §5.2).

### Structure

- **Unit Strength (HP):** Each Contingent is a named squad (e.g. “52nd Void Engineers,” “3rd Recon Platoon”). “Health” is the number of active troops remaining (HLDD §5.2).
- **Attrition:** Hazards and combat kill troops. A unit at 50% strength works 50% slower and fights at 50% effectiveness (HLDD §5.2).
- **Replenishment:** Squads do **not** heal automatically. They must be **reinforced/recruited** back to full strength at the **Home System Barracks** (HLDD §5.2; docs/02_home_system.md).

### Contingent Types (HLDD §5.2)

| Type | Usage |
|------|--------|
| **Marine Detachment** | Boarding enemy ships, repelling boarders, raiding planetary outposts. |
| **Engineering Corps** | Salvaging heavy wreckage, emergency hull repairs mid-combat, stabilizing volatile OGate artifacts. |
| **Research Team** | The only units that can enter hazardous derelicts or analyze ancient ruins **without triggering fatal traps**. |

### Perma-Death (HLDD §5.2)

- **Ship destroyed:** All embarked Contingents are **lost** (HLDD §5.2).
- **0 Strength:** If a Contingent reaches 0 Strength (all troops killed) during a mission, the **unit is wiped out** and its accumulated **XP/Veterancy is lost forever** (HLDD §5.2).

### Emergency Warp (Transponder) and Contingents

When a ship escapes via **Emergency Warp** (Transponder), Contingents suffer **RNG injury**: squads roll for **0–100% casualty rates**. They cannot be deployed until **healed/replenished at the Barracks** (HLDD §5.3). Full Transponder rules (triggers, cost, hull/module damage, cargo loss) are in the Risk & Loss doc (HLDD §5.3).

---

## 4. Loss Mitigation: Transponder System (Summary)

The HLDD defines a tiered safety system (Standard vs Emergency Transponders, activation triggers, cost of escape). **05_ships_and_units** only summarizes how it touches **units**; the full system is in HLDD §5.3 and will be covered in the dedicated Risk & Loss doc (docs/06_risk_and_loss.md per the index).

- **Standard Transponders:** Auto-equipped on light ships (Probes/Interceptors). Unlimited use (HLDD §5.3).
- **Emergency Transponders:** Consumable for Heavy Assets (Cruisers/Capitals). Burns out on use (HLDD §5.3).
- **Jamming Conditions:** Strategic Lancers and Void-Capacitor runs may have conditions that disable all transponders (true permadeath for that content) (HLDD §5.3).
