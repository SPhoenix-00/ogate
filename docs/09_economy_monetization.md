# Economy & Monetization

This document summarizes the **monetization strategy** and **high-end economy** (Nanites, Artifacts) from the HLDD. Philosophy: **Pay for Variety and Convenience, not Win-State** (HLDD §9). Capacitors and preparation are in **Core Design & Loops** (docs/01_core_loops.md) and **OGate Mechanics** (docs/03_ogate_mechanics.md); Emergency Transponders are detailed in **Risk & Loss** (docs/06_risk_and_loss.md); Nanites and Artifacts also appear in **Progression** (docs/07_progression.md).

---

## 1. Monetization Strategy (Fair F2P)

The model focuses on **access**, **convenience**, **insurance**, and **cosmetics** rather than raw combat power (HLDD §9).

### 1. Capacitor Packs (Access)

- **Free path:** Players can **craft Capacitors** slowly (resources and time) (HLDD §9; docs/02_home_system.md).
- **Paid path:** Players can buy **“Experimental Capacitors”** with **Premium currency**. These **guarantee specific biome types** (e.g. “Ice Field” or “Ship Graveyard”) (HLDD §9).

### 2. Emergency Transponders (Insurance)

- **Item:** High-value **consumable** that provides **one-time insurance** for **Heavy Assets (Cruisers/Capitals)** (HLDD §9).
- **Mechanic:** If the ship is destroyed (or the wormhole collapses), the transponder **burns out** and the **hull returns to the Home System**. **Cargo is still lost**; hull, modules, and Contingents suffer RNG damage per HLDD §5.3 (HLDD §9; docs/06_risk_and_loss.md).

### 3. Specialist Headhunting

- **Pay to refresh** the Specialist recruitment pool **instantly** (HLDD §9).
- **“Clone Insurance”:** Pay to **save a Specialist’s XP after death** (HLDD §9; docs/05_ships_and_units.md).

### 4. Cosmetics

- **AI-generated custom ship skins** (HLDD §9).
- **Home system background skins** (HLDD §9).

### 5. Speed-Ups

- **Warp Drive Overclockers:** Reduce **travel time within the OGate instance** (e.g. jump takes 1 minute instead of 5) (HLDD §9; docs/04_combat_and_detection.md).
- **Research or construction time** in the Home System can also be reduced (HLDD §9).

### 6. Cybernetic Modules

- Players can **buy basic Cybernetic Modules** (stat boosters) with premium currency (HLDD §9).
- **Attaching** them to the character requires **Nanites**, which **cannot be bought** (HLDD §9). So high-end character power still requires playing (or trading) for Nanites (docs/07_progression.md).

### 7. Explorer Storylines (Key Monetization)

- **Product:** **One-time IAP per storyline** (~$2–3). The player dispatches a single **Explorer** through the OGate to follow a **scripted narrative** (Land-of-Livia–style); progress is asynchronous (time + optional check-ins) (HLDD §6.2, §9).
- **Limit:** **Only one storyline can be active at a time.** Completing or abandoning it frees the slot to start another.
- **Rewards:** Storyline-exclusive **cosmetics** (skins, decals, home backgrounds), **upgrades** (e.g. blueprints, small permanent bonuses), and on **completion** the Explorer **returns in a unique ship** — a hull or unique skin **only** obtainable from that storyline (HLDD §6.2; docs/11_explorer_storylines.md).
- **Design:** No PvP, no shared OGate instances; Explorer runs in a separate narrative layer. Full specification: **docs/11_explorer_storylines.md**.

---

## 2. High-End Economy (Unbuyable Currencies)

These currencies **cannot be purchased** with real money or premium currency. They tie prestige and power to gameplay (HLDD §7.3).

### Nanites (The Forbidden Tech)

- **Lore:** Forbidden technology from the Previous Era (HLDD §7.3).
- **Function:** Required to **attach** powerful **Cybernetic Enhancements** to the player character (global bonuses to skills) (HLDD §7.3).
- **Source:** Must be **extracted from high-risk OGate instances** (HLDD §7.3).
- **Restriction:** **Cannot be bought** with real money or premium currency. This forces high-spenders to play the game or trade with high-skill players (HLDD §7.3).

### Precursor Artifacts (The Prestige Economy)

- **Mechanic:** Rare, **non-functional relics** found in Deep Space (HLDD §7.3).
- **The Trader:** A **unique NPC in the Home System** accepts Artifacts in exchange for **Exclusive Skins** and **Visual Customizations** (HLDD §7.3).
- **Exclusivity:** These cosmetics are **unavailable in the cash shop**. A “Void-Touched” hull skin proves the player survived deep space, not that they paid (HLDD §7.3).

*Note:* The HLDD does not define a named “standard” currency (e.g. Credits), its sources, or its sinks. This doc only summarizes what is in the HLDD (§9 Monetization, §7.3 Advanced Progression).
