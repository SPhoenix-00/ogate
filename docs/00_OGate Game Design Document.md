# **OGate: High-Level Game Design Document (HLDD)**

**Version:** 5.4  00-OGate Game Design Document
**Genre:** 4X Strategy / Extraction MMO  
**Platform:** Mobile Web (Midcore Exclusive)  
**Visual Style:** 2D AI-Generated Sci-Fi (Dark, Gritty, Industrial)

## **1\. Executive Summary**

**OGate** is a mobile-first MMO designed to disrupt the stagnant midcore strategy sector. It merges the familiar empire-building loops of mobile 4X games with the high-stakes, instanced PvPvE tension of *EVE Online* wormhole space.  
**Design Philosophy: Familiarity & Risk**

* **The Anchor (Home System):** Designed to feel instantly familiar to any mobile strategy player. It uses established 4X conventions (timers, upgrades, resource collection) to provide a comfortable, low-friction "Idle" layer.  
* **The Innovation (OGate):** The risk-taking layer. A high-tension extraction environment that breaks the mold of static mobile combat, offering genuine loss and dynamic, emergent gameplay.

**Target Audience & Session Design**

* **Midcore Mobile:** Built for the player who wants depth without the desktop tether.  
* **The Dual-Session Economy:** There is no single "target time."  
  * *The Coffee Break (5 Minutes):* Manage the Home System, queue skills, collect idle resources, and refresh trade deals.  
  * *The Deep Dive (1 Hour+):* Activate the OGate for a dedicated session of exploration, combat, and extraction when the player has time to commit.

## **2\. Core Gameplay Loops**

### **2.1 The Macro Loop (Empire Management \- Idle Layer)**

1. **Production:** Infrastructure in the Home System extracts raw **Ore** and **Biomass**, and generates **Energy** to power refining and research.  
2. **Preparation:** Player builds ships, trains Specialists, and crafts/acquires **Capacitors**.  
3. **The Gamble:** Player activates the OGate using a specific Capacitor tier (defining risk/reward).  
4. **Extraction:** Player enters the instance to loot Ore, Biomass, **Nanites**, and **Artifacts**, then exits before collapse.  
5. **Progression:** Loot is used to upgrade the OGate, research better tech, or trade for rare Specialists.

### **2.2 The Micro Loop (The Sortie \- Active Layer)**

1. **Entry:** Fleet spawns at a random coordinate on the *edge* of the circular instance. This coordinate is the **only** exit for this player.  
2. **System View & Navigation:**  
   * **Visibility:** Upon entry, the entire static geography is fully revealed. The player sees all Planets, Asteroid Belts, Gas Clouds, and Stations immediately on the 2D System Map. There is no geographic "Fog of War."  
   * **Movement (Warp):** Players tap a visible celestial body to initiate a **Warp**.  
     * *Transit Time:* Travel is **not instantaneous**. Depending on the size of the instance and distance, a jump takes between **30 seconds** (small pockets) to **5 minutes** (massive systems).  
     * *Invulnerability:* Ships travel in "Subspace" and **cannot be intercepted** mid-transit.  
     * *Visualization:* **No warp lanes** are visible on the map. An Entropy Ripple is generated at the *start* (jump initiation) and *end* (landing) of the jump, but the path in between is invisible.  
3. **Scouting (Submarine Warfare):**  
   * **Passive Vision:** Planets and basic POIs are visible.  
   * **Active Scanning:** Players use Graviton Scanners to find hidden anomalies and Entropy Ripples (other players).  
   * **The Ping:** Active scanning reveals targets but broadcasts a "Sonar Ping" to the entire system, revealing the scanner's location to everyone else.  
4. **Engagement:** Player moves to targets.  
   * **Local Visibility:** If two fleets occupy the same Node (coordinate), they **automatically** see each other. There is no local stealth.  
   * **Combat:** Resolved automatically based on fleet composition and tech (OGame style), visualized with high-fidelity 2D AI art. Requires manual initiation.  
5. **Destabilization:** Every action (movement, combat, looting) increases "Entropy."  
6. **Exfiltration:** Player retreats to their edge entry point. They must manually interact with the **Exit Frame** to trigger the exit sequence (see 4.6).

## **3\. The Home System (Sanctuary)**

*Unlike OGame, the Home System is not a target for total destruction. It is a strategic anchor designed for low-stress, idle-style progression.*

### **3.1 Infrastructure & Economy**

* **Extraction:**  
  * **Planetary Composition:** Each planet generates with a unique distribution of the **5 distinct Ore Tiers** (Tier 1: Common to Tier 5: Exotic) and **Biomass**. Some worlds may be rich in Tier 1 and 2 metals but completely devoid of high-tier conductors, while others offer a balanced spread.  
  * **Deep Core Drills:** Extract specific **Ore Tiers** available on the planet. **Yield** is determined strictly by the **Drill Technology Level** and the player's **Mining Efficiency Skill**.  
  * **Bio-Harvesters:** Gather **Biomass**. **Yield** is determined by the **Bio-Harvester Technology Level** and the player's **Harvesting Skill**.  
    * *Regeneration:* Biomass deposits regenerate slowly over time. Even if the planet is stripped to **0%**, the local ecosystem will eventually recover, preventing players from permanently breaking their resource loop (though recovery from 0% takes significant time).  
* **Energy Generation (The Power Triad):**  
  * **Solar Arrays:** Passive, maintenance-free energy.  
    * *Constraint:* Limited by "Orbital Surface Area." You can only build a finite number before hitting diminishing returns/hard caps.  
  * **Biomass Incinerators:** High-output generators that burn raw **Biomass**.  
    * *Trade-off:* Forces a strategic choice. Do you burn Biomass for immediate power, or refine it into Nutrients/Polymers for fleet upkeep and upgrades?  
  * **Fusion Reactors:** Massive energy output required for late-game tech.  
    * *Constraint:* Requires **Nebulite** fuel blocks. Nebulite cannot be produced at home; it must be harvested from **Gas Clouds** inside dangerous OGate instances.  
* **Refining & Processing:**  
  * **Mineral Refineries:** Process Ore into 5 distinct mineral tiers (Common to Exotic). Higher-level Refineries extract a greater yield and variety of minerals from the same ore batch.  
  * **Bio-Processors:** Convert Biomass into:  
    * **Nutrients:** Consumed by Specialists and crews (Upkeep). Essential for long-range OGate sorties.  
    * **Polymers:** Base material for advanced ship hulls and tech.  
* **Manufacturing:**  
  * **Component Factory:** Combines Polymers and specific Minerals to create advanced alloys and tech components.  
  * **Shipyard:** Construction of hulls.  
  * **OGate Control Center:** The heart of the game. Upgrading this allows for higher-tier Capacitors and better stability analysis.

### **3.2 PvE Diplomacy & AI (The Social Glue)**

**There are no player Corporations in the early game.** Social cohesion is driven by **Faction Alignment**.

* **The Faction Web:** The galaxy is populated by major AI factions.  
  * **Faction Alignment:** Players pledge loyalty to a specific Faction. This grants access to a shared **Faction Chat**, allowing coordination and social play without the administrative overhead of a Corp.  
  * **Collaborative Research:** Faction members contribute resources to a global "Faction Research Pool." When milestones are hit, all members gain temporary buffs (e.g., "+10% Mining Yield for 24h") or unlock exclusive Faction Blueprints.  
  * **Faction War Events:** Weekly global events where two Factions go to war. Players contribute by completing specific PvE objectives (e.g., "Donate 10,000 Iron," "Destroy 50 Pirate Ships"). Progress is aggregate and global. Rewards are distributed weekly based on the Faction's success.  
* **The SDI (Stellar Defense Initiative) (Home Security):** An interstellar alliance dedicated to the safety of developed systems (akin to Concord).  
  * *Security Contracts:* Daily PvE quests issued to the player (e.g., "Eliminate Pirate Scouts," "Rescue Diplomatic Shuttle," "Scan Anomalies").  
  * *Rewards:* Completing contracts grants **Concordat Commendations**, used to purchase defensive orbital platforms, safe-logistics ships, or hire temporary AI wingmen.

### **3.3 No Fleet Saving**

* Mechanic: Ships docked at the Home System are safe from other players. There is no need to fly them away to "save" them.  
* Risk: The risk is entirely contained within the OGate instances.

## **4\. The OGate Mechanics (The USP)**

### **4.1 The Capacitor System**

The OGate requires a **Capacitor** to fire. The Capacitor determines the instance generation parameters and the **Mass Transmission Budget**.

* **1MW Capacitor:** Spawns a small, low-reward stable pocket. Low PvP chance. Low Mass Budget (Light ships only).  
* **1GW Capacitor:** Spawns a massive system. High-tier resources (Nanites, Exotic Matter). High PvP probability. High Mass Budget (Cruisers/Capitals).  
* **Void Capacitor (Endgame / Phase 2):** Spawns access to **Persistent Wormhole Space**. These systems do not collapse and allow for player-owned outposts and Corporations. *Note: High-level strategic content, not part of the early game loop.*

### **4.2 Instance Topology & Population Logic**

* **Shape:** Circular map bounded by an "Event Horizon" (lethal damage zone).  
* **System View (The Dashboard):**  
  * **Abstract UI:** Players do not pilot ships in a 3D or 2D flight sim. The "System View" is a tactical dashboard (a "pretty picture" backdrop with overlay UI).  
  * **The List:** Locations (Planets, Belts, Gas Clouds) and detected Signals are displayed as selectable nodes or a list.  
  * **Visibility:** Static geography is always visible in the list. Dynamic content (fleets, yields) requires scanning.  
* **Spawning:** Each player has a unique entry/exit coordinate.  
* **Instance Selection (Random & Region-Locked):**  
  * **No Intentional Grouping:** Players cannot choose to join the same instance as a friend. Matchmaking is entirely randomized.  
  * **Region Locking:** Instances are clustered geographically (server-side) to minimize latency.  
  * **Faction Agnostic:** Faction alignment has zero influence on which instance a player is assigned to.  
  * **Selection Logic:** By default, engaging the OGate has a **50% chance** to create a brand new instance and a **50% chance** to join an existing, non-full instance.  
  * **Modifiers:** Players can craft/buy Capacitor Modifiers to skew this (e.g., *Isolation Modifier* \= 100% New Instance; *Hunter Modifier* \= 100% Join Existing).  
* **Player Caps & Enforcement:**  
  * **Limits:** Small Capacitors (\~4 players), Large Capacitors (\~16 players).  
  * **Pre-Entry Check:** The cap is enforced *before* the ship enters. A player cannot "spike" the Entropy of a full instance.  
  * **Overflow Fallback (Race Condition Handling):** If latency causes two players to attempt to fill the final slot simultaneously, the matchmaking server resolves the conflict by pushing the "excess" player into a brand new, empty instance. This ensures the jump never fails due to a full lobby.

### **4.3 Entropy: The Elastic Limit (Shared Budget)**

The OGate does not have a fixed timer. Instead, it has a **Shared Public Stability Budget** known as **Entropy**. Every player in the instance consumes from the same pool.

* **The Shared Pool:**  
  * Tension is maximized because Player A's actions directly shorten Player B's time window. If a rival fleet enters and starts a massive battle, *your* extraction window might collapse in minutes.  
  * This creates a "Tragedy of the Commons" dynamic—griefers can burn the house down, but organized groups can police the instance to keep it stable.  
* **Instance Lifecycle & State Machine:**  
  * **Spawn:** An instance is created when a player activates an OGate and the system determines a new instance is needed (50% chance or fallback).  
  * **Active Decay (Occupied):** Standard decay rules apply based on player count and actions.  
  * **Passive Decay (Empty):** When **0 players** are present, Entropy decays at a fixed rate of **0.1% per second** (6% per minute).  
  * **The 33% Floor:** If an *empty* instance drops below **33% Entropy**, it is flagged as "Collapsed/Unstable." No new players can spawn into it. It is then despawned.  
  * **Total Collapse:** If a *non-empty* instance drops to **0% Entropy**, the event horizon collapses. All assets inside are wiped. The instance is then despawned.  
  * **Re-Entry:** Players activating an OGate can join an existing instance (even one with 0 players) provided its Entropy is above 33% and it is not at the player cap.  
* **The UI (Early Warning System):**  
  * **Entropy Gauge:** Visible to all. A diegetic waveform on the HUD.  
  * **Entropy Ripples:** Actions (shooting, mining, entering) create visible "ripples" in the signal. Skilled players can read these ripples to detect other players without seeing them on radar.  
  * **Exiting:** Leaving the wormhole *does not* restore Entropy. It simply creates an exit ripple.  
* **Session Commitment (Frictionless Play):**  
  * **No Cooldowns:** There is **zero cooldown** between OGate activations.  
  * **No Minimum:** There is **no minimum time commitment**. A player can jump in, scan for 30 seconds, see nothing, and leave immediately without penalty (other than the consumed Capacitor).  
  * **Engagement:** The game does *not* discourage "poke and leave" gameplay. Frequent, short sessions are a core design pillar.

### **4.4 PvP Dynamics: The Hunter & The Hunted**

* **Visibility (System vs. Local):**  
  * **System Visibility:** On the tactical map, **Players are hidden** by default. They generate ripples but are not visible nodes until scanned.  
  * **Local Visibility:** If two fleets occupy the same Node (Coordinate/Planet), they are **automatically and instantly visible** to each other. There is no stealth once you are "on grid" with another player.  
  * **The Challenge:** The skill is in *finding* the enemy (scanning/hunting) or *avoiding* them (managing entropy ripples). Once you are at the same location, the engagement is straightforward.  
* **Passive Detection:** Players can see Planets and POIs.  
* **Active Detection (Graviton Scanning):**  
  * **Scanner Pulse:** A manual scan action takes approx. **5 seconds** to complete. It costs no resources/entropy.  
  * **Detection Logic:** A successful scan reveals "Activity of Interest" markers at specific coordinates. It displays **Ripple Magnitude** (size) and **Threat Assessment** (danger level), but *not* specific ship types or counts.  
  * **Warp Solution:** A completed scan allows the player to initiate a direct warp to the detected coordinates.  
* **The Collimation Mini-Game (Resolution vs. Stealth):**  
  * **Mass Inverse:** Large fleets (High Mass/Ripple) are easy to lock. A single scan provides a 100% Warp Solution immediately.  
  * **Small Targets:** Small ships (Low Mass/Ripple) appear as "fuzzy" signals. The scanner cannot lock a Warp Solution in one pass.  
  * **Pinging:** The hunter must "Ping" the location multiple times to collimate the signal and get a lock.  
  * **The Risk (Alerts):** **Every single Ping sends an alert to the target player.**  
    * *Scenario:* Hunting a battleship? One scan, no warning, warp in.  
    * *Scenario:* Hunting a stealth corvette? You might need 3 pings. The corvette gets 3 warning alerts ("Active Scan Detected\!") giving them precious seconds to move or cloak before you can jump.  
* **Engagement (Forced Combat):**  
  * **Targeting:** Once a player arrives at a location and detects another fleet (Local Visibility), they can choose to **Lock and Engage**.  
  * **No Refusal:** The target **cannot decline** the fight. If the attacker initiates combat, both players are immediately pulled into the Combat Resolution Screen.  
  * **Defense:** The only defense is to warp away *during the warning window* before the attacker arrives and locks on.  
  * **Deliberate Action:** Combat is **never** automatic. Simply sitting on a node with another player does not trigger a fight. A player must press the **Attack** button to transition from "Co-Location" to "Combat."  
* **The Proximity Alert (Detection Horizon):**  
  * **Concept:** A dynamic early-warning system that triggers when an incoming ship breaches the "Safety Perimeter."  
  * **Base Window:** By default, the alert sounds when an incoming ship is **20 seconds** from impact.  
  * **Mass Modifier (Size Matters):** Larger ships are detected earlier.  
    * *Massive Ship (Capital):* May trigger detection at 40-50 seconds out.  
    * *Tiny Ship (Interceptor):* May trigger detection at the base 20 seconds (or less if using specialized stealth tech).  
  * **Skill Interaction:** Players can extend their own Detection Horizon via skills (*Sensor Analysis*) and modules (*Long-Range Arrays*), buying precious extra seconds.  
  * **The Detection Sequence:**  
    1. **Visual Ripple:** A visual pulse appears on the Entropy Gauge immediately when the enemy initiates warp (e.g., 2 minutes out). An attentive player sees this first.  
    2. **Silence:** The enemy is in transit. No UI alerts.  
    3. **Proximity Alert:** The enemy breaches the Detection Horizon (e.g., 20s out). The UI flashes red and an alarm sounds.  
    4. **Impact:** Enemy lands on grid. Local Visibility engages.  
* **Combat Model (Automated Resolution):**  
  * **Philosophy:** OGame-style simulation, not Twitch-reflex arcade.  
  * **Mechanic:** When fleets engage, the battle is resolved automatically based on Fleet Composition, Tech Levels, and Module Loadouts.  
  * **Visualization:** The game renders a high-fidelity 2D visualization of the battle (using AI-generated assets) showing the rounds of fire, shield impacts, and hull breaches. This allows players to see *why* they won or lost.  
  * **Tactical Input:** Players set "Rules of Engagement" or "Stance" before battle (e.g., "Focus Fire," "Protect Haulers"), but once shots are fired, the math takes over.

### **4.5 Emergent Fleet Strategies (Sandbox)**

**There are no fixed classes or archetypes in OGate.** Players have absolute freedom to mix and match hulls, modules, and Specialists.  
The core limiting factor is **Entropy**. Every ship adds Mass, and every Mass unit reduces the time the wormhole stays open. Players must balance **Firepower vs. Time**.

* **Example A: High-Mass Dominance**  
  * *Concept:* A player brings heavy Battleships and Cruisers.  
  * *Trade-off:* The wormhole will be 50% destabilized upon entry. The fleet has immense combat power to secure the area, but must extract quickly (e.g., within 5 minutes).  
* **Example B: Low-Mass Precision**  
  * *Concept:* A player brings only Stealth Corvettes and Hackers.  
  * *Trade-off:* The wormhole remains stable for a long duration (e.g., 20 minutes), allowing for deep exploration and questing. However, they cannot win a straight fight against heavier ships.  
* **Example C: Asymmetric Warfare**  
  * *Concept:* A mixed fleet of "Glass Cannon" Interceptors and Electronic Warfare Frigates.  
  * *Trade-off:* Designed to hunt High-Mass fleets by stalling them or spiking their Entropy to force a collapse panic.

### **4.6 Exfiltration Sequence (The Way Out)**

Leaving the wormhole is not instant or automatic upon arrival. It is a deliberate action.

* **The Exit Frame (Node):**  
  * The player's entry/exit point is a specific node in space called the **Exit Frame**.  
  * Like any other node, it can be scanned, camped, and occupied by any number of players.  
  * **Harmonic Hum:** The Exit Frame emits a faint, continuous Entropy signal, making it discoverable by players with high-level scanning tech.  
* **Activation & Spool-Up:**  
  * **Manual Trigger:** The player must press the **"Open OGate Connection"** button to leave.  
  * **Mass-Based Delay:** The "Spool-Up" time is determined by the total mass of the fleet.  
    * *Light Fleet:* Fast exit (e.g., 3 seconds).  
    * *Heavy Fleet:* Slow exit (e.g., 10 seconds).  
  * **Skill Mitigation:** High-level *Wormhole Navigation* skills reduce this spool-up time.  
* **Interruption:**  
  * If a player enters combat (is engaged by an enemy) during the Spool-Up, the exit is **cancelled immediately** and combat ensues.  
* **The Grace Rule (Magnanimous Exit):**  
  * If a player successfully initiates the exit sequence (presses the button) *before* Entropy hits 100%, the exit is guaranteed to complete, even if the wormhole collapses during the Spool-Up animation.

## **5\. Units & Specialists**

### **5.1 Ship Classes & Mass Constraints**

**Mass Budget:** Every Capacitor tier has a strict Mass Limit. Players cannot just bring everything; they must fit their fleet into the pipe.

* **Mass Calculation Rule:**  
  * **Mass \=** (Sum of Ship Hulls) \+ (Sum of Fighters) \+ (Total Cargo).  
  * **Weightless:** Modules and Specialists do not count toward Mass.  
  * **Entry Denial:** A player cannot enter an instance if their fleet's mass would reduce the current Entropy below **25%**. (e.g., If an instance is at 30%, you can only bring mass worth 5% Entropy damage).  
* **Probes (Scouts):** High speed, essential for checking safety.  
  * *The Trade-off:* Advanced **Graviton Scanners** (needed to see detailed resource/quest info) are extremely heavy. Fitting a scanner consumes a huge portion of the Mass Budget, meaning you often cannot bring a heavy combat ship *and* a high-end scout simultaneously. Scouting is a cost.  
* **Fighters:** Very small, single-seat craft.  
  * *Restriction:* Sublight only; cannot use the OGate independently. Must be carried by a Backbone or Capital Ship.  
  * *Role:* Harassment. High evasion allows them to dodge most heavy munitions, but they are shredded by Point Defense systems.  
* **Haulers:** High cargo, weak defense. Designed purely for logistics, they rely on Industrial Barges or other ships to fill their holds.  
* **Industrial Barges (Modular Platforms):** The workhorses of the extraction economy.  
  * *Philosophy:* Versatile hulls that adapt to the resource node via expensive subsystems.  
  * *Modules:*  
    * **Deep Core Lasers:** Optimized for high-yield Ore extraction.  
    * **Bio-Scythe Arrays:** Specialized for Biomass harvesting without damaging the ecosystem.  
    * **Nebulite Scoops:** Required to harvest gas from volatile clouds.  
    * **Compression Core:** Sacrifices extraction hardpoints to compress raw resources in the hold. This allows nearby Haulers to transport 10x the volume, creating a "Fleet Logistics" role where one ship mines and another compresses/hauls.  
* **Interceptors:** Fast attack, good for catching Haulers.  
* **Backbones (Light Carriers):** Early-game support ships roughly the size of an Interceptor.  
  * *Role:* Acts as a "mini-carrier" capable of transporting a squadron of \~12 Fighters through the OGate.  
  * *Weakness:* Completely defenseless (no hardpoints) and fragile. Relies entirely on its fighter screen for protection.  
* **Cruisers:** The versatile backbone of any fleet.  
  * *Role:* Multirole platforms that balance armor, firepower, and speed. Can be fitted for almost any task (combat, scanning, light transport).  
  * *Trade-off:* Jack-of-all-trades, master of none. A specialized ship will always outclass a Cruiser in its specific domain.  
* **Capital Ships:** Massive hulls requiring **Fusion Reactors** for sublight propulsion.  
  * *Role:* Massive force projection and Fighter Carriers. Can launch hundreds of fighters to swarm enemies.  
  * *Restriction:* Cannot jump without active Nebulite fuel in the hold.  
* **Strategic Lancers (Modular Platforms):** Highly advanced, expensive hulls that act as blank slates for specialized "Subsystem Modules."  
  * *Philosophy:* The hull is moderately expensive, but the **Modules** are incredibly expensive and define the ship's identity.  
  * *Versatility:* Allows players to radically mix and match playstyles. A single ship can be refitted for entirely different roles.  
  * *Command Modules:* One of many module types. Provides enhanced fleet-wide bonuses or superior Entropy Intelligence (e.g., clearer ripple signals), but does *not* weaponize or magically manipulate Entropy. It is a clean signal tool.  
  * *Other Loadouts:*  
    * **Fusion Lance:** Devastating DPS.  
    * **EW Suite:** Jams enemy sensors.  
    * **Logistics Array:** Long-range tractor beams for looting or shield repair.  
    * **Missile Batteries:** High-volume bombardment.  
  * *Impact:* Can single-handedly turn the tide of battle, but losing one is a catastrophic economic event.

### **5.2 Expeditionary Contingents (The RPG Layer)**

Ships do not just carry crew; they carry specialized **Military & Science Contingents** for ground operations, boarding actions, and hazardous exploration.

* **Structure:**  
  * **Unit Strength (HP):** Each Contingent is a specific squad (e.g., "52nd Void Engineers," "3rd Recon Platoon"). Their "Health" is simply the number of active troops remaining in the unit.  
  * **Attrition:** Hazards and combat kill troops. A unit at 50% strength works 50% slower and fights with 50% effectiveness.  
  * **Replenishment:** Squads do not heal automatically. They must be reinforced/recruited back to full strength at the Home System Barracks.  
* **Types:**  
  * *Marine Detachment:* Required for boarding enemy ships, repelling boarders, or raiding planetary outposts.  
  * *Engineering Corps:* Specialized in salvaging heavy wreckage, conducting emergency hull repairs mid-combat, and stabilizing volatile OGate artifacts.  
  * *Research Team:* The only units capable of entering hazardous derelicts or analyzing ancient ruins without triggering fatal traps.  
* **Perma-Death:**  
  * If a ship is destroyed, all embarked Contingents are lost.  
  * If a Contingent reaches 0 Strength (all troops killed) during a mission, the unit is wiped out, and its accumulated XP/Veterancy is lost forever.

### **5.3 Loss Mitigation: The Transponder System**

To balance the hardcore nature of the game, OGate implements a tiered safety system. This preserves tension (Cargo/Time Loss) while preventing catastrophic progression wipes (Permanent Hull Loss) during routine play.

* **Activation Triggers (The "Eject" Criteria):**  
  An escape is triggered automatically by the system or manually by the player when:  
  1. **Wormhole Collapse:** Entropy reaches 100% while the ship is inside.  
  2. **Critical Integrity:** Ship Hull reaches 0 HP in combat.  
  3. **Manual Activation:** Player hits the "Emergency Warp" button (panic button) or disconnects/goes inactive for a set duration.  
  4. **Timeout:** Player is disconnected or AFK for more than **10 minutes**.  
* **The Mechanic (Portable Exit):**  
  * The Emergency Warp essentially creates a **Personal Exit Frame** at the ship's current location.  
  * It adheres to all standard Exfiltration rules: It has a **Spool-Up Time** based on mass, and it is **Cancelled** if combat is initiated during the spool-up.  
* **The Cost of Exit (Fair Play Mechanics):**  
  * **Zero-Entropy Event:** Transponder activation uses the ship's internal capacitor and the Transponder's own fuel. It **DOES NOT** add Entropy to the shared instance (it does not punish others for your escape).  
  * **Link Severed:** Upon activation, the player's personal OGate connection is immediately shut down.  
  * **Capacitor Consumed:** The OGate Capacitor used to open the session is lost. To return, the player must craft/buy a new Capacitor.  
* **What Escapes (The Cost of Survival):**  
  * **Ship Hull:** **RNG STRUCTURAL DAMAGE.** Each ship in the fleet rolls for **0%, 25%, 50%, or 100% structural damage**. 100% damage renders the ship a "Wreck" that requires extensive/expensive reconstruction at the Shipyard (but the hull asset is not deleted).  
  * **Modules:** **RNG DAMAGE.** High-tier modules may be burned out or broken. Every module rolls for **0%, 25%, 50%, or 100% damage**, requiring repair resources and time at the Home System.  
  * **Specialists/Contingents:** **RNG INJURY.** Troops survive but with severe injuries. Like modules, squads roll for **0-100% casualty rates**. They cannot be deployed until healed/replenished at the Barracks.  
  * **Cargo:** **LOST.** The emergency warp dumps all mass to calculate the jump. All Ore, Biomass, and Loot is ejected into the void.  
* **Skill Interaction:**  
  * High levels in *Wormhole Physics* and *Engineering* reduce the severity of module damage and Specialist injury time, allowing veterans to bounce back from defeat faster.  
* **Standard vs. Emergency:**  
  * *Standard Transponders:* Auto-equipped on light ships (Probes/Interceptors). Unlimited use.  
  * *Emergency Transponders:* Consumable item for Heavy Assets (Cruisers/Capitals). Burns out on use and must be replaced.  
* **No Safety for Glory:** Strategic Lancers and Void-Capacitor runs may have "Jamming Conditions" that disable all transponders, forcing true permadeath for specific high-end content.

## **6\. Narrative & Quests (AI Generated)**

Instead of static text, OGate uses LLMs to generate "Derelict Logs."

* **The Radar Station:** A POI found in instances.  
* **Interaction:** Requires a Specialist (e.g., Data Analyst).  
* **Output:** Gives coordinates to a specific "Quest Instance."  
* **The Chain:** These quests span multiple OGate jumps.  
  * *Step 1:* Find the encrypted drive.  
  * *Step 2:* Craft a "Decryption Capacitor" (Requires resources).  
  * *Step 3:* Use Capacitor to open a specific story instance to find the "Lost Flagship."

### **6.2 Explorer Storylines (Paid Narrative — Key Monetization)**

A simplified, Land-of-Livia–style layer: the player dispatches a single **Explorer** through the OGate to follow a **paid storyline**. Progress is asynchronous (time-based and/or light check-ins); the Explorer is not in the same instances as the player's fleet.

* **One at a time:** Only one storyline can be active per account. Completing or abandoning it frees the slot.
* **Purchase:** Each storyline is a **one-time IAP** (~$2–3). No loot boxes; no pay-to-win.
* **Rewards:** Unlocks **storyline-exclusive cosmetics** (skins, decals, home backgrounds), **upgrades** (e.g. blueprints, small permanent bonuses), and narrative beats.
* **Return:** On completion, the Explorer **returns through the OGate in a unique ship** — a hull (or unique skin) **only** obtainable from that storyline, added to the player's fleet.
* **Fiction:** The Explorer "enters" the OGate and follows a scripted arc; no PvP, no shared entropy. Full spec: *docs/11_explorer_storylines.md*.

## **7\. Progression System**

### **7.1 Time-Based Skill Training (Retention Hook)**

Progression is not based on XP or grinding actions, but on real-time **Skill Training Queues**.

* **The Mechanic:** Players select skills they wish to learn and add them to a training queue. Skills train passively in real-time, even when the player is offline.  
* **The Constraint:** The Skill Queue has a strict **24-hour limit**. Players must log in daily to replenish the queue with new skills. If the queue runs dry, training stops, and time is wasted.  
* **Strategic Choice:** Time is the most valuable resource. Players must decide what to prioritize in their limited queue:  
  * *Mining Proficiency:* Decreases cycle time of mining lasers.  
  * *Wormhole Physics:* Reduces the amount of Entropy a ship generates.  
  * *Fleet Command:* Increases the maximum number of ships controllable in a sortie.

### **7.2 Research Branches**

Research is divided into four distinct disciplines, each with its own progression tree.

1. **Home System Research (Economy & Infrastructure):**  
   * *Focus:* Maximizing the efficiency and output of the Safe Zone.  
   * *Examples:* Solar Efficiency, Bio-Combustion Output, Refinery Yields, Diplomatic Protocols (Improves Faction Standing gains), Automated Defense Grids.  
2. **Blueprint Research (The Armory):**  
   * *Focus:* Unlocking new Hulls and Contingent types.  
   * *Examples:* Cruiser Hulls, Strategic Lancer Chassis, Marine Detachment Training, Fighter Squadron Protocols.  
3. **Tech Center (Modules & Materials):**  
   * *Focus:* Upgrading ship equipment and processing exotic materials.  
   * *Examples:* Fusion Containment (Reactors/Lances), Deep Core Mining Lasers, Polymer Synthesis (Advanced Alloys), Shield Harmonics, Compression Technology.  
4. **OGate Inc. (Wormhole Science):**  
   * *Focus:* Mastery of the OGate mechanism itself.  
   * *Examples:* Capacitor Science (Unlocks 1GW+ tiers), Entropy Shielding (Reduces Rift instability), Jump Calculation Speed (Faster entry/exit), Anomaly Scanning (Better radar resolution).

### **7.3 Advanced Progression (High-End Economy)**

* **Nanites (The Forbidden Tech):**  
  * *Lore:* Forbidden technology from the Previous Era.  
  * *Mechanic:* Required to attach powerful **Cybernetic Enhancements** to the player character (providing global bonuses to skills).  
  * *Economy:* Nanites **CANNOT BE BOUGHT** with real money or premium currency. They must be extracted from high-risk OGate instances. This forces "Whales" to play the game or trade with high-skill players.  
* **Precursor Artifacts (The Prestige Economy):**  
  * *Mechanic:* Rare, non-functional relics found in Deep Space.  
  * *The Trader:* A unique NPC in the Home System accepts Artifacts in exchange for **Exclusive Skins** and **Visual Customizations**.  
  * *Exclusivity:* These cosmetics are unavailable in the cash shop. Seeing a player with a "Void-Touched" hull skin proves they survived deep space, not that they opened their wallet.

## **8\. Technical Architecture**

### **8.1 Stack**

* **Frontend:** Phaser (JS/TS) for 2D rendering. Optimized for mobile touch (pinch zoom, tap to move).  
* **Backend:** Colyseus (Node.js) for authoritative state management of instances.  
* **Database:** MongoDB (Player profiles) \+ Redis (Live instance state).  
* **AI Engine:** \* *Art:* Stable Diffusion / Midjourney pipeline for assets.  
  * *Code:* Cursor/Claude for rapid iteration.  
  * *Narrative:* OpenAI API / Claude API for generating Derelict logs and quest text on the fly.

### **8.2 Mobile-First Design Philosophy**

* **Midcore Focus:** The UI and session flow are optimized for the modern mobile player who wants depth, not clutter.  
* **Portrait Mode:** The entire game is playable in one-handed Portrait Mode — both the Home System (Section 3\) and OGate instances (Section 4\). No rotation; UI is button-driven (OGame-style).  
* **Notifications:** Strategic push notifications (e.g., "Skill Queue Empty," "Trade Deal Expiring") drive the short-session loop.

## **9\. Monetization Strategy (Fair F2P)**

**Philosophy:** Pay for Variety and Convenience, not Win-State.

1. **Capacitor Packs:**  
   * Players can craft Capacitors slowly.  
   * Players can buy "Experimental Capacitors" (Premium currency) that guarantee specific biome types (e.g., "Ice Field" or "Ship Graveyard").  
2. **Emergency Transponders (Consumable):**  
   * A high-value consumable item that provides **one-time insurance** for Heavy Assets (Cruisers/Capitals). If the ship is destroyed, the transponder burns out and returns the hull to the Home System (Cargo is still lost).  
3. **Specialist Headhunting:**  
   * Pay to refresh the Specialist recruitment pool instantly.  
   * Pay for "Clone Insurance" (Save a Specialist's XP after death).  
4. **Cosmetics:**  
   * AI-generated custom ship skins.  
   * Home system background skins.  
5. **Speed-Ups:**  
   * **Warp Drive Overclockers:** Reduce travel time within the OGate instance (e.g., jump takes 1 minute instead of 5).  
   * Reduce research or construction time in Home System.  
6. **Cybernetic Modules:**  
   * Players can buy basic Cybernetic Modules (stat boosters). However, **attaching** them requires **Nanites**, which cannot be bought.
7. **Explorer Storylines (Key Monetization):**  
   * **Product:** One-time IAP per storyline (~$2–3). Player dispatches a single Explorer through the OGate on a scripted narrative; only one storyline active at a time.  
   * **Rewards:** Exclusive cosmetics, upgrades, and — on completion — the Explorer returns in a **unique ship** (hull/skin only from that storyline).  
   * **Design:** Asynchronous progress (time + optional check-ins); no PvP, no instance overlap. See *docs/11_explorer_storylines.md*.

## **10\. Art & Audio Direction**

* **Visuals:** Deep space, high contrast. Neon engine trails against void black.  
* **UI:** Diegetic. It should look like a ship's tactical display (Holographic blues, warning reds).  
* **Audio:** Minimalist ambient drone (EVE style). Intense crescendo when Entropy \> 80%.