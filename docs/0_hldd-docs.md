# OGate Documentation Structure

This index outlines the breakdown of the High-Level Game Design Document into focused technical specifications. The **HLDD** is the source of truth; the numbered docs summarize and expand on it.

---

## 0. High-Level Game Design Document (Source of Truth)

**File:** `docs/00_OGate Game Design Document.md`

**Content:** The full OGate HLDD—executive summary, core loops, Home System, OGate mechanics, PvP/detection, units & Contingents, transponders, narrative, progression, tech stack, monetization, art direction.

- **Sections:** 1 Executive Summary → 2 Core Loops → 3 Home System → 4 OGate Mechanics → 5 Units & Specialists → 6 Narrative → 7 Progression → 8 Technical → 9 Monetization → 10 Art & Audio
- All other docs in this tree derive from and must align with the HLDD.

---

## 1. Core Design & Loop

**File:** `docs/01_core_loops.md`

**Content:** Detailed breakdown of the Dual-Session Economy.

- **The Macro Loop (Idle):** Production, Research, Diplomacy
- **The Micro Loop (Active):** OGate Sorties, Scanning, Combat, Extraction
- **Session Philosophy:** Coffee Break (5m) vs. Deep Dive (1h+)

---

## 2. The Home System (Sanctuary)

**File:** `docs/02_home_system.md`

**Content:** Economy and Infrastructure mechanics.

- **Resources:** Ore, Biomass, Energy (Solar/Biomass/Fusion)
- **Facilities:** Refineries, Factories, Shipyards
- **Sanctuary Rules:** Safety from PvP, Fleet Docking

---

## 3. OGate Mechanics & Entropy

**File:** `docs/03_ogate_mechanics.md`

**Content:** The technical rules of the wormhole instances.

- **Capacitor System:** Tiers (1MW/1GW), Hull Constraints
- **Entropy:** The Shared Stability Budget, Decay Rates, Collapse Triggers
- **Instance Lifecycle:** Spawning, Region Locking, Player Caps, Despawn logic
- **Exfiltration:** Exit Frame mechanics, Spool-up times, Interruption rules

---

## 4. PvP, Scanning & Combat

**File:** `docs/04_combat_and_detection.md`

**Content:** The "Submarine Warfare" and engagement rules.

- **Detection:** Passive Visibility vs. Active Graviton Scanning (Sonar Pings)
- **Collimation:** The scanning mini-game/mechanic
- **Movement:** Point-to-Point Warp, Travel Times, No-Intercept rules
- **Combat Resolution:** Round-based automated resolution, Shield/Hull logic, Action Economy
- **Proximity Alerts:** Detection Horizons and Mass modifiers

---

## 5. Fleet & Units

**File:** `docs/05_ships_and_units.md`

**Content:** Ship classes and crew systems.

- **Ship Classes:** Fighters, Probes, Haulers, Barges, Cruisers, Capitals, Strategic Lancers
- **Mass Budget:** Calculation formulas and entry constraints
- **Modular Platforms:** Specialized loadouts for Strategic/Industrial ships
- **Contingents:** Marine/Engineer/Research squads, Attrition, and Perma-death

---

## 6. Risk & Loss Mitigation

**File:** `docs/06_risk_and_loss.md`

**Content:** The specific rules regarding death and escape.

- **Transponder System:** Standard vs. Emergency Transponders
- **Escape Logic:** Activation triggers, Zero-Entropy cost
- **Penalties:** RNG Module Damage, Contingent Injury, Cargo Loss

---

## 7. Progression & Research

**File:** `docs/07_progression.md`

**Content:** How players advance over time.

- **Skill System:** Time-based training queues (24h limit)
- **Research Trees:** Home System, Blueprint (Armory), Tech Center, OGate Science

---

## 8. Social & Diplomacy

**File:** `docs/08_social_systems.md`

**Content:** Factions and Concordat interactions.

- **Faction Alignment:** Reputation, Shared Research, War Events
- **Stellar Concordat:** Security Contracts and PvE loop

---

## 9. Economy & Monetization

**File:** `docs/09_economy_monetization.md`

**Content:** Currencies and F2P Strategy.

- **Currencies:** Credits, Nanites (Unbuyable), Artifacts (Prestige)
- **Monetization:** Capacitor Packs, Emergency Transponders, Speed-ups, Cosmetics

---

## 10. Technical & UX

**File:** `docs/10_technical_ux.md`

**Content:** Stack and Interface guidelines.

- **Tech Stack:** Phaser, Colyseus, MongoDB/Redis
- **Mobile UX:** Portrait only (Home and OGate)
- **UI Philosophy:** Diegetic "Dashboard" vs. Sim
