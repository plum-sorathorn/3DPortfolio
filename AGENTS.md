# AGENTS.md

Welcome to the **3DPortfolio** repository! This document outlines the project architecture, tech stack, directory structure, development commands, and critical guidelines for AI agents and human contributors working on this codebase.

---

## 1. Project Overview

This repository powers an interactive personal portfolio website ([https://www.splum.org/](https://www.splum.org/)). It blends a 3D isometric room environment built with Three.js and Blender with a classic 2D portfolio webpage embedded in an in-game desktop monitor modal.

### Key Highlights
- **Interactive 3D Room**: A 3D room rendered via Three.js with GLTF/DRACO models, custom baked textures, interactive objects (chair, fans, tesseract, holoscreen, certificates, desktop monitor).
- **Embedded Webpage**: Clicking the desk monitor opens a responsive traditional portfolio webpage (`/iframes/webpage/index.html`) featuring projects, work experience, certifications, and contact forms.
- **Certificate Modals**: Clicking the wall certificate frames opens certificate preview modals.
- **Background Music**: Ambient music player handled via Howler.js.

---

## 2. Tech Stack

- **Core & Bundler**: Vite (ES Modules), Vanilla JavaScript (ES6+), HTML5, Sass (SCSS)
- **3D Graphics & Animation**: Three.js, GSAP (GreenSock), DRACOLoader, OrbitControls, UnrealBloomPass (postprocessing)
- **Audio**: Howler.js
- **2D Webpage (Iframe)**: HTML5, Bootstrap, FontAwesome, Owl Carousel, Parallaxie, Formspree
- **Asset Pipeline**: Blender (3D modeling & texture baking), WebP textures, GLB model format, PyPDF for document handling

---

## 3. Directory Structure

```
3DPortfolio/
├── AGENTS.md                      # Agent guidelines and system documentation
├── README.md                      # Project introduction and tech overview
├── index.html                     # Root HTML entrypoint (3D canvas, modal shells, preloads)
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite bundler configuration (if present)
├── src/                           # 3D application source code
│   ├── main.js                    # Bootstrap entrypoint (initializes scene, loads model, starts loop)
│   ├── scene.js                   # Scene, perspective camera, renderer, composer & OrbitControls
│   ├── store.js                   # Centralized reactive store object
│   ├── constants.js               # Texture mappings, raycaster targets, social links
│   ├── modelLoader.js             # GLTF/DRACO room loader and material assignments
│   ├── textures.js                # WebP texture loader and configuration
│   ├── render.js                  # Main requestAnimationFrame render loop
│   ├── raycaster.js               # Mouse & pointer raycasting handlers
│   ├── interactions.js            # Click & touch handlers for interactive objects
│   ├── animations.js              # GSAP animations (chair spin, tesseract bloom, holoscreen)
│   ├── introAnimations.js         # Initial camera fly-in and loading sequence
│   ├── dom.js                     # DOM element caches and modal open/close logic
│   ├── controls.js                # Control helper logic & instruction toggles
│   ├── helpers.js                 # Math and pointer utilities
│   ├── video.js                   # Hologram video texture handling
│   ├── backgroundMusic.js         # Howler audio player
│   ├── webglbanner.js             # Fallback warning if WebGL is unavailable
│   └── style.scss                 # Global styling, loading screen, modal styles
└── public/                        # Static assets served at root
    ├── draco/                     # Draco decoder/encoder binaries
    ├── models/                    # 3D GLB model files (e.g. room_test-v1.glb)
    ├── textures/                  # Baked WebP texture sets (room, floor, desk, monitors, etc.)
    │   └── videos/                # Hologram video (holoscreen2.mp4)
    ├── images/                    # Certificate images (CompTIA_Network.png, etc.)
    ├── music/                     # Background audio files
    └── iframes/                   # Embedded iframe pages
        ├── iframe-viewer.html     # Generic image/certificate viewer modal
        └── webpage/               # Traditional 2D portfolio site
            ├── index.html         # Main 2D portfolio HTML (About, Projects, Experience, Certs)
            ├── style.css          # Portfolio stylesheet
            ├── cv/resume.pdf      # Resume downloadable PDF
            └── uploads/           # Project screenshots, company logos, certificates
```

---

## 4. Development & Build Workflows

All commands are executed from the repository root:

- **Install dependencies**:
  ```bash
  npm install
  ```
- **Start development server**:
  ```bash
  npm run dev
  ```
- **Build production bundle**:
  ```bash
  npm run build
  ```
- **Preview production build**:
  ```bash
  npm run preview
  ```

---

## 5. Critical Guidelines & Consistency Rules

### 5.1 Parity Across Resume, Webpage, and 3D Scene
When updating any profile details (work experience, projects, education, certifications, contact info):
- **Exact Matches Required**: Role titles, company names, start/end dates, and bullet points must match identically across:
  1. `public/iframes/webpage/index.html` (the 2D portfolio experience, project, and certification cards)
  2. `public/iframes/webpage/cv/resume.pdf` (the downloadable resume)
  3. `src/constants.js` and `src/interactions.js` (for social links, certificate modal targets, etc.)
- **Date Formatting**: Keep date representations standardized (e.g., `Month DD, YYYY - Month DD, YYYY` or `Month YYYY - Month YYYY` consistent with the resume).
- **Typo Verification**: Ensure role titles and company names are spelled accurately (e.g., "Engineer", not "Enginner").

### 5.2 External Profile Access & Scraping
- **LinkedIn Restriction**: LinkedIn (`https://www.linkedin.com/in/...`) blocks automated headless requests with HTTP `999` and forces an authwall redirect (`/authwall`). Agents cannot directly fetch live LinkedIn profiles across the network without user-provided content.
- If changes from LinkedIn are requested, prompt the user to provide the updated text or export, or sync from the latest local `resume.pdf`.

### 5.3 3D Assets & Three.js Conventions
- Maintain the centralized state pattern in `src/store.js`. Do not create multiple fragmented global states.
- Ensure all textures loaded through `src/textures.js` or `src/constants.js` match mesh raycaster names in `room_test-v1.glb`.
- Always verify build integrity with `npm run build` after editing code or assets.

### 5.4 Codebase & Document Exploration (GitNexus vs Graphify)
- **Code-Based Exploration & Refactoring**: Use **GitNexus** for all source code navigation, symbol context, blast radius (`impact`), and pre-commit checks (`detect-changes`).
- **Non-Code Exploration**: Use **Graphify** (`graphify query`) for navigating non-code assets, documentation, markdown files, PDFs (such as `public/iframes/webpage/cv/resume.pdf`), media, and high-level conceptual knowledge graphs.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **3DPortfolio** (39977 symbols, 126189 relationships, 633 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis. For unified PDG impact, add `mode: "pdg"` with optional `line: <N>` — it returns statement-level `affectedStatements` over CDG + REACHING_DEF and inter-procedural symbols in `interproceduralByDepth`/`byDepth`; no-layer/degraded PDG results are UNKNOWN-risk notes (`--pdg` layer). CLI equivalent: `node .gitnexus/run.cjs impact "symbolName" --direction upstream --mode pdg --line <N> --repo .`.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).
- For control/data dependence, `pdg_query({mode: "controls", target: "fileOrSymbol"})` answers "under what condition does X run?" (CDG, incl. guard clauses) and `pdg_query({mode: "flows", target, variable})` traces "where does variable Y flow?" (REACHING_DEF). `--pdg` layer.

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/3DPortfolio/context` | Codebase overview, check index freshness |
| `gitnexus://repo/3DPortfolio/clusters` | All functional areas |
| `gitnexus://repo/3DPortfolio/processes` | All execution flows |
| `gitnexus://repo/3DPortfolio/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |
| Work in the Gltf area (445 symbols) | `.claude/skills/gitnexus-area-gltf/SKILL.md` |
| Work in the Js area (312 symbols) | `.claude/skills/gitnexus-area-js/SKILL.md` |
| Work in the Draco area (49 symbols) | `.claude/skills/gitnexus-area-draco/SKILL.md` |
| Work in the Cluster_125 area (6 symbols) | `.claude/skills/gitnexus-area-cluster-125/SKILL.md` |

<!-- gitnexus:end -->
