# Technical & UX Guidelines

This document summarizes the **technical architecture** and **user experience** direction from the HLDD. It supports the **Dual-Session Economy** (Coffee Break vs. Deep Dive) described in **Core Design & Loops** (docs/01_core_loops.md).

---

## 1. Tech Stack (HLDD §8.1)

### Frontend

- **Phaser (JS/TS)** for **2D rendering**. Optimized for **mobile touch** (pinch zoom, tap to move) (HLDD §8.1).

### Backend

- **Colyseus (Node.js)** for **authoritative state management of instances** (HLDD §8.1).

### Database

- **MongoDB:** Player profiles (HLDD §8.1).
- **Redis:** Live instance state (HLDD §8.1).

### AI Engine (HLDD §8.1)

| Use | Tool / pipeline |
|-----|------------------|
| **Art** | Stable Diffusion / Midjourney pipeline for assets. |
| **Code** | Cursor/Claude for rapid iteration. |
| **Narrative** | OpenAI API / Claude API for generating Derelict logs and quest text on the fly. |

*Note:* The HLDD does not mention React or other UI frameworks; frontend is specified as Phaser for 2D rendering and mobile touch.

---

## 2. Mobile-First Design (HLDD §8.2)

- **Midcore focus:** The UI and session flow are optimized for the modern mobile player who wants **depth, not clutter** (HLDD §8.2).
- **Portrait mode:** The **Home System** (Section 3) is playable **in portrait mode** — both the **Home System** (Section 3) and **OGate instances** (Section 4). The UI is button-driven and OGame-style rather than a traditional graphics-heavy layout, so portrait is the primary and only orientation (HLDD §8.2; docs/01_core_loops.md).
- **Notifications:** **Strategic push notifications** (e.g. “Skill Queue Empty,” “Trade Deal Expiring”) drive the short-session loop (HLDD §8.2).

---

## 3. System View & UI Philosophy

Players **do not pilot** ships in a 3D or 2D flight sim. The **“System View”** in an OGate instance is a **tactical dashboard**: a **“pretty picture” backdrop** with **overlay UI**. Locations (planets, belts, gas clouds) and detected signals are shown as **selectable nodes or a list**. Static geography is always visible; dynamic content (fleets, yields) requires scanning (HLDD §4.2; docs/03_ogate_mechanics.md, docs/04_combat_and_detection.md).

### Diegetic UI (HLDD §10)

- The UI should look like a **ship’s tactical display** (e.g. **holographic blues, warning reds**) (HLDD §10).
- **Entropy Gauge:** **Visible to all.** A **diegetic waveform on the HUD** (HLDD §4.3). A visual pulse appears on it when an enemy initiates warp; the Proximity Alert (UI flashes red, alarm) triggers when the enemy breaches the Detection Horizon (HLDD §4.4; docs/04_combat_and_detection.md).

### Combat (Visualization, Not Twitch)

- Combat is **resolved automatically**; the game renders a **high-fidelity 2D visualization** (rounds of fire, shield impacts, hull breaches) so players can see *why* they won or lost (HLDD §4.4).
- **Tactical input:** Players set **Rules of Engagement** or **Stance** before battle (e.g. “Focus Fire,” “Protect Haulers”). Once shots are fired, the math takes over (HLDD §4.4; docs/04_combat_and_detection.md).

---

## 4. Art & Audio Direction (HLDD §10)

- **Visuals:** Deep space, high contrast. **Neon engine trails** against void black (HLDD §10).
- **UI:** Diegetic; ship’s tactical display (holographic blues, warning reds) (HLDD §10).
- **Audio:** **Minimalist ambient drone** (EVE style). **Intense crescendo when Entropy > 80%** (HLDD §10).
