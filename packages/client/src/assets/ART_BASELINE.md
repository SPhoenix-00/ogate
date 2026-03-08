# OGate Client — Minimum Art Baseline (Asset Plan + File Checklist)

This folder does not currently exist in the codebase; it’s being created to define a **minimum coherent art baseline** for the Phaser client (`HomeScene`, `InstanceScene`) without blocking gameplay iteration.

The client currently renders mostly with rectangles + text. This document defines the **smallest set of images** we should generate (Stable Diffusion-first) so scenes look intentional and consistent with `art_director.md`:
- **Deep navy space**
- **Phosphor green MIL-SPEC UI**
- **Subtle instrumentation glow only**
- **Hard-sci plausible, military-clean baseline**

---

## What “minimum baseline” means

When these assets exist, we can “skin”:
- The Home screen background + tab/buttons + resource strip
- The Instance screen background + entropy gauge + node list + action buttons
- Node types (planet/belt/gas/station/exit) using icons instead of colored dots
- A basic set of ship cards (or silhouettes) for fleet lists and future combat panels

This is intentionally **not** “full art production.” It’s the minimum to stop placeholder-feel.

---

## Folder layout (proposed)

Create and keep these subfolders:

- `ui/` — panels, frames, button states, overlays
- `icons/` — action + node + resources (transparent background)
- `backdrops/` — portrait backgrounds for Home + Instances
- `ships/` — ship card renders (consistent pseudo-camera) and/or silhouettes
- `fx/` — 2D VFX sprites (entropy ripple, scan ping, warp ripples)
- `pois/` — POI “card art” concepts (derelict, gateway, monolith, etc.)

---

## Naming conventions (do this or we’ll regret it)

- **Lower snake case**
- **Purpose-first names**
- **No faction decals/text baked into images**

Examples:
- `icons/icon_node_planet.png`
- `ui/panel_primary.png`
- `backdrops/bg_instance_asteroid_belt.webp`
- `ships/ship_card_cruiser.webp`

---

## Recommended formats + sizes (safe defaults)

These are defaults; we can change later, but start consistent:

- **Icons/UI**: `.png` (transparent), 256×256 for icons, 9-patch-like panels at 512×512 or 1024×1024
- **Backdrops**: `.webp` (lossy), 1536×2048 portrait (or 1024×1365 for faster iteration)
- **Ship cards**: `.webp`, 1024×1024 square
- **FX**: `.png` (transparent), 512×512 or sprite sheets later

If you generate at higher res, downscale once and keep originals outside the repo.

---

## Minimum asset checklist (v0 “looks real” baseline)

### Backdrops (4 files)
- `backdrops/bg_home_sanctuary.webp`
- `backdrops/bg_instance_asteroid_belt.webp`
- `backdrops/bg_instance_gas_corridor.webp`
- `backdrops/bg_instance_ship_graveyard.webp`

**Direction**: deep navy, restrained, navigationally calm, minimal clutter.

### UI kit (8–12 files)
These replace rectangle-only UI with a coherent skin.

- **Panels / frames**
  - `ui/panel_primary.png` (general containers)
  - `ui/panel_secondary.png` (sub-panels / lists)
  - `ui/panel_warning.png` (alerts / critical states)
  - `ui/divider_h.png` (thin line)
  - `ui/divider_v.png` (thin line)
  - `ui/bracket_corner.png` (for targeting / callouts)

- **Buttons**
  - `ui/btn_primary_idle.png`
  - `ui/btn_primary_pressed.png`
  - `ui/btn_danger_idle.png`
  - `ui/btn_danger_pressed.png`

**Direction**: flat colors + thoughtful gradients + crisp borders; phosphor green accents; no glass/Aero.

### Icons (minimum set)

#### Node icons (5)
- `icons/icon_node_planet.png`
- `icons/icon_node_asteroid_belt.png`
- `icons/icon_node_gas_cloud.png`
- `icons/icon_node_station.png`
- `icons/icon_node_exit_frame.png`

#### Action icons (6)
- `icons/icon_action_warp.png`
- `icons/icon_action_scan.png`
- `icons/icon_action_loot.png`
- `icons/icon_action_attack.png`
- `icons/icon_action_exit.png`
- `icons/icon_action_emergency_warp.png`

#### Resource icons (5)
- `icons/icon_res_ore.png`
- `icons/icon_res_biomass.png`
- `icons/icon_res_energy.png`
- `icons/icon_res_nanites.png`
- `icons/icon_res_artifacts.png`

**Direction**: MIL-SPEC HUD iconography, consistent stroke/weight, phosphor green baseline; optional amber/red state variants later.

### Ships (7 ship cards OR silhouettes)
One per HLDD ship family (enough to populate fleet lists and early combat panels):
- `ships/ship_card_probe.webp`
- `ships/ship_card_interceptor.webp`
- `ships/ship_card_hauler.webp`
- `ships/ship_card_industrial_barge.webp`
- `ships/ship_card_backbone.webp`
- `ships/ship_card_cruiser.webp`
- `ships/ship_card_capital.webp`

**Camera lock** (must be consistent):
- 3/4 top-down
- same orientation (pick “nose up-right” and stick to it)
- single key + rim light, no colorful gels
- deep navy neutral background, no stars

### FX (4)
- `fx/fx_entropy_ripple.png`
- `fx/fx_entropy_ripple_critical.png`
- `fx/fx_scan_ping.png`
- `fx/fx_warp_ripple.png` (used for start/end; we can split later)

### POIs (3 hero concepts)
Start with the signature trio to set the tone:
- `pois/poi_derelict_capital.webp`
- `pois/poi_ancient_gateway_frame.webp`
- `pois/poi_praetorian_monolith_glyphs.webp`

Use the POI prompts in `d:\GitHub\ogate\art_director.md` (Section 13).

---

## Mapping to current scenes (what each scene needs)

### `HomeScene` (today: rectangles + text)
Minimum improvements once assets exist:
- Background: `bg_home_sanctuary`
- Panels: resource strip, tab bar, content list container, bottom bar
- Icons: ore/biomass/energy next to text values (optional but high leverage)
- Ship cards (later): shown next to each ship in the fleet list

### `InstanceScene` (today: dots + labels)
Minimum improvements once assets exist:
- Background: one of the instance backdrops
- Node icons: replace colored dots for node types
- UI kit: entropy gauge frame + action button skins + alert panel
- FX: scan ping + entropy ripple overlays

---

## Production sequence (fastest path to “not placeholder”)

1. **UI kit + icons** (biggest perceived quality jump; immediately skins both scenes)
2. **Backdrops** (stops “flat color” feel; keeps mood consistent)
3. **Node icons** (replaces rainbow dots; improves scan/map readability)
4. **Ship cards/silhouettes** (enables fleet visuals and future combat vignettes)
5. **FX** (makes OGate feel systemic: scan/entropy/warp)
6. **POI hero cards** (sets tone + future content hooks)

---

## “Golden anchor” workflow (recommended for Stable Diffusion)

- Generate 1 “golden” example for each family: **UI panel**, **icon sheet**, **ship card**, **backdrop**.
- Reuse the same anchor via your SD reference workflow (img2img low denoise / reference adapters).
- Do not change camera/palette between generations; variation belongs in subject matter, not style.

---

## Next step I can do after this doc

If you want, I can also:
- Add a tiny `assets-manifest.json` in this folder listing the above filenames (useful for loader code later).
- Update `HomeScene` / `InstanceScene` to actually load and use these assets (without adding new dependencies).

