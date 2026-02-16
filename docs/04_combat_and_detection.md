# PvP, Scanning & Combat

This document summarizes the **Active Layer** detection and combat mechanics of OGate from the HLDD: the tension between **detection**, **evasion**, and **engagement** inside an instance. The design is “Submarine Warfare in Space”—information is the primary weapon; combat is the resolution of a successful hunt. The overall sortie loop (entry → scouting → engagement → exfiltration) is in **Core Design & Loops** (docs/01_core_loops.md); instance rules (Entropy, Exit Frame) are in **OGate Mechanics** (docs/03_ogate_mechanics.md).

---

## 1. Detection Mechanics (The Hunt)

On the tactical map, **players are hidden by default**. They generate Entropy ripples but are not visible as nodes until detected. Static geography (planets, belts, gas clouds, stations) is visible to all on entry (HLDD §4.2, §4.4).

### A. Passive Visibility

- **Static geography:** All celestial bodies and stations are fully visible on the tactical dashboard from entry; there is no geographic fog of war (HLDD §2.2, §4.2).
- **Local visibility (on grid):** If two fleets occupy the **same node** (coordinate/planet), they are **automatically and instantly visible** to each other. There is no stealth once you are on grid with another player. The skill is in *finding* the enemy (scanning) or *avoiding* them (managing ripples); once at the same location, engagement is straightforward (HLDD §4.4).

### B. Active Graviton Scanning

To find a target not at your current location, you must hunt them (HLDD §4.4).

- **Scanner pulse:** A manual scan action (button press) takes approx. **5 seconds** to complete. It costs **no resources and no Entropy** (HLDD §4.4).
- **Result:** A successful scan reveals **“Activity of Interest”** markers at specific coordinates. It shows **Ripple Magnitude** (size) and **Threat Assessment** (danger level), but **not** specific ship types or counts (HLDD §4.4).
- **Warp solution:** A completed scan allows the player to initiate a **direct warp** to the detected coordinates (HLDD §4.4).
- **The “Sonar Ping” trade-off:** Active scanning **broadcasts a signal to the entire system**. Every other player receives an alert that an active scan was detected (and the scanner’s location is revealed). So scanning reveals prey but also reveals you to prey and other hunters (HLDD §4.4).

### C. The Collimation Mini-Game (Resolution vs. Stealth)

Scanning is not a simple “found / not found.” It depends on target **mass** vs. scanner resolution (HLDD §4.4).

- **Mass inverse:** Large fleets (high mass/ripple) are easy to lock. **One scan** gives a **100% Warp Solution** immediately (HLDD §4.4).
- **Small targets:** Small ships (low mass/ripple) appear as **“fuzzy”** signals. The scanner **cannot** lock a Warp Solution in one pass (HLDD §4.4).
- **Pinging:** To lock a small/stealthy target, the hunter must **ping** the location **multiple times** to collimate the signal and get a lock (HLDD §4.4).
- **Risk:** **Every single ping sends an alert to the target player** (e.g. “Active Scan Detected”). Example: hunting a stealth corvette may require several pings; the corvette gets multiple warnings and has seconds to move or cloak before the hunter can jump (HLDD §4.4).

---

## 2. Movement & Navigation

Movement in OGate is **point-to-point warp**. There is no free-flight joystick; the player taps a visible node (or a scanned signal) to warp (HLDD §2.2, §4.2).

### Warp Mechanics

- **Initiation:** Player taps a visible celestial (or scanned coordinates) to initiate warp (HLDD §2.2).
- **Transit:** Travel is **not instantaneous**. Depending on instance size and distance, a jump takes between **30 seconds** (small pockets) and **5 minutes** (massive systems) (HLDD §2.2).
- **Invulnerability:** Ships travel in **“Subspace”** and **cannot be intercepted or damaged** mid-transit (HLDD §2.2).
- **Speed-ups:** **Warp Drive Overclockers** (monetization item) can reduce travel time within the instance (e.g. 1 minute instead of 5) (HLDD §9).

### Visualization

- **No warp lanes:** No lines on the map show a ship’s path. The path between nodes is invisible (HLDD §2.2).
- **Ripples:** An **Entropy Ripple** is generated at **jump start** and at **landing**. Players watching the Entropy Gauge can infer movement (HLDD §2.2, §4.3). The **Detection Sequence** (below) uses this: a visual pulse appears when an enemy initiates warp (e.g. 2 minutes out), then silence until the Proximity Alert (HLDD §4.4).

---

## 3. Proximity Alerts (Early Warning)

Because combat **cannot be refused** once a hunter lands and locks on, the only defense is **evasion during the enemy’s travel time**—e.g. warping away before they arrive (HLDD §4.4).

### The Detection Horizon

- **Concept:** A dynamic early-warning system that triggers when an **incoming warp** breaches a **“Safety Perimeter”** (HLDD §4.4).
- **Base window:** By default, the alert triggers when the incoming ship is **20 seconds** from impact. The UI flashes red and an alarm sounds (HLDD §4.4).
- **Mass modifier:** Larger incoming ships are detected **earlier** (e.g. Capital 40–50 seconds out). Smaller ships (e.g. Interceptor) at the base 20 seconds or less with specialized stealth tech (HLDD §4.4).
- **Defender skills/modules:** Players can extend their **Detection Horizon** via skills (*Sensor Analysis*) and modules (*Long-Range Arrays*), gaining extra seconds to react (HLDD §4.4).

### The Detection Sequence (HLDD §4.4)

1. **Visual ripple:** A pulse appears on the Entropy Gauge when the enemy **initiates** warp (e.g. 2 minutes out). Attentive players see this first.
2. **Silence:** The enemy is in transit; no further UI alerts.
3. **Proximity alert:** The enemy breaches the Detection Horizon (e.g. 20 s out). UI flashes red, alarm sounds.
4. **Impact:** Enemy lands on grid. Local visibility engages; they can lock and attack.

---

## 4. Combat Resolution

Combat is **non-consensual** (the target cannot decline) and **automated** (OGame-style simulation, not twitch arcade). It is **manually initiated**: the attacker must press the **Attack** button to go from “co-location” to “combat”; simply sharing a node does not start a fight (HLDD §4.4).

### Engagement Sequence

- **Arrival:** Hunter lands at the target’s node. Both fleets are now visible to each other (local visibility).
- **Lock and initiate:** The attacker selects the target and presses **Attack** (HLDD: “Lock and Engage” / “Attack” button). Both players are **immediately** pulled into the **Combat Resolution Screen** (HLDD §4.4).
- **No refusal:** The defender **cannot decline**. The only defense is to warp away **before** the attacker arrives and locks on (during the warning window / Detection Horizon) (HLDD §4.4).

### How Combat Is Resolved (HLDD §4.4)

- **Attacker vs. target:** The HLDD defines the **attacker** as the player who **arrives** at the location and **initiates** combat (presses Attack)—typically the one who **just warped in**. The **target** is the fleet already on grid; they **cannot decline** the fight. This role distinction is what determines **initiative** (who fires first): the attacker, having just landed and chosen to engage, has initiative (HLDD §4.4: “If the attacker initiates combat, both players are immediately pulled into the Combat Resolution Screen”).
- **Mechanic:** The battle is resolved **automatically** based on **Fleet Composition**, **Tech Levels**, and **Module Loadouts**. Once shots are fired, the math takes over (HLDD §4.4).
- **Tactical input:** Before battle, players set **Rules of Engagement** or **Stance** (e.g. “Focus Fire,” “Protect Haulers”). This is the only tactical input; there is no manual aiming or reflex-based play (HLDD §4.4).
- **Visualization:** The game renders a **high-fidelity 2D** visualization (AI-generated assets) showing **rounds of fire**, **shield impacts**, and **hull breaches**, so players can see *why* they won or lost (HLDD §4.4).

*Note:* The HLDD does not spell out subsequent round order (after the first volley), shield regeneration rules, “Action Points,” or multi-party (3+ fleet) rules. This doc only summarizes what is in the HLDD.
