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
1. **Theory:** Instant access to the textbook's definitions, classic figures, and conceptual rigor.
2. **Studio:** A generative visual sandbox to freely combine, stack, and modulate principles in real-time.
3. **Real World:** Concrete playgrounds connecting visual grammar directly to applied problems in branding, posters, packaging, and editorial hierarchy.

It serves as a **micropractice tool**: an interactive space to experiment, internalize foundational rules, refresh forgotten instincts, and discover generative visual solutions for real-world projects.

---

## 🏛️ The Three Pillars of the Application

The web app is structured into three seamlessly interconnected views accessible from the top navigation bar:

```
               ┌──────────────────────────────────────────────┐
               │         WONG 2D DESIGN FUNDAMENTALS          │
               └───────┬──────────────┬──────────────┬────────┘
                       │              │              │
                       ▼              ▼              ▼
                 [📖 THEORY]    [🎨 STUDIO]    [💼 REAL WORLD]
                 Textbook &     Generative     Applied Cases:
                 Classical      Sandbox &      Branding, Posters,
                 Plates         Stack Feed     Packaging
                       │              ▲              │
                       └──────────────┴──────────────┘
                        "Open in Studio" & Presets Import
```

---

### 1. 📖 Theory: Digital Handbook & Classical Plates

A comprehensive reference companion containing all **12 chapters** of Wucius Wong's 2D design grammar:

* **Complete Chapter Handbook:**
  * **CH 01: Introduction to Visual Language** (Conceptual, visual, relational, and practical elements).
  * **CH 02: Form & The 8 Interrelations** (Spatial operations: detachment, touching, overlap, penetration, union, subtraction, intersection, coincidence).
  * **CH 03: Repetition** (Unit forms, sub-units, super-units, reflection, rotational cadence).
  * **CH 04: Structure** (Formal, semi-formal, and informal grids; active vs. inactive clipping; dual intervals $A:B$).
  * **CH 05: Similarity** (Visual kinship, organic imperfection, and elastic deformation).
  * **CH 06: Gradation** (Planar transitions, depth illusion, shape morphing, pathways).
  * **CH 07: Radiation** (Centrifugal, concentric, and spiral polar frameworks).
  * **CH 08: Anomaly** (Deliberate violation of structural regularity to establish focal tension).
  * **CH 09: Contrast** (Visual disparity, dominance, and asymmetric balance).
  * **CH 10: Concentration** (Gravitational fields, attractors, voids, and quantitative density).
  * **CH 11: Texture** (Surface treatments, halftone screens, lithographic grain, typographic rasters).
  * **CH 12: Space** (Isometric projections, reversible figure-ground, and optical depth paradoxes).
* **Interactive Classical Plates:** Generative canvas reconstructions of the historic diagrams and reference figures from Wong's book.
* **Direct Bridges:** Every chapter includes **"Open in Studio"** to jump straight into an active sandbox configured for that concept, and **"Explore Real-World Application"** to examine real graphic design cases.

---

### 2. 🎨 Studio: Unified Generative Workbench & Stack Feed

The creative core of the application—a unified, mathematically rigorous composition engine where designers can compose freely and inspect their design formula.

* **Form A & Form B Engine:**
  * Independent geometry pickers: circle, square, triangle, star, diamond, leaf, hexagon, pill, cross, etc.
  * Direct 2-column input controls: **Width / Height**, **Offset X / Offset Y**, and **Rotation** (direct number + precision slider).
  * Dynamic spatial synthesis through all **8 Interrelations** (detachment, touching, overlap with cutout outlines, union silhouette, boolean offscreen subtraction, intersection, and transparency penetration).
* **Stackable Modifiers Pipeline (10 Principles):**
  * Modifiers can be activated and stacked simultaneously: *Repetition, Structure, Similarity, Gradation, Radiation, Anomaly, Contrast, Concentration, Texture, Space*.
* **Active Principles Feed (Left Column):**
  * A dedicated sidebar on the left of the canvas displaying a live stack of **Study Cards**.
  * Shows the exact visual grammar formula currently active on the canvas.
  * Always keeps *CH 02 • Form & Interrelations* at the base.
  * Each active modifier card includes its chapter number, theoretical summary, real-world application hint, and direct `[×]` deactivate button.
  * Clicking any card jumps to its Theory chapter or Real World project.
* **Canvas Aspect Ratio Selector:**
  * Test compositions across multiple framing ratios directly on the canvas toolbar:
    * **1:1 Square** (600 × 600 px) — Logos, brandmarks, avatars, social icons.
    * **9:16 Story** (450 × 800 px) — Mobile stories, vertical reels, social media.
    * **4:3 Editorial** (800 × 600 px) — Magazine spreads, brochures, book jackets.
    * **3:4 Poster** (600 × 800 px) — Printed posters, flyers, placards.
    * **16:9 Cinematic** (800 × 450 px) — Panoramas, website hero banners, display headers.
* **Editorial Colophon:**
  * Live typographic readout at the bottom of the canvas displaying the exact mathematical formula in use:
    `USED ON THIS DESIGN: FORM / REPETITION / GRADATION / TEXTURE`
* **Export & Tools:**
  * Safe bounds guides (48px red architectural drafting grid), figure-ground inversion (black/white flip), reset parameters, and instant High-Res PNG export.

---

### 3. 💼 Real World: Applied Design Playgrounds

Connects abstract geometric theory to concrete graphic design challenges across 4 primary professional disciplines:

1. **Brand Identity & Logomarks (Chapter 2 & 12):**
   * Negative-space subtraction, geometric brand marks, and optical illusions (inspired by iconic marks like FedEx, Mobil, and WWF).
2. **Poster & Editorial Design (Chapters 4, 6 & 7):**
   * Swiss graphic design grids, asymmetric typographical tension, kinetic diagonal posters, and polar radiation music festival posters.
3. **Packaging & Pattern Rapport (Chapters 3, 5 & 11):**
   * Seamless brand wrapping patterns, organic kinship families, luxury cosmetic packaging, and halftone tactile rasters.
4. **Visual Hierarchy & Focal Points (Chapters 8, 9 & 10):**
   * Editorial hero section layouts, primary Call-To-Action (CTA) placements, contrast dominance, and gravitational swarming.

* **"Import into Studio" Action:** Any real-world preset can be imported with a single click directly into the Studio sandbox, loading its exact shape, offset, and modifier parameters for free manipulation!

---

## ⚙️ Mechanical Rules & Architecture Contract

To guarantee that the Studio remains an effective design tool, the editor adheres to an uncompromising rule: **"Any modifier switched ON must visually affect the canvas"**.

The application enforces the following rules (documented in detail in [`STUDIO_RULES.md`](./STUDIO_RULES.md)):

1. **Mutual Exclusivity (Cartesian vs. Polar):**  
   *Repetition* (orthogonal Cartesian grid) and *Radiation* (polar rays/rings) represent incompatible spatial frameworks. Activating one automatically deactivates the other.
2. **Auto-Activation of Prerequisites:**  
   *Structure* modulates Cartesian grid lines; if activated without a grid, it automatically enables *Repetition*. Similarly, population-dependent modifiers (*Similarity, Gradation, Anomaly, Contrast, Concentration*) automatically activate *Repetition* if turned on in single-module mode, ensuring the canvas updates immediately.
3. **Cascade Deactivation (No Ghost Controls):**  
   If the user turns off *Repetition* (and *Radiation* is off), all grid-dependent modifiers turn off in cascade, cleanly restoring single-module mode without leaving inactive controls open.
4. **Autonomous Modifiers:**  
   *Texture* and *Space* apply directly to shapes and canvas, functioning autonomously across both single-module and multi-module grids.

For the full specification, refer to [`STUDIO_RULES.md`](./STUDIO_RULES.md).

---

## 🛠️ Technology Stack & Zero-Dependency Build

The project is built with clean, standards-compliant web technologies designed to run anywhere without heavy tooling:

* **Frontend:** Modern Vanilla JavaScript (ES6+ Modules), HTML5 Canvas 2D API, Retina HiDPI auto-scaling.
* **Styling:** Tailwind CSS with custom CSS variables for dark/light themes and Swiss/Bauhaus typography (*Space Grotesk* and *Inter*).
* **Icons:** [Lucide Icons](https://lucide.dev/).
* **Zero-Dependency Bundler (`build.py`):**  
  A built-in Python script that concatenates ES modules into `js/bundle.js` for seamless offline usage on both `http://` and `file:///` protocols without CORS restrictions.

---

## 🚀 How to Run & Develop

### 1. Online Access (GitHub Pages)
Open immediately in any browser:  
👉 **[https://dmore88.github.io/wong-df/](https://dmore88.github.io/wong-df/)**

### 2. Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/dMore88/wong-df.git
cd wong-df

# 2. Run locally (any static server, e.g. Python)
python3 -m http.server 8080

# 3. Open in your browser
# Visit http://localhost:8080
```

### 3. Modifying Code & Compiling Bundle
If you edit any JavaScript files in `js/`, recompile the standalone bundle:
```bash
python3 build.py
```

---

## 📚 References & Credits

* **Wucius Wong:** *Principles of Two-Dimensional Design* (*Fundamentos del diseño bi- y tridimensional*), Editorial Gustavo Gili.
* **Bauhaus & Swiss Graphic Design Tradition:** Josef Müller-Brockmann, Armin Hofmann, Johannes Itten, and Max Bill.

---

## 📄 License

This project is licensed under the MIT License — feel free to explore, learn, and adapt for your own creative practice.
