# OGate — Art Director Brief (Mood Board + Prompt Kit)

OGate is a **mobile-first 4X / extraction MMO** with two distinct modes:
- **Home System (Sanctuary / idle)**: structured, readable, “familiar 4X.”
- **OGate Instances (Wormhole / extraction)**: high tension, **dark / gritty / industrial** sci‑fi with **diegetic tactical UI** and **neon signal language** against the void.

This document is the starting point for an **AI-assisted art pipeline**: it defines **visual pillars**, **do/don’t rules**, and **prompt templates** to keep outputs coherent across thousands of generated assets.

---

## 1) North Star (what it should feel like)

**Primary adjectives**
- **Industrial**, utilitarian, modular, mechanically plausible
- **Dark, high-contrast**, void-forward compositions
- **Gritty**: wear, abrasion, soot, micro-scratches, heat discoloration
- **Signal-rich**: “submarine warfare” in space—ripples, pings, warning states
- **Diegetic**: UI looks like an in-universe ship system / tactical display

**Player fantasy**
- “I’m not piloting a ship; I’m commanding assets through a hostile anomaly.”
- “Every action leaves a trace.” (entropy ripples, scan pings, warp entry/exit)
- “Extraction is a heist.” (stakes, alarms, countdown-without-a-timer)

**Readability constraints (mobile portrait)**
- Large shapes, simple silhouettes, strong iconography
- UI must be legible at a glance; detail lives in zoom/inspect states

---

## 1.5) Locked decisions from your answers (style contract)

- **Primary reference**: **EVE Online** (explicit “brand test” answer).
- **Secondary references**: **Mass Effect** (clean space-opera military), **The Expanse** (hard-sci plausibility). (You also called out Destiny 2 faction vibes + Stellaris scope + Doom 3 tension beats.)
- **Hard-sci bias**: default to plausible engineering; shortcuts only for **mobile readability**.
- **Cleanliness**: baseline is **military clean**; heavier wear/patchwork is **faction / tech-tier dependent**, not universal.
- **Horror**: keep anomalies **clean/mechanical/cosmic**; horror arcs are exceptions later.
- **Color**: world leans **deep navy**; UI leans **green phosphor** (MIL-SPEC / radar).
- **Neon**: only as **subtle instrumentation** (no Tron glow).
- **UI**: **MIL-SPEC / radar**, but premium and intentional (no “cheap HUD overlay” crutch).
- **Typography**: **Consolas-like** technical monospace vibe.
- **Panels**: flat colors with thoughtful gradients/borders; avoid glass/Aero and heavy “hardware texture” panels.
- **Factions**: **5 at launch**, each with distinct visual language (silhouette + palette + materials).
- **SDI**: NATO/UN vibe; **UN-flag blue** is core iconography.
- **AI pipeline**: **Stable Diffusion-first**, prompts must be production-ready.
- **Consistency**: lock pseudo-camera + lighting for ship cards; start ships unmarked (no decals/numbers).
- **Compliance**: avoid symbols/insignias that violate common restrictions (Germany/China).

---

## 2) Visual pillars (non-negotiables)

### Pillar A — Salvage-Industrial Sci‑Fi (not sleek)
- Ships and stations look **manufactured**, **repaired**, **patched**, **upgraded**.
- Surfaces: painted metal, exposed structure, hazard stripes, bolted panels, thermal scorching.

### Pillar B — The Void + Neon Signals
- Backgrounds are mostly **near-black** with sparse, deliberate highlights.
- Accents: **engine trails**, HUD glows, scan pulses, entropy waveforms.

### Pillar C — Diegetic Tactical Dashboard
- The “System View” is a **command console overlay** on a “pretty picture” backdrop.
- UI language: holographic blues + warning reds, waveform gauges, gridlines, brackets, reticles.

### Pillar D — Two Worlds: Sanctuary vs Anomaly
- **Home**: calmer lighting, slightly warmer neutrals, “safe operations.”
- **OGate**: colder palette, harsher contrast, ominous environmental phenomena.

---

## 3) Palette + lighting targets (first pass)

### Base palette (global)
- **Void**: **deep navy** near-black (cold, space-realistic; avoid “pure #000” everywhere)
- **Metal**: gunmetal, iron oxide, titanium gray
- **UI primary**: **green phosphor** (MIL-SPEC radar feel)
- **Caution**: amber/yellow (scan broadcast, caution states)
- **Warnings**: saturated red (proximity alert, combat, entropy critical)
- **Anomaly / precursor**: controlled secondary accent (recommend **violet/magenta**) used sparingly and only when “non-human/precursor” is the point

### Lighting
- Rim lighting > fill lighting (ships “cut” from the void)
- Volumetric glows reserved for: OGate event horizon, scan pings, entropy spikes
- Avoid “pretty nebula wallpaper” unless it supports navigation/readability (EVE-like restraint)

---

## 4) Shape language + materials

### Ships (silhouette rules)
- Read class at thumbnail size:
  - **Probe/Interceptor**: needle/arrow silhouettes, minimal mass
  - **Hauler/Barge**: boxy volumes, exposed cargo frames, modular pods
  - **Cruiser**: balanced proportions, clear “bridge/engine/weapon” regions
  - **Capital**: heavy slabs, carrier-like bays, massive radiator fins
  - **Strategic Lancer**: “blank slate” hull with swappable **subsystem blocks**

### Surface treatment
- Edge wear, decals, stenciled numbers, maintenance hatches
- Heat staining around thrusters and weapon mounts
- Micro-detail should not destroy big-shape readability

---

## 5) UI art direction (diegetic HUD)

### UI motifs
- Waveform gauges (Entropy as a **diegetic waveform**)
- Brackets, scanlines, subtle phosphor bloom, subtle chromatic aberration (light touch)
- Target callouts with “confidence/fuzz” states (collimation concept)

### UI color semantics (suggested)
- **Phosphor Green**: normal operations / navigation / baseline telemetry
- **Yellow/Amber**: caution / scan ping broadcast / detectable activity
- **Red**: proximity alert, combat-ready, entropy critical
- **Magenta/Violet**: anomaly / precursor / nanite presence (rare; don’t overuse)

### Avoid
- Fantasy ornamentation
- Overly playful UI
- Dense micro-text as the primary information carrier (mobile constraint)

---

## 6) “Signature moments” we should be able to depict

- **OGate activation**: a mechanical ring/field device “fires” a controlled tear
- **Event Horizon boundary**: circular lethal perimeter; visually ominous but readable
- **Entropy ripples**: visible disturbance on the entropy gauge; readable “pulse language”
- **Scan ping**: the act of scanning broadcasts your location (a moment of risk)
- **Warp start/end**: ripple at departure + arrival, but **no visible warp lane**
- **Extraction panic**: entropy > 80% crescendo; UI turns urgent
- **Exit Frame**: faint harmonic hum signal; campable, contested node

---

## 7) Asset families we need (and what “good” looks like)

### A) Backdrops (System View “pretty picture”)
- Minimal, high-contrast, navigationally calm; supports overlay UI.
- Variants by biome (ice field, ship graveyard, industrial ruins, gas cloud lanes).

### A.1) “Biome” clarification (space-first)
Your biome list (desert, jungle, arctic, volcanic, etc.) maps best to **planet archetypes and orbit tones** rather than “space biomes.” We’ll treat these as:
- **Planet node renders** (seen from orbit, readable)
- **Local orbit backdrop tinting** (subtle color cast + particulate fields)
- **POI dressing** (debris type, station architecture, ruin silhouettes)

### B) Nodes + icons (Planets, belts, gas clouds, stations, anomalies, Exit Frame)
- Icon set must be **consistent stroke/weight**, readable at 24–48px.
- Planets can be “mini renders” for larger sizes but must reduce to icon cleanly.

### C) Ship renders (for cards + battle vignettes)
- Consistent camera angle per asset type (e.g., 3/4 top-down for cards).
- Maintain class silhouette rules; add modular kit pieces as overlays.

### D) Combat visualization panels
- 2D “high-fidelity” vignettes that sell impact: shield bloom, hull breach, debris.
- Not a full animation requirement—should read as “rounds of fire” snapshots.

### E) FX library
- Engine trails, shield impact, missile salvo, laser lance, EMP / EW distortion
- Entropy ripple + scan ping + event horizon shader concepts

### F) Specialists / Contingents portraits (optional stylization)
- If portraits exist: keep them grounded (utility suits, visor reflections, grime).
- Avoid “hero fantasy.” Keep it “crew on a dangerous contract.”

---

## 8) AI generation rules (to prevent style drift)

### Global do’s
- Keep outputs **2D** (concept art / painted render / clean illustration), not 3D renders
- Emphasize **industrial plausibility** (panels, fasteners, radiators, thrusters)
- Use controlled neon accents; keep the rest subdued

### Global don’ts
- No anime / chibi / cartoon proportions
- No glossy “Apple sci‑fi” minimalism
- No fantasy runes, medieval motifs, organic alien goo unless explicitly a biome
- No text, watermarks, signatures, UI labels baked into images

### Compliance don’ts (safe default)
- Avoid extremist/political symbols, flags, propaganda aesthetics, and any “real-world” insignia directly lifted from modern nations.
- Avoid symbols commonly restricted in Germany (e.g., swastikas and close variants) and avoid politically sensitive iconography likely to trigger restrictions in China.
- Prefer fictional geometry marks, abstract unit emblems, or faction sigils we design in-house later.

### Consistency kit (recommended)
- One “style anchor” image per asset family (ships, UI, icons, backdrops)
- Lock: camera angle, lens feel (or “orthographic”), palette bias, grain level
- Maintain a small library of reusable prompt fragments (below)

---

## 9) Prompt library (templates + fragments)

These are **Stable Diffusion-first** templates. They’re written to be copy/paste-able into a typical SD UI.

General note: keep **one “style anchor” image per family** and use it consistently (img2img + low denoise, or an IP-adapter / reference workflow if you use one). The #1 failure mode for AI art at scale is drifting camera, palette, and line weight.

### 9.1 Universal prompt skeleton
Use this structure for most assets:

- **Subject** (what it is, clearly)
- **Function** (what it does / what class)
- **Style** (industrial gritty 2D sci‑fi)
- **Palette** (void black + cyan HUD + warning red accents)
- **Composition** (thumbnail readable, strong silhouette)
- **Constraints** (no text, no watermark, simple background if needed)

### 9.2 Prompt fragments (reusable)
**Style fragments**
- “hard-sci plausible industrial science fiction, utilitarian design, mechanically plausible, manufactured not organic, clean military finish with light wear, panel lines, fasteners, radiators, thrusters”
- “high contrast against deep navy space, restrained instrumentation glow, cinematic rim light, crisp silhouette”
- “2D concept art illustration, crisp silhouette, readable at small size, subtle film grain”

**UI fragments**
- “diegetic tactical HUD overlay, MIL-SPEC radar aesthetic, phosphor green lines, waveform meters, gridlines, brackets, reticles, subtle scanlines, premium and minimal”

**Negative fragments**
- “no text, no logos, no watermark, no signature, no anime, no cartoon, no fantasy runes, no ornate filigree, no glossy apple sci-fi minimalism, avoid colorful nebula wallpaper, avoid national flags, avoid political symbols”

### 9.3 Backdrop prompt (System View)
**Template**
- “deep space tactical backdrop for a mobile portrait strategy game, sparse stars, large readable shapes, high contrast, subtle volumetric haze, deep navy void, minimal clutter, 2D painted concept art, no ships, no UI text, premium EVE-like restraint, subtle instrumentation glow only”

**Biome suggestions to iterate**
- ice field, ship graveyard, industrial ruins, gas cloud corridors, asteroid belt, derelict station halo

**Orbit-tone variants (planet archetypes)**
- “desert world in orbit, warm sand-brown limb, thin atmosphere haze”
- “ocean world in orbit, deep cobalt seas, storm systems”
- “arctic world in orbit, fractured ice sheets, pale limb glow”
- “volcanic world in orbit, faint lava fissure glow (subtle), ash haze”
- “jungle/continental world in orbit, dense cloud bands, green-brown landmass”

### 9.4 Ship card render prompt (3/4 top-down)
**Template**
- “[SHIP CLASS] spaceship, [ROLE], hard-sci plausible industrial modular hull, visible thrusters and radiators, clean military finish with light wear, strong silhouette, consistent 3/4 top-down view, isolated on dark neutral background (deep navy), subtle rim light, restrained instrumentation glow, 2D high-fidelity illustration, crisp edges, no text, no watermark, no decals”

**Camera lock (recommended)**
- Angle: 3/4 top-down, nose pointing up-right (or pick one and never vary)
- Lighting: single key + rim, no dramatic multi-color gels
- Background: flat deep navy gradient, no stars (keeps cutouts clean)

### 9.5 Icon prompt (node/resource)
**Template**
- “clean MIL-SPEC sci-fi HUD icon set, [ICON SUBJECT], consistent line weight, minimal geometry, high readability at 32px, phosphor green with subtle glow, optional amber/red accent for state, transparent background, vector-like, no text”

### 9.6 FX prompt (entropy ripple / scan ping)
**Entropy ripple**
- “abstract tactical signal ripple, concentric distortion waves, waveform interference, phosphor green shifting to warning red at peaks, deep navy background, crisp, readable, 2D VFX sprite style, no text”

**Scan ping**
- “sonar scan pulse effect, expanding ring with interference artifacts, tactical HUD aesthetic, phosphor green core with amber caution accents, deep navy background, 2D VFX sprite style, no text”

### 9.7 Exit Frame prompt
- “mysterious exit frame in deep space, faint harmonic glow, subtle circular geometry, discoverable beacon feel, campable objective marker, hard-sci plausible industrial sci-fi, ominous but readable, deep navy void, subtle phosphor green telemetry accents + faint magenta anomaly accents, 2D concept art, no text”

---

## 11) Faction visual language framework (5 at launch)

We can keep faction names as placeholders for now, but the **art rules** should be fixed early.

### 11.1 What must change per faction (so they read instantly)
- **Silhouette**: round vs angular, long vs blocky, exposed vs enclosed
- **Materials**: painted composite vs bare metal vs ceramic armor
- **Greeble density**: sparse “clean panels” vs busy “field maintenance”
- **Accent color**: one disciplined accent (not rainbow)
- **UI skin**: same layout, different tint + emblem shape language

### 11.2 Suggested launch lineup (inspired by your refs)
- **SDI (UN/NATO security)**:
  - **Palette**: UN blue accents + phosphor green UI baseline
  - **Shapes**: conservative, functional, standardized modules
  - **Vibe**: lawful, regulated, “fleet safety” engineering
- **Industrial Extraction Combine**:
  - **Palette**: hazard amber + soot + worn white paint blocks
  - **Shapes**: boxy, external frames, visible cargo/piping
  - **Vibe**: utilitarian, cost-optimized, modular
- **Frontier / Privateers**:
  - **Palette**: muted olive + chipped paint + patched plating
  - **Shapes**: asymmetry, add-on pods, jury-rigged but plausible
  - **Vibe**: survivalist, opportunistic
- **Corporate High-Tech (Mass Effect clean)**:
  - **Palette**: restrained cool gray + minimal accent (teal or pale cyan, used sparingly)
  - **Shapes**: smooth panel transitions, fewer exposed components
  - **Vibe**: premium manufacturing, reliability, stealthy cleanliness
- **Precursor / Anomaly-adjacent** (rare, endgame-facing):
  - **Palette**: magenta/violet anomaly accent (rare), otherwise dark neutral
  - **Shapes**: geometric purity, “impossibly precise” edges
  - **Vibe**: non-human engineering, but keep it clean (not horror)

---

## 12) Next production step (what I’ll do after this)

If this direction matches your intent, the next iteration of this doc should add:
- A **prompt pack per asset family** (ships, UI frames, icons, backdrops) with:
  - Positive prompt
  - Negative prompt
  - “Knobs” (what to change vs what never to change)
  - A “camera lock” line item (what must not change)

This update also adds the first **POI prompt pack** (below) based on your list.

---

## 13) POI prompt pack (Stable Diffusion-first)

Use these as **single-image concepts** for mood board + later in-game POI cards. Keep the same global constraints: **deep navy void**, restrained glow, hard-sci plausibility, and no embedded text.

**Global negative (append to all POIs)**
- “no text, no logos, no watermark, no signature, no anime, no cartoon, no fantasy runes, avoid ornate filigree, avoid colorful nebula wallpaper, avoid national flags, avoid political symbols, avoid gore”

### 13.1 Derelict Capital Ship
- **Positive**: “derelict capital ship drifting in deep navy space, massive scale, silent and cold, multiple hull breaches, exposed internal ribs, scattered debris field, hard-sci plausible structure, clean military manufacturing with battle damage, subtle rim light, minimal instrumentation glow, 2D high-fidelity concept illustration, no UI text”
- **Knobs**: debris density (low/med/high), breach severity (light/major), faction silhouette cues (SDI/corporate/industrial)

### 13.2 Ancient Gateway Frame (not the player OGate)
- **Positive**: “ancient dormant gateway frame in deep space, non-functional ring megastructure, unknown matte-black metal, impossibly precise machining, minimal seams, faint anomaly shimmer (very subtle), not magical, hard-sci presentation, deep navy void, 2D concept art, ominous but clean, no text”
- **Knobs**: precursor accent (none → faint magenta), scale cues (tiny ship silhouette for size reference vs none)

### 13.3 Shattered Mining Outpost
- **Positive**: “shattered industrial mining outpost anchored to a large asteroid, broken in half by catastrophic force, exposed trusses and piping, hazard markings, drifting containers, dust and small fragments, plausible industrial engineering, deep navy void, restrained phosphor telemetry highlights, 2D concept illustration, no text”
- **Knobs**: asteroid type (rocky/metallic/ice), lighting state (cold rim vs emergency amber)

### 13.4 Orbital Research Array
- **Positive**: “abandoned orbital research array, cluster of massive sensor dishes and long spines, dark and powered-down, occasional faint phosphor diagnostic flicker, hard-sci plausible antenna structure, deep navy background, sparse stars, 2D concept art, clean silhouette, no text”
- **Knobs**: dish count, ‘power on’ amount (0%/5%/15%)

### 13.5 Praetorian Monolith (glyphs, not runes)
- **Positive**: “praetorian monolith floating in deep space, sleek geometric object (obelisk or perfect sphere), precision-machined black composite, etched with faint glowing glyphs (non-linguistic geometric micro-relief, circuit-like patterns), subtle pulsation, clean and ominous, not fantasy, not magical, deep navy void, 2D high-fidelity concept illustration, no text”
- **Knobs**: form factor (obelisk/sphere), glyph intensity (very faint → readable), anomaly accent (none → faint magenta)

### 13.6 Crystalline Construct
- **Positive**: “crystalline construct in deep space, jagged semi-translucent structure that appears grown not built, physically plausible refraction, subtle internal scattering, minimal glow, deep navy void, hard-sci presentation, clean composition, 2D concept illustration, no text”
- **Knobs**: crystal type (ice-like/quartz/metallic), translucency (low/high), tint (very subtle)

### 13.7 Leviathan Corpse (fossilized)
- **Positive**: “fossilized skeletal remains of a gargantuan space-faring creature, enormous rib-like structures drifting in deep space, ancient and mineralized, no gore, no flesh, bone-like fossil geometry, ominous scale, deep navy void, sparse debris, 2D concept illustration, no text”
- **Knobs**: fossil material (chalky/obsidian/mineralized), composition (close-up ribs vs full silhouette)

### 13.8 Automated Warforge
- **Positive**: “dormant automated warforge station, industrial factory modules, assembly line bays, half-built drone ships frozen in place, cold inactive lighting with a few amber safety beacons, hard-sci plausible manufacturing, deep navy void, 2D high-fidelity concept illustration, no text”
- **Knobs**: beacon intensity (very low → medium), drone silhouette family (sleek vs utilitarian)

### 13.9 Data Vault
- **Positive**: “heavily armored data vault in deep space, windowless containment cube, layered armor plates, recessed ports, minimal seams, threat-implied design, clean and intimidating, deep navy void, restrained rim light, 2D concept art, no text”
- **Knobs**: scale (small vault vs megavault), escort dressing (none vs a few defense drones)

### 13.10 Planetary Ruins (from orbit)
- **Positive**: “planet seen from orbit, visible planetary-scale ruins, faint city-grid mega-structures, collapsed arcs and rings on the surface, subtle atmospheric haze, hard-sci space camera feel, restrained color, deep navy space, 2D painted concept art, no text”
- **Knobs**: planet archetype (desert/ocean/arctic/volcanic), ruin density (sparse/dense), night-side illumination (none → faint)

---

## Appendix A) Style lock Q&A (filled)

### A) References (pick the closest, then rank top 3)
1. Which references are most “OGate” to you: **EVE Online**, **The Expanse**, **Alien / Nostromo**, **Blade Runner**, **Dune**, **Dead Space**, **Blame!**, **Mass Effect**, **Homeworld**, **OGame UI nostalgia**?
Answer: **EVE Online**, **Mass Effect**, **Destiny 2**, **Stellaris**, **Doom 3**, **The Expanse**

2. Do we want **hard-sci plausible** (Expanse) or **stylized industrial** (Alien/Dead Space) or a hybrid?
Answer: Very much in the **hard-sci plausible** camp. Whenever we need to make shortcuts it will largely to cater to the mobile game audiences rather than anything else.

### B) Grit + cleanliness (how dirty is “gritty”?)
3. Are ships mostly **military clean** with light wear, or **salvage patched** with heavy wear?
Answer: This should be faction/tech tree dependent, but by and large we should aim for **military clean**. The references to **Mass Effect** are helpful to visualize a clean aesthetic in a space opera

4. Any “body horror / grotesque” allowed for anomalies, or keep it purely mechanical/cosmic?
Answer: Keep it clean to the fullest extent. We may lean on horror at some point in the future for some storylines but that should be the exception

### C) Color + neon discipline
5. Should the world feel mostly **cold cyan/blue**, or do you want a secondary identity color (e.g., **toxic green** or **magenta anomaly**)?
Answer: Actually this is where the **EVE Online** reference comes in handy; we should lean deep navy blue for the most part, with a heavy **green phosphor** tint to UI elements to bring the military element into focus. We should tie specific events or environments or types of wormholes with color tints but lets pin that for later 

6. How loud is neon: **subtle instrumentation** vs **Tron-like glow**?
Answer: not sure when we decided on any neon, but if there is any it should be **subtle instrumentation**

### D) UI style (most important for coherence)
7. UI vibe: more **MIL-SPEC / radar** or more **holographic luxury**?
Answer: definitely more **MIL-SPEC / radar**, but not in a way that feels like it cheapens the UI - which often artists use this style as a crutch. It should not be the case here

8. Typography vibe: **condensed technical sans** (utilitarian) vs something more branded/stylized?
Answer: Doesn't EVE Online use Courier New? Wouldn't it be poetic if we leaned towards **Consolas** as our base typography

9. Do you want UI panels to feel like **glass** (transparent) or **hardware** (opaque metal consoles)?
Answer: Neither. We should largely use flat colors with thoughtful gradient and borders; glass/Aero type is a bit passe and does not fit the vibe. Hardware textures make everything very heavy visually as well.

### E) Factions (major driver of shape + palette)
10. How many major factions at launch, and do they each need a distinct visual language (colors, silhouettes)?
Answer: Let's aim for 5 factions at launch, each with very distinct visual languages. I would want to find inspiration in all the major factions in **EVE Online**, the smaller factions in the earlier content in **Destiny 2**, or even the protagonists of **Command & Conquer Tiberian Sun**

11. Should the **SDI (Stellar Defense Initiative)** read as “lawful clean security” (brighter, calmer) compared to others?
Answer: It should have a very NATO / UN feel to it - mix of military, law enforcement, and large supranational government organization. We should actually try to use the color of the UN flag as iconography.

### F) Biomes / instance themes (for backdrops + POIs)
12. What are the top 6 instance “biomes” you want artists/AI to generate repeatedly?
Answer: In no particular order: Desert, Rocky, Savannah, Ocean, Jungle, Continental, Arctic, Tundra, Alpine, Volcanic 

13. Any “signature POIs” you want emphasized visually (radar station, derelicts, ruins, ancient gates)?
Answer: A few examples. **Derelict Capital Ship**: A massive, silent hull drifting in the void, riddled with hull breaches and surrounded by a debris field; **Ancient Gateway Frame**: A dormant, non-functional ring structure made of unknown black metal (distinct from the player's OGate); **Shattered Mining Outpost**: An industrial rig anchored to a large asteroid, broken in half by some catastrophic force; **Orbital Research Array**: A cluster of massive sensor dishes and long spines, dark and abandoned; **Praetorian Monolith**: A sleek, geometric object (obelisk or perfect sphere) floating in space, etched with glowing, pulsating **glyphs** (non-linguistic geometric micro-relief); **Crystalline Construct**: A jagged, semi-translucent structure that appears grown rather than built; **Leviathan Corpse**: The fossilized, skeletal remains of a gargantuan space-faring creature; **Automated Warforge**: A dormant factory station with half-built drone ships frozen on the assembly line; **Data Vault**: A heavily armored, windowless containment cube floating in isolation; **Planetary Ruins**: Visible mega-structures or city grids on a planet's surface (viewed from orbit), implying a fallen civilization.

### G) Content rating + tone
14. Are we PG-13 (no gore) or can we show brutal hull breaches, bodies implied, etc.?
Answer: Not that there will be many opportunities to do so, but we should not feel the need to remain PG-13

15. Any cultural/language constraints for symbols, insignias, warnings?
Answer: Remain fully compliant with well-known limitations in Germany and China

### H) Production realities (AI pipeline constraints)
16. Which AI pipeline are we targeting first: **Midjourney**, **Stable Diffusion**, or both?
Answer: Strong preference for **Stable Diffusion**. Make sure we are prompt ready

17. Do we want a **consistent pseudo-camera** (same angle/lighting) for all ship cards?
Answer: Yes. Consistency is very important

18. Preferred asset sizes (e.g., ship cards 1024², icons 256², backdrops 1536×2048 portrait)?
Answer: No preference at the onset

19. Should we allow **visible faction decals/numbers** (without text), or keep ships unmarked for reuse?
Answer: Let's start without any. We can repaint for skins later

### I) “One sentence” brand test
20. Finish this sentence: **“OGate should look like ____.”**
Answer: **EVE Online**

