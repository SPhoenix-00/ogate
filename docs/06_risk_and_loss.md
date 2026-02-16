# Risk & Loss Mitigation

This document summarizes the **Transponder System** and the cost of escape from the HLDD. OGate is high-risk extraction, but the tiered safety system preserves tension (cargo/time loss) while reducing catastrophic progression wipes (permanent hull loss) in routine play (HLDD §5.3). How Contingents are affected by Emergency Warp is summarized in **Fleet & Units** (docs/05_ships_and_units.md); instance collapse and normal exfiltration are in **OGate Mechanics** (docs/03_ogate_mechanics.md).

---

## 1. Transponder Tiers (HLDD §5.3)

| Tier | Availability | Use | Notes |
|------|----------------|-----|--------|
| **Standard Transponder** | Auto-equipped on **light ships (Probes/Interceptors)** (HLDD §5.3). | **Unlimited** use. | Keeps early-game and scouts from bankruptcy on loss. |
| **Emergency Transponder** | Must be **purchased/crafted** and fitted to **Heavy Assets (Cruisers/Capitals)** (HLDD §5.3). | **Consumable.** Burns out on use; must be replaced. | High-value insurance for expensive hulls. |
| **No transponder / Jamming** | Heavy ships without an Emergency Transponder; or **Jamming Conditions** in some content. | — | **No transponder:** If destroyed, hull is lost. **Jamming:** Strategic Lancers and Void-Capacitor runs may have conditions that **disable all transponders**, forcing true permadeath for that content (HLDD §5.3). |

---

## 2. Escape Logic: When the Transponder Fires

The Emergency Warp creates a **Personal Exit Frame** at the ship’s current location. It follows **standard Exfiltration rules**: it has a **Spool-Up Time** based on mass, and it is **Cancelled** if combat is initiated during the spool-up (HLDD §5.3). So the player must not be engaged while spooling.

### Activation Triggers (“Eject” Criteria)

Escape is triggered automatically by the system or manually by the player when (HLDD §5.3):

1. **Wormhole collapse:** **Entropy reaches 100%** while the ship is inside (instance collapses; see docs/03_ogate_mechanics.md).
2. **Critical integrity:** Ship **Hull reaches 0 HP** in combat.
3. **Manual activation:** Player hits the **“Emergency Warp”** button (panic button), or disconnects / goes inactive for a set duration.
4. **Timeout:** Player is disconnected or AFK for more than **10 minutes**.

### Fair-Play Mechanics (Cost of Exit)

- **Zero-Entropy event:** Transponder activation uses the ship’s internal capacitor and the Transponder’s own fuel. It **does not** add Entropy to the **shared instance** (others are not punished for your escape) (HLDD §5.3).
- **Link severed:** The player’s OGate connection is **immediately shut down** (HLDD §5.3).
- **Capacitor consumed:** The **OGate Capacitor** used to enter the session is **lost**. To return, the player must craft or buy a new Capacitor (HLDD §5.3; docs/02_home_system.md, docs/01_core_loops.md).

---

## 3. The Cost of Survival (What Escapes)

Escaping via Transponder saves the hull but **sacrifices cargo** and inflicts **RNG damage** on hull, modules, and Contingents (HLDD §5.3).

### Cargo: Lost

The emergency warp dumps all mass to calculate the jump. **All Ore, Biomass, and Loot** are **ejected into the void**. The player returns with **no cargo** (HLDD §5.3).

### Ship Hull: RNG Structural Damage

- Each ship in the fleet rolls for **0%, 25%, 50%, or 100% structural damage** (HLDD §5.3).
- **100% damage:** The ship is a **“Wreck.”** It requires **extensive/expensive reconstruction** at the **Shipyard** (docs/02_home_system.md). The **hull asset is not deleted** (HLDD §5.3).

### Modules: RNG Damage

- Every module rolls for **0%, 25%, 50%, or 100% damage** (HLDD §5.3). High-tier modules may be burned out or broken.
- Damaged modules require **repair resources and time at the Home System** before they are usable again (HLDD §5.3).

### Specialists / Contingents: RNG Injury

- Troops **survive** but with severe injuries. Squads roll for **0–100% casualty rates** (HLDD §5.3).
- They **cannot be deployed** until **healed/replenished at the Barracks** (HLDD §5.3; docs/05_ships_and_units.md, docs/02_home_system.md).
- If a Contingent reaches **0 Strength** (e.g. 100% casualty roll or all troops killed in mission), the **unit is wiped out** and its **XP/Veterancy is lost forever** (HLDD §5.2).

### Skill Mitigation

High levels in **Wormhole Physics** and **Engineering** reduce the **severity** of module damage and Specialist injury time, so veterans recover from defeat faster (HLDD §5.3).
