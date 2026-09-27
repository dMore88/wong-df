# Wucius Wong: Principles of Two-Dimensional Design
### Interactive Generative Studio, Creative Gym & Visual Grammar Companion

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://dmore88.github.io/wong-df/)
[![Architecture Contract](https://img.shields.io/badge/Architecture-STUDIO__RULES.md-blue?style=for-the-badge)](./STUDIO_RULES.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](#)

> 🌐 **Live Web Application:** [https://dmore88.github.io/wong-df/](https://dmore88.github.io/wong-df/)

---

## 🎯 Purpose & Project Context

This application was conceived as a **personal creative gym and interactive practice workbench for graphic designers**. 

While design fundamentals are typically taught in academic environments, professional designers often lose touch with the mathematical precision and foundational visual grammar that underpin great graphic design. **Wucius Wong's** seminal work, *"Principles of Two-Dimensional Design"* (*Fundamentos del diseño bi- y tridimensional*), offers an extraordinary geometric, systematic, and artistic approach to 2D composition. However, translating abstract principles (like *interrelations*, *structural modulation*, *gradation*, or *anomaly*) into everyday professional graphic design challenges can feel distant.

This project bridges that gap by creating a **trio of interconnected environments**:
1. **Theory:** Instant access to the textbook's definitions, classic figures, interactive demonstrations, and conceptual rigor.
2. **Studio:** A generative visual sandbox to freely combine, stack, and modulate principles in real-time.
3. **Real World:** Concrete playgrounds connecting visual grammar directly to applied problems in branding, posters, packaging, and editorial hierarchy.

It serves as a **micropractice tool**: an interactive space to experiment, internalize foundational rules, refresh forgotten instincts, and discover generative visual solutions for real-world projects.

---

## 🏛️ The Three Pillars & Interconnected Architecture

The web app is structured into three seamlessly interconnected views accessible from the top navigation bar, creating a continuous learning and creation loop:

```
               ┌────────────────────────────────────────────────────────┐
               │              WONG 2D DESIGN FUNDAMENTALS               │
               └───────────┬────────────────┬────────────────┬──────────┘
                           │                │                │
                           ▼                ▼                ▼
                     [📖 THEORY]      [🎨 STUDIO]      [💼 REAL WORLD]
                     Textbook &       Generative       Applied Cases:
                     Interactive      Sandbox &        Branding, Posters,
                     Plates           Stack Feed       Packaging & Hero
                           │                ▲                │
                           │  "Open in      │  "Open &       │
                           └── Studio" ─────┴── Tweak" ──────┘
```

---

## 📖 1. Theory: Digital Handbook & Interactive Plates

The **Theory** view is a complete reference companion covering all **12 chapters** of Wucius Wong's visual grammar. Each chapter provides historical context, formal definitions, and a live, interactive canvas demonstration.

### How to Navigate & Use Theory:
* **Chapter Switching:**
  * **Top Dropdown:** Direct selector in the central header for instant jumping to any of the 12 chapters.
  * **Previous / Next Buttons:** Arrow buttons in the header and at the bottom footer.
  * **Keyboard Shortcuts:** Press the **Left Arrow ($\leftarrow$)** and **Right Arrow ($\rightarrow$)** keys on your keyboard to flip between chapters instantly.
* **Interactive Demonstration Canvas:**
  * Every chapter includes a live canvas rendering Wong's diagrams.
  * Adjust dedicated sliders and controls (e.g., cell counts, angles, steps, deformation amounts) to observe how mathematical parameters alter the composition.
* **Direct Bridges:**
  * **"Open in Studio" Button:** Pre-loads the current chapter's geometric formula directly into the Studio sandbox for unrestricted experimentation.
  * **"Explore Real-World Application" Button:** Jumps straight to the related real-world case study to see how the theoretical concept solves actual commercial design problems.

### Complete Chapter Curriculum:
| Chapter | Topic | Core Geometric & Theoretical Focus |
| :--- | :--- | :--- |
| **CH 01** | **Introduction** | Conceptual (point, line, plane, volume), Visual (shape, size, color, texture), Relational (direction, position, space, gravity), and Practical elements. |
| **CH 02** | **Form & Interrelations** | Positive/negative forms and the 8 fundamental spatial operations between Form A and Form B. |
| **CH 03** | **Repetition** | Unit forms, sub-units, super-units, linear/rotational cadence, and directional variation. |
| **CH 04** | **Structure** | Formal, semi-formal, and informal grids; active vs. inactive cell boundaries; dual rhythm intervals ($A : B$). |
| **CH 05** | **Similarity** | Imperfect kinship, organic variation, and elastic geometric deformation within form families. |
| **CH 06** | **Gradation** | Sequential transitions of shape, size, color, planar direction, and depth illusion pathways. |
| **CH 07** | **Radiation** | Polar coordinate frameworks: Centrifugal (outward rays), Concentric (expanding ripples), and Centripetal (inward torque). |
| **CH 08** | **Anomaly** | Intentional violation of regularity to generate focal tension, relieve monotony, or fracture order. |
| **CH 09** | **Contrast** | Visual disparity and asymmetrical balance across shape, scale, color, and texture dominance. |
| **CH 10** | **Concentration** | Gravitational density fields: clustering toward points, lines, or voids within a modular matrix. |
| **CH 11** | **Texture** | Visual and tactile surfaces: lithographic grain, halftone dot screens, striation, and typographic rasters. |
| **CH 12** | **Space** | Isometric projection, reversible figure-ground ambiguity, and optical depth paradoxes. |

---

## 🎨 2. Studio: Unified Generative Workbench & Stack Feed

The **Studio** is the creative heart of the application—a unified, mathematically rigorous composition engine where designers can compose freely, stack modifiers, and inspect their visual grammar formula.

### Studio Workflow & Features:

#### A. Form A & Form B (The Unit Form / Submódulo)
* **Shape Pickers:** Select from a library of 16 geometric primitives: *Circle, Square, Rectangle, Equilateral Triangle, Right Triangle, Rhombus, Trapezoid, Hexagon, 4-Point Star, Crescent, Teardrop, Capsule, Cross, C-Ring, Line, and Arc*.
* **2-Column Numerical & Slider Inputs:**
  * **Width & Height:** Independent proportional or disproportionate scaling.
  * **Offset X & Offset Y:** Coordinate positioning of Form B relative to Form A.
  * **Rotation ($0^\circ - 360^\circ$):** Precision degree slider and numerical input.
* **Secondary Form (Form B Toggle):** Enable or disable Form B with a single switch. When active, Form B interacts dynamically with Form A.
* **The 8 Spatial Interrelations:**
  * **Detachment:** Forms remain separated by empty space.
  * **Touching:** Forms meet at exact boundary contact points with zero gap.
  * **Overlapping:** One form rests on top of the other with a crisp perimeter knockout line.
  * **Penetration:** Forms become transparent, revealing their overlapping interior geometry.
  * **Union:** Forms merge into a single continuous silhouette outline.
  * **Subtraction:** The invisible negative silhouette of Form B cuts cleanly out of Form A.
  * **Intersection:** Only the shared overlapping geometry of both forms remains visible.
  * **Coinciding:** Forms share identical space, creating a unified scale or composite figure.

#### B. The Stackable Modifiers Pipeline (10 Principles)
Expandable accordions allow activating and fine-tuning any modifier:
1. **Repetition (CH 03):** Columns, rows, spacing, and grid types (*Standard Grid, Brick / Half-Drop, Staggered, Diagonal, Checkerboard, Alternating Reflection*).
2. **Structure (CH 04):** Structural grid lines, visible line weights, active/inactive cell clipping, and dual rhythm spacing ($A : B$).
3. **Similarity (CH 05):** Kinship variation, rotation jitter, scale variation, and form deformation.
4. **Gradation (CH 06):** Gradation mode (*Scale, Rotation, Shape Morphing*), step count, and direction (*Horizontal, Vertical, Diagonal, Radial*).
5. **Radiation (CH 07):** Centrifugal, concentric, or spiral rays; focal point coordinates; sector count; and curvature.
6. **Anomaly (CH 08):** Anomaly mode (*Single Unit, Regional, Linear*), anomaly form selection, scale multiplier, and color inversion.
7. **Contrast (CH 09):** Primary contrast dimension (*Scale, Shape, Orientation, Tone*) and contrast ratio.
8. **Concentration (CH 10):** Attraction scheme (*Point Focus, Linear Axis, Void / Repulsion*), attractor coordinates, and gravitational pull strength.
9. **Texture (CH 11):** Tactile surface rendering (*Halftone Screen, Lithographic Grain, Horizontal Striations, Typographic Micro-Raster*), density, and scale.
10. **Space (CH 12):** Isometric 3D extrusion, isometric angle ($30^\circ / 45^\circ / 60^\circ$), extrusion depth, and optical depth shading.

#### C. Mechanical Rules (Option B: Informative & Assisted)
To ensure smooth and predictable creative control, the Studio implements **Option B** (formalized in [`STUDIO_RULES.md`](./STUDIO_RULES.md)):
* **Strict Topological Mutual Exclusivity (Cartesian vs. Polar):**
  * Activating **Radiation** automatically switches off **Repetition** and **Structure** (and vice-versa), eliminating conflicting coordinate regimes and ghost controls.
* **Non-Coercive Assisted Warnings:**
  * Population-dependent modifiers (*Similarity, Gradation, Anomaly, Contrast, Concentration*) can be turned on and calibrated at any time.
  * If activated in single-module mode, the system **does not force-activate** a grid; instead, it displays an informative, non-intrusive amber banner: *"Requires Repetition or Radiation matrix to display across a population of units"*.
  * Turning off the grid temporarily to inspect the single module **does not erase** your modifier calibrations—they remain ready to re-render the moment a grid is reactivated.
* **Canvas Boundary & Coordinate Protection:**
  * Coordinates and margins adapt dynamically to the canvas aspect ratio, guaranteeing that no modules are cropped or pushed off-screen.

#### D. Active Principles Feed (Left Column Study Cards)
* **Live Formula Stack:** Displays cards for each active principle, keeping *CH 02: Form & Interrelations* permanently at the base.
* **Clean Synchronization:** Clicking the `[×]` button on any card cleanly turns off that modifier without collateral side-effects.
* **Contextual Jump Links:** Each card contains `[📖 Theory]` to jump to its chapter handbook and `[💼 Real World]` to view its applied case study.
* **Status Badges:** Displays amber dependency badges whenever a collective modifier is awaiting an active grid.

#### E. Canvas Toolbar & Utilities
* **Aspect Ratio Selector:** Switch framing in real time:
  * **1:1 Square (600 × 600 px):** Logos, brandmarks, icons, social avatars.
  * **9:16 Story (450 × 800 px):** Vertical reels, mobile wallpaper, stories.
  * **4:3 Editorial (800 × 600 px):** Magazine spreads, book covers, tablets.
  * **3:4 Poster (600 × 800 px):** Printed posters, placards, flyers.
  * **16:9 Cinematic (800 × 450 px):** Website hero banners, landscape displays.
* **Safe Bounds Guides:** Toggle a 48px red architectural drafting grid to check balance and margins.
* **Figure/Ground Inversion:** Instantly flip positive and negative contrast (black-on-white vs. white-on-black).
* **Reset Parameters:** One-click return to pristine default settings.
* **Hi-Res PNG Export:** Generates crisp Retina-resolution PNG graphics timestamped for your design archives.
* **Editorial Colophon:** Dynamic typographic readout at the bottom of the canvas displaying the exact formula:
  `USED ON THIS DESIGN: FORM / REPETITION / GRADATION / TEXTURE`

---

## 💼 3. Real World: Applied Design Playgrounds

The **Real World** view bridges geometric theory into everyday professional graphic design challenges across 4 primary creative disciplines:

### 1. Brand Identity & Negative Space Monograms (CH 02 & CH 12)
* **Design Problem:** Creating iconic, distinctive logomarks that leverage Gestalt psychology and negative space without illustrative clutter.
* **Wong Solution:** Geometric Boolean operations (subtraction, touching, penetration) between primary primitives.
* **Interactive Presets:**
  * *Gestalt Cut (Circle − Diamond)* — Boolean negative cut mark.
  * *Tangential Contact (Twin Circles)* — Precise tangential tension mark.
  * *Translucent Penetration (Arch & Hexagon)* — Multi-tone brand overlay mark.
* **Mockup Framing:** Realistic corporate business card / stationery presentation.

### 2. Swiss Typographic Poster & Book Cover (CH 04, CH 06 & CH 07)
* **Design Problem:** Exhibition and festival posters conveying kinetic energy, intellectual rigor, and editorial authority.
* **Wong Solution:** Centrifugal radiation vortices and concentric wavefields anchored by asymmetric Swiss grotesque typography.
* **Interactive Presets:**
  * *Centrifugal Vortex (Kunsthalle 1968)* — Spiral radiation exhibition poster.
  * *Concentric Wave (Neue Grafik)* — Bauhaus-inspired expanding concentric waves.
  * *Sunburst Rays (Electronic Music Series)* — High-density kinetic radial rays.
* **Mockup Framing:** Framed gallery/street exhibition poster.

### 3. Luxury Packaging & Brand Patterns (CH 03, CH 05 & CH 11)
* **Design Problem:** Continuous rapport patterns for luxury boutique packaging, tissue wraps, and shopping bags.
* **Wong Solution:** Symmetrical unit forms tiled across active Cartesian grids with half-drop brick shifts and subtle similarity kinship.
* **Interactive Presets:**
  * *Meeting of 4 Circles (Wong Classic)* — Rotational 4-circle quatrefoil motif.
  * *Half-Drop Diamond Lattice* — 50% staggered luxury diamond trellis.
  * *Interlocking Geometric Chevron* — Dynamic rhythmic zigzag pattern.
* **Mockup Framing:** Rigid luxury cosmetic / boutique gift box.

### 4. Focal Hierarchy & High-Impact Hero (CH 08, CH 09 & CH 10)
* **Design Problem:** Overcoming monotony in editorial spreads or website landing page hero sections to command immediate visual attention.
* **Wong Solution:** Distributing a calm, repetitive grid, then introducing an intentional structural anomaly or gravitational concentration at the golden section.
* **Interactive Presets:**
  * *Golden Section Anomaly* — Scale and color fracture breaking a regular grid.
  * *Gravitational Point Swarm* — Density clustering guiding the gaze to an actionable focal point.
  * *Tonal Contrast Inversion* — Inverted contrast island commanding priority.
* **Mockup Framing:** Modern digital viewport / web hero section.

### The "Open & Tweak in Studio" Bridge:
Every Real World preset includes an **"Open & Tweak in Studio"** button. Clicking this:
1. Automatically maps shapes, scales, offsets, rotations, and modifier states.
2. Clears residual incompatible modifiers and activates the appropriate grid (Repetition or Radiation).
3. Synchronizes the Studio UI, Form B status, and controls.
4. Seamlessly transfers you to the Studio canvas ready for real-time generative editing.

---

## 🎨 Global UI Controls

* **Color Palette Picker (Header Dropdown):**
  * **Ink & Paper:** Classic high-contrast black ink on warm white paper.
  * **Chalkboard:** White markings on deep charcoal/slate surface.
  * **Bauhaus:** Primary red and deep blue against rich off-white.
  * **Blueprint:** Architectural cyan lines on deep technical blue.
  * **Editorial Sepia:** Archival warm brown on parchment cream.
* **Dark / Light Theme Switcher:** Instant system-wide theme toggle (moon/sun icon).
* **High-Res Global Export:** Download high-resolution PNGs at any time from the top navigation bar.

---

## ⚙️ Mechanical Rules Summary

| Modifier | Spatial Regime | Interface Behavior (Option B Contract) |
| :--- | :--- | :--- |
| **Form A & B** | Autonomous Base | **Always active.** The atomic geometric unit of composition. |
| **Repetition** | Cartesian Grid | Incompatible with Radiation. Turning on turns off Radiation. Turning off deactivates Structure. |
| **Radiation** | Polar Framework | Incompatible with Repetition & Structure. Turning on turns off both. |
| **Structure** | Cartesian Subdivision | Requires Repetition. Turning on ensures Repetition is active. |
| **Similarity, Gradation, Anomaly, Contrast, Concentration** | Collective (Population) | Can be calibrated freely. Displays assisted amber warning banner if no grid is active without force-activating switches. |
| **Texture & Space** | Autonomous Universal | Works across both single-module mode and all grid systems. |

*For complete architectural specifications, see [`STUDIO_RULES.md`](./STUDIO_RULES.md).*

---

## 🛠️ Technology Stack & Zero-Dependency Build

The project is built with clean, standards-compliant web technologies designed to run anywhere without heavy tooling:

* **Frontend:** Modern Vanilla JavaScript (ES6+ Modules), HTML5 Canvas 2D API, Retina HiDPI auto-scaling.
* **Styling:** Tailwind CSS with custom CSS variables for dark/light themes and Swiss/Bauhaus typography (*Space Grotesk*, *Inter*, *JetBrains Mono*).
* **Icons:** [Lucide Icons](https://lucide.dev/).
* **Zero-Dependency Bundler (`build.py`):**  
  A built-in standard Python 3 script that concatenates modular ES sources into a standalone `js/bundle.js` for offline usage on both `http://` and `file:///` protocols without CORS restrictions.

---

## 🚀 How to Run & Develop

### 1. Online Access (GitHub Pages)
Open immediately in any modern browser:  
👉 **[https://dmore88.github.io/wong-df/](https://dmore88.github.io/wong-df/)**

### 2. Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/dMore88/wong-df.git
cd wong-df

# 2. Run locally with any static web server (e.g. Python)
python3 -m http.server 8080

# 3. Open in your browser
# Visit http://localhost:8080
```

### 3. Modifying Code & Compiling Bundle
When modifying files in `js/`:
```bash
python3 build.py
```
This updates `js/bundle.js`.

---

## 📚 References & Credits

* **Wucius Wong:** *Principles of Two-Dimensional Design* (*Fundamentos del diseño bi- y tridimensional*), Editorial Gustavo Gili.
* **Bauhaus & Swiss Graphic Design Tradition:** Josef Müller-Brockmann, Armin Hofmann, Johannes Itten, and Max Bill.

---

## 📄 License

This project is licensed under the MIT License — feel free to explore, learn, and adapt for your own creative practice.
