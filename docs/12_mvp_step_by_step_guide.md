# OGate MVP Step-by-Step Build Guide

This guide walks you from repository setup to a playable MVP using what already exists in this codebase, with placeholders where art/content is still missing.

It is intentionally practical: each phase has **goal**, **actions**, and **done criteria** so you can execute in order and avoid scope drift.

---

## 0) What "MVP" Means for This Repository

For OGate, MVP should prove the core dual-session loop described in `docs/01_core_loops.md` and implemented in `packages/client` + `packages/server`:

- Home loop: collect resources, upgrade buildings, queue skills, build ships.
- OGate loop: enter instance, warp, scan, extract/loot, manage entropy pressure, exfiltrate or emergency warp.
- Mobile portrait UX baseline.
- Minimal art skin with existing assets + placeholders.

Out of MVP (defer):

- Void Capacitor / persistent wormhole space (`docs/03_ogate_mechanics.md`).
- Corps/outposts and phase-2 social depth (`docs/08_social_systems.md`).
- Full Explorer Storylines system (`docs/11_explorer_storylines.md`).
- Full economy/monetization catalog (`docs/09_economy_monetization.md`).

---

## 1) Preflight Setup

### Goal
Get the project running locally in a known-good state.

### Actions
1. Install prerequisites:
   - Node.js 20+
   - npm (comes with Node)
   - Optional: MongoDB + Redis (server falls back gracefully if unavailable, per `README.md`).
2. Install dependencies at repo root:
   - `npm install`
3. Verify monorepo scripts:
   - `npm run build`
4. Start development:
   - `npm run dev`
   - Or separately: `npm run dev:server` and `npm run dev:client`

### Done criteria
- Build succeeds for shared/server/client.
- Client opens in browser and connects to server.
- You can switch between Home and Instance flows without runtime crashes.

---

## 2) Lock MVP Scope Before Coding Further

### Goal
Freeze a realistic feature set so execution stays focused.

### Actions
1. Use docs as source hierarchy:
   - Canonical design: `docs/00_OGate Game Design Document.md`
   - Practical mechanics: `docs/01_core_loops.md`, `docs/02_home_system.md`, `docs/03_ogate_mechanics.md`, `docs/04_combat_and_detection.md`
2. Create a one-page scope note (keep in your task tracker) with:
   - In-scope player story:
     - "I can prep in Home, run one risky OGate sortie, and return progress."
   - In-scope systems:
     - Home economy basics
     - OGate node traversal + scan + extraction + exit
     - Entropy as shared tension mechanic
   - Out-of-scope systems:
     - Endgame, corp mechanics, paid storylines, deep cosmetics pipeline
3. Apply "one-loop test":
   - If a feature does not strengthen the first complete loop, postpone it.

### Done criteria
- Scope is written and shared with anyone touching the MVP.
- No new work starts unless it maps to the first complete loop.

---

## 3) Baseline the Current Implementation

### Goal
Know exactly what you already have, so you only build what is missing.

### Actions
1. Confirm current runtime surfaces:
   - Client scenes:
     - `packages/client/src/scenes/HomeScene.ts`
     - `packages/client/src/scenes/InstanceScene.ts`
   - Server rooms:
     - `packages/server/src/rooms/HomeRoom.ts`
     - `packages/server/src/rooms/OGateRoom.ts`
2. Validate the implemented action chain:
   - Home: collect, upgrade, queue skill, build ship.
   - OGate: join/create, warp, scan, loot/extract, exit, emergency warp.
3. Validate message contracts in shared package:
   - `packages/shared/src/messages.ts`
   - `packages/shared/src/homeMessages.ts`
4. List known gaps as explicit TODOs:
   - Placeholder visual styling.
   - Art integration into Phaser preload/render pipelines.
   - Better UX feedback polish and edge-case messaging.

### Done criteria
- You have a "current-state checklist" with pass/fail for each core action.
- Every missing piece is either an MVP TODO or explicitly deferred.

---

## 4) Art Strategy for MVP (Existing + Placeholder)

### Goal
Ship a coherent visual baseline now, without waiting on full art production.

### Use what already exists
- Existing backdrops in `assets/backdrops`:
  - `bg_home_sanctuary.png`
  - `bg_instance_asteroid_belt.png`
  - `bg_instance_gas_corridor.png`
  - `bg_instance_ship_graveyard.png`
- Existing UI elements in `assets/ui`:
  - `panel_primary.png`
  - `btn_primary_idle.png`
  - `btn_primary_pressed.png`
- Art direction source:
  - `art_director.md`
  - `packages/client/src/assets/ART_BASELINE.md`

### Actions
1. Mirror or move MVP art into client asset tree (recommended):
   - `packages/client/src/assets/backdrops/`
   - `packages/client/src/assets/ui/`
   - Add missing folders now:
     - `packages/client/src/assets/icons/`
     - `packages/client/src/assets/fx/`
     - `packages/client/src/assets/ships/`
     - `packages/client/src/assets/pois/`
2. For missing assets, use temporary placeholders with final filenames from `ART_BASELINE.md`.
   - Keep naming stable so code does not change later when art is replaced.
3. Keep style coherence using `art_director.md`:
   - Deep navy background bias
   - Phosphor-green UI language
   - Subtle glow only, no flashy neon overload
4. Create a small asset manifest (`json` or `ts`) mapping logical ids to files.

### Done criteria
- Client-local asset folders exist and are referenced by the game.
- Missing art uses placeholder files with final names.
- Visual language is consistent enough to look intentional.

---

## 5) Integrate Assets into Phaser Scenes

### Goal
Replace "rectangle-only" presentation with the MVP art baseline.

### Actions
1. Add preload hooks in both scenes (or shared preload scene):
   - Home background and panel/button textures.
   - Instance backgrounds and shared panel/button textures.
   - Node/action icons where available.
2. Update Home scene (`HomeScene.ts`):
   - Replace full-screen rectangle with backdrop image.
   - Replace tab/button rectangles with textured UI elements.
   - Keep text overlays clear and high-contrast.
3. Update Instance scene (`InstanceScene.ts`):
   - Replace background fill with selected instance backdrop.
   - Add iconography for node types instead of color-only dots where possible.
   - Skin action buttons and entropy frame panel.
4. Guard for missing textures:
   - Fail gracefully to geometry/text fallback so development never blocks.

### Done criteria
- Home and Instance scenes render with art assets when present.
- If an asset is missing, scene still functions with fallback visuals.
- No console spam from missing texture keys during normal run.

---

## 6) Close Gameplay/UX Gaps for MVP Readiness

### Goal
Ensure the main loop feels complete and understandable for first-time users.

### Actions
1. Home UX pass:
   - Improve status messaging for action results/errors.
   - Ensure all key actions are reachable with clear labels.
2. Instance UX pass:
   - Clarify player state (idle/warping/scanning/spooling).
   - Make entropy state transitions obvious (safe/caution/critical).
   - Ensure exit-frame requirement messaging is explicit.
3. Edge-case pass:
   - Handle disconnect/reconnect gracefully.
   - Verify behavior when server is unavailable.
   - Confirm no soft-locks after emergency warp or collapse.
4. Keep server-authoritative boundaries strict per `.cursorrules`.
   - Client should render/relay only; game rules remain server-side.

### Done criteria
- A new user can complete one full sortie without external explanation.
- Error states are understandable and recoverable.
- No client-authoritative gameplay logic leaks in.

---

## 7) Data, Persistence, and Runtime Modes

### Goal
Make MVP testable both locally and in a deploy-like configuration.

### Actions
1. Define two runtime profiles:
   - Local quick mode: in-memory fallback (fast iteration).
   - Persistent mode: Mongo + Redis connected.
2. Add or document environment variables in a `.env.example` (if missing).
3. Verify startup logs clearly report active data mode.
4. Smoke test both profiles:
   - Profile creation/join works
   - Home state updates
   - Instance state lifecycle works

### Done criteria
- You can run and demo MVP without external infra.
- You can also run with persistence when needed for longer testing.

---

## 8) QA Matrix for "MVP Complete"

### Goal
Use repeatable checks instead of intuition.

### Manual test checklist
1. Home economy:
   - Collect resources updates values.
   - Building upgrade starts/completes.
   - Skill queue starts/completes.
   - Ship build starts/completes.
2. OGate flow:
   - Activate OGate from Home.
   - Warp between nodes.
   - Scan returns results and alerts others (multi-client test when possible).
   - Extract/loot updates cargo and node depletion.
   - Exit spooling works only at Exit Frame.
   - Emergency warp resolves and returns to Home.
3. Entropy lifecycle:
   - Entropy decreases over time/actions.
   - Critical thresholds are visible.
   - Collapse flow returns player cleanly.
4. Visual baseline:
   - Backdrops and primary UI assets render correctly.
   - Placeholder assets look coherent (not random mixed styles).
5. Stability:
   - 20-30 minute continuous run without fatal errors.

### Done criteria
- All critical-path tests pass.
- Any non-blocking issues are logged with explicit "post-MVP" tags.

---

## 9) Performance and Mobile Practicalities

### Goal
Keep MVP playable on mobile-oriented constraints.

### Actions
1. Keep portrait design size (`480x800`) as current baseline in `packages/client/src/main.ts`.
2. Optimize image sizes:
   - Backdrops to compressed `.webp` for runtime where possible.
   - PNG for UI/icons with alpha.
3. Watch bundle size warnings from Vite and defer heavy optimization unless blocking.
4. Test touch ergonomics:
   - Button hit areas
   - Text legibility
   - No critical controls near browser UI collision zones

### Done criteria
- MVP remains responsive on typical mobile viewport emulation.
- Asset memory footprint is controlled enough for stable sessions.

---

## 10) MVP Packaging and Handoff

### Goal
Deliver a build that can be demoed, tested, and iterated safely.

### Actions
1. Final build:
   - `npm run build`
2. Prepare a short demo script:
   - Home prep -> activate OGate -> scan/loot -> exfiltrate -> back to Home
3. Write `MVP Known Limitations` note:
   - Explicitly list deferred features from phase-2 docs.
4. Tag release branch or milestone in your tracker.
5. Capture next-priority backlog:
   - Social depth
   - Storyline system
   - Expanded art pack
   - Monetization hooks

### Done criteria
- Build artifact is reproducible.
- Anyone on the team can run the same demo loop locally.
- Deferred work is visible and separated from MVP completion.

---

## Suggested Execution Order (Fastest Path)

1. Preflight + build verification  
2. Scope lock  
3. Asset foldering + placeholders with final names  
4. Scene skinning (Home first, Instance second)  
5. UX/state polish on core loop  
6. QA checklist pass  
7. Packaging + handoff notes

If you follow this order, you get "playable and presentable" quickly, then improve depth without destabilizing the core loop.

---

## Appendix A: Command Quick Reference

From repository root:

- Install: `npm install`
- Dev both: `npm run dev`
- Dev server only: `npm run dev:server`
- Dev client only: `npm run dev:client`
- Build all: `npm run build`

---

## Appendix B: MVP Acceptance Gate (One-Line)

You are MVP-complete when a new tester can, in one uninterrupted session, **prepare in Home, run one OGate extraction with entropy pressure, return safely (or fail meaningfully), and understand what happened from the UI without designer narration**.

