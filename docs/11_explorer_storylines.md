# Explorer Storylines (Land-of-Livia–Style Monetization)

This document defines the **Explorer Storylines** feature: a simplified, asynchronous narrative layer where the player sends a single **Explorer** through the OGate to follow a paid storyline. The Explorer returns with **exclusive cosmetics**, **upgrades**, and a **unique ship**. This is a **key monetization element** — each storyline is a low-cost IAP (~$2–3), and **only one storyline can be active at a time**.

**Design inspiration:** Land of Livia (idle story-driven progression, rewards over time, one active “journey” at a time). OGate adapts this into a “dispatch an Explorer through the OGate” fantasy that fits the wormhole fiction.

**Source of truth:** This doc expands on HLDD §6 (Narrative) and §9 (Monetization). It aligns with docs/09_economy_monetization.md and docs/07_progression.md.

---

## 1. Core Concept

- **Explorer:** A narrative entity (one per player) that can be “dispatched” through the OGate on a **Storyline**.
- **Storyline:** A purchased, scripted narrative arc. The Explorer follows it **asynchronously** (real time or accelerated ticks). The player does not pilot the Explorer inside an OGate instance; progress is tracked in the background (e.g. “Chapter 2 of 5,” with steps that complete over time or via light engagement).
- **One at a time:** A player may only have **one active Storyline** at a time. Completing (or abandoning) it frees the slot to start another.
- **Monetization:** Each Storyline is a **one-time IAP** (e.g. $1.99–$2.99). No subscription; no pay-to-skip for story progress (optional: small speed-up IAP can be considered later, but not required for MVP).

---

## 2. Player Flow

1. **Purchase:** Player buys a Storyline from the store (e.g. “The Frost Maw,” “Echoes of the First Jump”). Payment unlocks that Storyline for the account.
2. **Dispatch:** From the Home System (or a dedicated “Explorer Terminal” UI), the player assigns the Explorer to that Storyline. The Explorer “enters” the OGate and the story begins.
3. **Progress:** Story advances in steps (chapters/beats). Each step can:
   - **Time-gate:** e.g. “Step completes in 4 hours” (Land-of-Livia style).
   - **Light engagement:** e.g. “Check in once to confirm the Explorer’s report” (one tap).
   - **Optional:** Small resource or credit sink to “support” the Explorer (flavor only, or minor bonus).
4. **Rewards per step/chapter:** Unlock **cosmetics** (ship skins, decals, home background variants), **upgrades** (e.g. a one-time module blueprint, or a small permanent stat bonus), and narrative snippets (lore, logs).
5. **Return:** When the Storyline is **completed**, the Explorer **returns through the OGate** in a **unique ship** — a hull (or skin+ hull combo) that is **exclusive to that Storyline** and cannot be earned elsewhere. This ship is added to the player’s Home System fleet/dock.

---

## 3. Rewards (What the Explorer Brings Back)

| Reward type | Description | Example |
|-------------|-------------|--------|
| **Cosmetics** | Ship skins, decals, Home System background variants, possibly avatar/portrait pieces. | “Frost Maw” hull skin; “Echoes” station theme. |
| **Upgrades** | One-time blueprints, small permanent bonuses, or unique modules that are usable in the main game. | Blueprint: “Explorer’s Long-Range Array”; +5% scan range until end of campaign. |
| **Unique ship** | On storyline completion, the Explorer returns in a **unique ship** — a named hull (or named skin applied to an existing class) that is **only** obtainable via this Storyline. | “Frost Maw’s Return” (unique Interceptor); “Echo Runner” (unique Probe). |

All of the above are **exclusive to the paid Storyline**; they are not sold separately in the general cosmetics shop (though the same *system* of skins can be used for other cosmetics).

---

## 4. Constraints (Simplified Design)

- **One Explorer, one Storyline:** Only one Storyline can be in progress per account. Starting a new one requires completing or abandoning the current one.
- **No PvP / no instance:** The Explorer is not in the same OGate instances as the player’s fleet. No combat, no entropy, no other players. Purely narrative + timer/engagement.
- **Simplified progression:** No complex branching; linear or lightly branched (e.g. “Path A or B” at one beat). Focus on clear beats and predictable rewards to keep production and tuning manageable.
- **Clear completion:** Each Storyline has a defined end. At the end: Explorer returns, unique ship granted, storyline marked complete. Player can then buy and start another.

---

## 5. Monetization Summary

- **Product:** One Storyline = one IAP (~$2–3).
- **Volume:** Multiple Storylines over the game’s lifetime (seasonal, thematic, or permanent catalog).
- **Limit:** One active Storyline at a time → encourages finishing before buying the next, and avoids “idle overload.”
- **Placement:** Store section “Explorer Storylines” or “Expeditions”; can be surfaced from Home System (Explorer Terminal) and from the main menu.

---

## 6. Integration with Existing Systems

- **Narrative (HLDD §6):** Explorer Storylines are **separate** from the existing “Derelict Logs” / Radar Station / multi-jump quest chains. Those remain in-instance, AI-generated, and free. Explorer Storylines are **paid, scripted, and out-of-instance**.
- **Progression (HLDD §7):** Storyline rewards (blueprints, small bonuses, unique ship) feed into the same progression as Home System and OGate (e.g. ship appears in Shipyard/fleet list; skins in customization).
- **Economy (HLDD §9; docs/09_economy_monetization.md):** Explorer Storylines are a **discrete monetization pillar** alongside Capacitor Packs, Emergency Transponders, Specialist Headhunting, Cosmetics, Speed-Ups, and Cybernetic Modules. They do not replace those; they add a “story + collection” spend.

---

## 7. Optional Future Expansions (Out of Scope for MVP)

- **Speed-up IAP:** Pay to reduce time until next story step (optional; can be omitted to keep the product simple).
- **Branching choices:** Meaningful story choices that change which cosmetic or upgrade is granted (e.g. “Side with faction A → skin A; side with B → skin B”).
- **Explorer customization:** Name, portrait, or loadout that is purely cosmetic and shown in story UI.
- **Recurring “mini-stories”:** Short, cheap storylines (e.g. $0.99) that grant a single cosmetic or small upgrade without a unique ship.

---

## 8. Summary Table

| Aspect | Design choice |
|--------|----------------|
| **What** | Paid scripted storylines; one Explorer dispatched through the OGate. |
| **Progress** | Asynchronous (time + optional light engagement); one storyline active at a time. |
| **Rewards** | Cosmetics, upgrades, and a **unique ship** on completion. |
| **Price** | ~$2–3 per storyline (one-time IAP). |
| **Limit** | One active storyline per account. |
| **Fiction** | Explorer “goes through the OGate” and returns when the story is done. |
