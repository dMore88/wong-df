// Main Application Controller for Wucius Wong 2D Design Studio
import { chaptersContent } from './data/chapters-content.js';
import { CanvasUtils } from './canvas-utils.js';
import { Shapes } from './studio/shapes.js';
import { StudioEngine, defaultStudioState } from './studio/studio-engine.js';

// Import all 12 Two-Dimensional Chapter Modules (for Theory reference plate)
import { Chapter1 } from './chapters/ch1-introduction.js';
import { Chapter2 } from './chapters/ch2-form.js';
import { Chapter3 } from './chapters/ch3-repetition.js';
import { Chapter4 } from './chapters/ch4-structure.js';
import { Chapter5 } from './chapters/ch5-similarity.js';
import { Chapter6 } from './chapters/ch6-gradation.js';
import { Chapter7 } from './chapters/ch7-radiation.js';
import { Chapter8 } from './chapters/ch8-anomaly.js';
import { Chapter9 } from './chapters/ch9-contrast.js';
import { Chapter10 } from './chapters/ch10-concentration.js';
import { Chapter11 } from './chapters/ch11-texture.js';
import { Chapter12 } from './chapters/ch12-space.js';

class WongApp {
  constructor() {
    this.chaptersMap = {
      1: Chapter1,
      2: Chapter2,
      3: Chapter3,
      4: Chapter4,
      5: Chapter5,
      6: Chapter6,
      7: Chapter7,
      8: Chapter8,
      9: Chapter9,
      10: Chapter10,
      11: Chapter11,
      12: Chapter12
    };

    this.currentMode = "studio"; // "studio" or "theory"
    this.currentChapterId = 1;
    this.currentPaletteKey = "monochrome";
    this.theme = "light";

    // Engines & Canvas references
    this.studioCanvas = document.getElementById("studio-canvas");
    this.theoryCanvas = document.getElementById("theory-canvas");
    this.studioEngine = new StudioEngine(this.studioCanvas);

    this.init();
  }

  init() {
    // Theme setup from preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme("dark");
    }

    this.initNavigation();
    this.initStudioShapePickers();
    this.initStudioEventListeners();
    this.initTheorySidebar();
    this.initTheoryDropdown();
    this.initGlobalEvents();

    // Default mode is Studio
    this.setMode("studio");
    this.loadTheoryChapter(1);

    // Initial lucide icons render
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark" 
        ? `<i data-lucide="sun" class="w-4 h-4"></i>` 
        : `<i data-lucide="moon" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
    this.renderCurrentView();
  }

  // ============================================================
  // NAVIGATION & VIEW MODE SWITCHING (Theory vs Studio)
  // ============================================================
  initNavigation() {
    const theoryBtn = document.getElementById("mode-theory-btn");
    const studioBtn = document.getElementById("mode-studio-btn");

    theoryBtn?.addEventListener("click", () => this.setMode("theory"));
    studioBtn?.addEventListener("click", () => this.setMode("studio"));
  }

  setMode(mode) {
    this.currentMode = mode;

    const theoryView = document.getElementById("theory-view");
    const studioView = document.getElementById("studio-view");
    const theoryBtn = document.getElementById("mode-theory-btn");
    const studioBtn = document.getElementById("mode-studio-btn");
    const theoryNav = document.getElementById("theory-chapter-nav");
    const studioHeader = document.getElementById("studio-center-header");
    const modeBadge = document.getElementById("nav-mode-badge");
    const subtitle = document.getElementById("nav-subtitle");

    if (mode === "studio") {
      theoryView?.classList.add("hidden");
      studioView?.classList.remove("hidden");

      studioBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-medium shadow-sm transition-all";
      theoryBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all";

      theoryNav?.classList.add("hidden");
      theoryNav?.classList.remove("flex");
      studioHeader?.classList.remove("hidden");
      studioHeader?.classList.add("flex");

      if (modeBadge) modeBadge.textContent = "Studio";
      if (subtitle) subtitle.textContent = "Principles of Two-Dimensional Design • Composition Studio";

      this.renderStudio();
    } else {
      studioView?.classList.add("hidden");
      theoryView?.classList.remove("hidden");

      theoryBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-medium shadow-sm transition-all";
      studioBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all";

      studioHeader?.classList.add("hidden");
      studioHeader?.classList.remove("flex");
      theoryNav?.classList.remove("hidden");
      theoryNav?.classList.add("flex");

      if (modeBadge) modeBadge.textContent = "Theory";
      if (subtitle) subtitle.textContent = "Principles of Two-Dimensional Design • Handbook & Theory";

      this.renderTheoryPlate();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderCurrentView() {
    if (this.currentMode === "studio") {
      this.renderStudio();
    } else {
      this.renderTheoryPlate();
    }
  }

  // ============================================================
  // STUDIO: COMPOSITION ENGINE & INTERFACE
  // ============================================================
  initStudioShapePickers() {
    const containerA = document.getElementById("form-a-shape-picker");
    const containerB = document.getElementById("form-b-shape-picker");

    if (!containerA || !containerB) return;

    containerA.innerHTML = "";
    containerB.innerHTML = "";

    const shapeKeys = Object.keys(Shapes);

    shapeKeys.forEach(key => {
      const shape = Shapes[key];

      // Form A button
      const btnA = document.createElement("button");
      btnA.className = `shape-btn ${this.studioEngine.state.formA.shape === key ? 'active' : ''}`;
      btnA.dataset.shape = key;
      btnA.title = shape.name;
      btnA.innerHTML = shape.iconSvg;
      btnA.addEventListener("click", () => {
        containerA.querySelectorAll(".shape-btn").forEach(b => b.classList.remove("active"));
        btnA.classList.add("active");
        this.studioEngine.state.formA.shape = key;
        const nameBadge = document.getElementById("form-a-name-badge");
        if (nameBadge) nameBadge.textContent = shape.name;
        this.renderStudio();
      });
      containerA.appendChild(btnA);

      // Form B button
      const btnB = document.createElement("button");
      btnB.className = `shape-btn ${this.studioEngine.state.formB.shape === key ? 'active' : ''}`;
      btnB.dataset.shape = key;
      btnB.title = shape.name;
      btnB.innerHTML = shape.iconSvg;
      btnB.addEventListener("click", () => {
        containerB.querySelectorAll(".shape-btn").forEach(b => b.classList.remove("active"));
        btnB.classList.add("active");
        this.studioEngine.state.formB.shape = key;
        this.renderStudio();
      });
      containerB.appendChild(btnB);
    });
  }

  initStudioEventListeners() {
    // Form A Scale & Rotation
    const scaleA = document.getElementById("input-form-a-scale");
    const rotA = document.getElementById("input-form-a-rotation");
    const valScaleA = document.getElementById("val-form-a-scale");
    const valRotA = document.getElementById("val-form-a-rotation");

    scaleA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.scale = v;
      if (valScaleA) valScaleA.textContent = v;
      this.renderStudio();
    });

    rotA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.rotation = v;
      if (valRotA) valRotA.textContent = `${v}°`;
      this.renderStudio();
    });

    // Form A Offsets
    const offXA = document.getElementById("input-form-a-offset-x");
    const offYA = document.getElementById("input-form-a-offset-y");
    const valOffXA = document.getElementById("val-form-a-offset-x");
    const valOffYA = document.getElementById("val-form-a-offset-y");

    offXA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.offsetX = v;
      if (valOffXA) valOffXA.textContent = `${v}px`;
      this.renderStudio();
    });

    offYA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.offsetY = v;
      if (valOffYA) valOffYA.textContent = `${v}px`;
      this.renderStudio();
    });

    // Form B Scale, Rotation, Offsets
    const scaleB = document.getElementById("input-form-b-scale");
    const rotB = document.getElementById("input-form-b-rotation");
    const offX = document.getElementById("input-form-b-offset-x");
    const offY = document.getElementById("input-form-b-offset-y");
    const valScaleB = document.getElementById("val-form-b-scale");
    const valRotB = document.getElementById("val-form-b-rotation");
    const valOffX = document.getElementById("val-form-b-offset-x");
    const valOffY = document.getElementById("val-form-b-offset-y");

    scaleB?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.scale = v;
      if (valScaleB) valScaleB.textContent = v;
      this.renderStudio();
    });

    rotB?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.rotation = v;
      if (valRotB) valRotB.textContent = `${v}°`;
      this.renderStudio();
    });

    offX?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.offsetX = v;
      if (valOffX) valOffX.textContent = `${v}px`;
      this.renderStudio();
    });

    offY?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.offsetY = v;
      if (valOffY) valOffY.textContent = `${v}px`;
      this.renderStudio();
    });

    // Toggle Form B Enabled/Disabled (+ to add, - to remove)
    const toggleFormBBtn = document.getElementById("toggle-form-b-btn");
    const formBStatusBadge = document.getElementById("form-b-status-badge");
    const formBControls = document.getElementById("form-b-controls");
    const formBPicker = document.getElementById("form-b-shape-picker");

    toggleFormBBtn?.addEventListener("click", () => {
      const current = this.studioEngine.state.formB.enabled;
      this.studioEngine.state.formB.enabled = !current;
      const isEnabled = this.studioEngine.state.formB.enabled;

      if (isEnabled) {
        formBStatusBadge.textContent = "Active";
        formBStatusBadge.className = "text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        formBControls.classList.remove("opacity-40", "pointer-events-none");
        formBPicker.classList.remove("opacity-40", "pointer-events-none");
        toggleFormBBtn.innerHTML = `<i data-lucide="minus" class="w-3.5 h-3.5"></i>`;
        toggleFormBBtn.title = "Deactivate Form B";
        this.showToast("Form B Activated");
      } else {
        formBStatusBadge.textContent = "Inactive";
        formBStatusBadge.className = "text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--border-color)] text-[var(--text-muted)]";
        formBControls.classList.add("opacity-40", "pointer-events-none");
        formBPicker.classList.add("opacity-40", "pointer-events-none");
        toggleFormBBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5"></i>`;
        toggleFormBBtn.title = "Activate Form B";
        this.showToast("Form B Disabled (Single Form Mode)");
      }
      if (window.lucide) window.lucide.createIcons();
      this.renderStudio();
    });

    // Interrelation Select
    const interrelationSelect = document.getElementById("interrelation-select");
    interrelationSelect?.addEventListener("change", (e) => {
      this.studioEngine.state.interrelation = e.target.value;
      this.renderStudio();
    });

    // Repetition Modifier Toggle (Accordion Expansion)
    const repToggle = document.getElementById("mod-repetition-toggle");
    const repAccordion = document.getElementById("accordion-repetition");

    repToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.repetition.enabled = isChecked;
      if (isChecked) {
        repAccordion?.classList.remove("hidden");
        if (this.studioEngine.state.modifiers.radiation.enabled) {
          this.studioEngine.state.modifiers.radiation.enabled = false;
          const radToggleEl = document.getElementById("mod-radiation-toggle");
          if (radToggleEl) radToggleEl.checked = false;
          document.getElementById("accordion-radiation")?.classList.add("hidden");
          this.showToast("Repetition active: switched to Cartesian grid (Radiation deactivated).", 4000);
        } else {
          this.showToast("Repetition Modifier Activated (Cartesian Matrix)");
        }
      } else {
        repAccordion?.classList.add("hidden");
        this.showToast("Repetition Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    // Repetition Grid Variation
    document.getElementById("rep-grid-type")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.gridType = e.target.value;
      this.renderStudio();
    });

    // Repetition Columns & Rows
    const colsInput = document.getElementById("input-rep-cols");
    const rowsInput = document.getElementById("input-rep-rows");
    const valCols = document.getElementById("val-rep-cols");
    const valRows = document.getElementById("val-rep-rows");

    colsInput?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.repetition.cols = v;
      if (valCols) valCols.textContent = v;
      this.renderStudio();
    });

    rowsInput?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.repetition.rows = v;
      if (valRows) valRows.textContent = v;
      this.renderStudio();
    });

    // Repetition Checkboxes
    document.getElementById("check-rep-active")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.activeClipping = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-rep-visible")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.showGridLines = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-rep-checker")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.checkerInvert = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Structure Modifier (Chapter 4)
    // ------------------------------------------------------------
    const structToggle = document.getElementById("mod-structure-toggle");
    const structAccordion = document.getElementById("accordion-structure");

    structToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.structure.enabled = isChecked;
      if (isChecked) {
        structAccordion?.classList.remove("hidden");
        const hasRad = this.studioEngine.state.modifiers.radiation.enabled;
        if (hasRad) {
          this.studioEngine.state.modifiers.radiation.enabled = false;
          const radToggleEl = document.getElementById("mod-radiation-toggle");
          if (radToggleEl) radToggleEl.checked = false;
          document.getElementById("accordion-radiation")?.classList.add("hidden");

          this.studioEngine.state.modifiers.repetition.enabled = true;
          const repToggleEl = document.getElementById("mod-repetition-toggle");
          if (repToggleEl) repToggleEl.checked = true;
          document.getElementById("accordion-repetition")?.classList.remove("hidden");

          this.showToast("Structure active: switched to Cartesian grid (Radiation deactivated).", 4000);
        } else {
          const hasRep = this.studioEngine.state.modifiers.repetition.enabled;
          if (!hasRep) {
            this.showToast("Structure modulates grid intervals. Activate 'Repetition' to visualize its effect on the composition.", 4200);
          } else {
            this.showToast("Structure Modifier Activated (Dual Rhythmic Intervals)");
          }
        }
      } else {
        structAccordion?.classList.add("hidden");
        this.showToast("Structure Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("struct-mode")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.structure.mode = e.target.value;
      this.renderStudio();
    });

    const colRatioInput = document.getElementById("input-struct-col-ratio");
    const rowRatioInput = document.getElementById("input-struct-row-ratio");
    const valColRatio = document.getElementById("val-struct-col-ratio");
    const valRowRatio = document.getElementById("val-struct-row-ratio");

    colRatioInput?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.modifiers.structure.colRatio = v;
      if (valColRatio) valColRatio.textContent = `${v.toFixed(1)}x`;
      this.renderStudio();
    });

    rowRatioInput?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.modifiers.structure.rowRatio = v;
      if (valRowRatio) valRowRatio.textContent = `${v.toFixed(1)}x`;
      this.renderStudio();
    });

    const checkBands = document.getElementById("check-struct-bands");
    const bandBox = document.getElementById("struct-band-box");
    checkBands?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.structure.showBands = isChecked;
      if (isChecked) bandBox?.classList.remove("hidden");
      else bandBox?.classList.add("hidden");
      this.renderStudio();
    });

    const bandThick = document.getElementById("input-struct-band-thick");
    const valBandThick = document.getElementById("val-struct-band-thick");
    bandThick?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.structure.bandThickness = v;
      if (valBandThick) valBandThick.textContent = `${v}px`;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Similarity Modifier (Chapter 5)
    // ------------------------------------------------------------
    const simToggle = document.getElementById("mod-similarity-toggle");
    const simAccordion = document.getElementById("accordion-similarity");

    simToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.similarity.enabled = isChecked;
      if (isChecked) {
        simAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Similarity operates across module families. Activate 'Repetition' or 'Radiation' to observe kinship variations.", 4200);
        } else {
          this.showToast("Similarity Modifier Activated (Kinship Fluctuation)");
        }
      } else {
        simAccordion?.classList.add("hidden");
        this.showToast("Similarity Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("sim-kinship-type")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.similarity.kinshipType = e.target.value;
      this.renderStudio();
    });

    const simIntensity = document.getElementById("input-sim-intensity");
    const valSimIntensity = document.getElementById("val-sim-intensity");
    simIntensity?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.similarity.intensity = v;
      if (valSimIntensity) valSimIntensity.textContent = `${v}%`;
      this.renderStudio();
    });

    const simJitter = document.getElementById("input-sim-jitter");
    const valSimJitter = document.getElementById("val-sim-jitter");
    simJitter?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.similarity.cellJitter = v;
      if (valSimJitter) valSimJitter.textContent = `${v}px`;
      this.renderStudio();
    });

    document.getElementById("btn-sim-shuffle")?.addEventListener("click", () => {
      this.studioEngine.state.modifiers.similarity.seed = Math.floor(Math.random() * 100000);
      this.renderStudio();
      this.showToast("Shuffled Visual Kinship Family");
    });

    // ------------------------------------------------------------
    // Gradation Modifier (Chapter 6)
    // ------------------------------------------------------------
    const gradToggle = document.getElementById("mod-gradation-toggle");
    const gradAccordion = document.getElementById("accordion-gradation");

    gradToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.gradation.enabled = isChecked;
      if (isChecked) {
        gradAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Gradation requires a progression of modules. Activate 'Repetition' or 'Radiation' to display dynamic transition on canvas.", 4200);
        } else {
          this.showToast("Gradation Modifier Activated (Progressive Dynamics)");
        }
      } else {
        gradAccordion?.classList.add("hidden");
        this.showToast("Gradation Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("grad-type")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.gradation.type = e.target.value;
      this.renderStudio();
    });

    document.getElementById("grad-pathway")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.gradation.pathway = e.target.value;
      this.renderStudio();
    });

    const gradRange = document.getElementById("input-grad-range");
    const valGradRange = document.getElementById("val-grad-range");
    gradRange?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.gradation.range = v;
      if (valGradRange) valGradRange.textContent = `${v}°`;
      this.renderStudio();
    });

    const gradCycles = document.getElementById("input-grad-cycles");
    const valGradCycles = document.getElementById("val-grad-cycles");
    gradCycles?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.gradation.steps = v;
      if (valGradCycles) valGradCycles.textContent = `${v}x`;
      this.renderStudio();
    });

    document.getElementById("check-grad-reverse")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.gradation.reverse = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Radiation Modifier (Chapter 7)
    // ------------------------------------------------------------
    const radToggle = document.getElementById("mod-radiation-toggle");
    const radAccordion = document.getElementById("accordion-radiation");

    radToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.radiation.enabled = isChecked;
      if (isChecked) {
        radAccordion?.classList.remove("hidden");
        const hadCartesian = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.structure.enabled;

        if (this.studioEngine.state.modifiers.repetition.enabled) {
          this.studioEngine.state.modifiers.repetition.enabled = false;
          const repToggleEl = document.getElementById("mod-repetition-toggle");
          if (repToggleEl) repToggleEl.checked = false;
          document.getElementById("accordion-repetition")?.classList.add("hidden");
        }
        if (this.studioEngine.state.modifiers.structure.enabled) {
          this.studioEngine.state.modifiers.structure.enabled = false;
          const structToggleEl = document.getElementById("mod-structure-toggle");
          if (structToggleEl) structToggleEl.checked = false;
          document.getElementById("accordion-structure")?.classList.add("hidden");
        }

        if (hadCartesian) {
          this.showToast("Radiation active: switched to polar system (Repetition and Structure deactivated).", 4000);
        } else {
          this.showToast("Radiation Active: Polar Structural Framework");
        }
      } else {
        radAccordion?.classList.add("hidden");
        this.showToast("Radiation Deactivated: Reverted to Base Study");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("rad-scheme")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.radiation.scheme = val;
      const twistBox = document.getElementById("rad-twist-box");
      if (twistBox) {
        if (val === "spiral") twistBox.classList.remove("opacity-40");
        else twistBox.classList.add("opacity-40");
      }
      this.renderStudio();
    });

    const radRays = document.getElementById("input-rad-rays");
    const valRadRays = document.getElementById("val-rad-rays");
    radRays?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.radiation.rays = v;
      if (valRadRays) valRadRays.textContent = `${v} rays`;
      this.renderStudio();
    });

    const radRings = document.getElementById("input-rad-rings");
    const valRadRings = document.getElementById("val-rad-rings");
    radRings?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.radiation.rings = v;
      if (valRadRings) valRadRings.textContent = `${v} rings`;
      this.renderStudio();
    });

    const radTwist = document.getElementById("input-rad-twist");
    const valRadTwist = document.getElementById("val-rad-twist");
    radTwist?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.radiation.spiralTwist = v;
      if (valRadTwist) valRadTwist.textContent = `${v}°`;
      this.renderStudio();
    });

    document.getElementById("check-rad-show-rays")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.radiation.showRays = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-rad-show-rings")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.radiation.showRings = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Anomaly Modifier (Chapter 8)
    // ------------------------------------------------------------
    const anomToggle = document.getElementById("mod-anomaly-toggle");
    const anomAccordion = document.getElementById("accordion-anomaly");

    anomToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.anomaly.enabled = isChecked;
      if (isChecked) {
        anomAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Anomaly introduces an irregular disruption. Activate 'Repetition' or 'Radiation' to establish the regular discipline.", 4500);
        } else {
          this.showToast("Anomaly Active: Irregularity Focal Tension");
        }
      } else {
        anomAccordion?.classList.add("hidden");
        this.showToast("Anomaly Deactivated: Regularity Restored");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("anom-type")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.anomaly.type = val;
      const shapeBox = document.getElementById("anom-shape-box");
      if (shapeBox) {
        if (val === "focal") shapeBox.classList.remove("hidden");
        else shapeBox.classList.add("hidden");
      }
      this.renderStudio();
    });

    const anomX = document.getElementById("input-anom-x");
    const anomY = document.getElementById("input-anom-y");
    const valAnomCoords = document.getElementById("val-anom-coords");

    const updateAnomCoordsUI = () => {
      const x = Math.round(this.studioEngine.state.modifiers.anomaly.epicenterX * 100);
      const y = Math.round(this.studioEngine.state.modifiers.anomaly.epicenterY * 100);
      if (anomX) anomX.value = x;
      if (anomY) anomY.value = y;
      if (valAnomCoords) valAnomCoords.textContent = `${x}%, ${y}%`;
    };

    anomX?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.anomaly.epicenterX = parseInt(e.target.value, 10) / 100;
      updateAnomCoordsUI();
      this.renderStudio();
    });

    anomY?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.anomaly.epicenterY = parseInt(e.target.value, 10) / 100;
      updateAnomCoordsUI();
      this.renderStudio();
    });

    const anomRadius = document.getElementById("input-anom-radius");
    const valAnomRadius = document.getElementById("val-anom-radius");
    anomRadius?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.anomaly.radius = v;
      if (valAnomRadius) valAnomRadius.textContent = `${v}px`;
      this.renderStudio();
    });

    const anomIntensity = document.getElementById("input-anom-intensity");
    const valAnomIntensity = document.getElementById("val-anom-intensity");
    anomIntensity?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.anomaly.intensity = v;
      if (valAnomIntensity) valAnomIntensity.textContent = `${v}%`;
      this.renderStudio();
    });

    document.getElementById("anom-shape")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.anomaly.anomalousShape = e.target.value;
      this.renderStudio();
    });

    document.getElementById("check-anom-highlight")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.anomaly.highlightColor = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-anom-reticle")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.anomaly.showReticle = e.target.checked;
      this.renderStudio();
    });

    // Interactive canvas click to reposition Anomaly Epicenter or Concentration Attractor
    this.studioCanvas?.addEventListener("click", (e) => {
      const rect = this.studioCanvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;

      const concAcc = document.getElementById("accordion-concentration");
      const anomAcc = document.getElementById("accordion-anomaly");

      // Prioritize the modifier whose accordion is visibly expanded
      if (this.studioEngine.state.modifiers.concentration.enabled && concAcc && !concAcc.classList.contains("hidden")) {
        this.studioEngine.state.modifiers.concentration.attractorX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.concentration.attractorY = Math.max(0.05, Math.min(0.95, clickY));
        updateConcCoordsUI();
        this.renderStudio();
      } else if (this.studioEngine.state.modifiers.anomaly.enabled && anomAcc && !anomAcc.classList.contains("hidden")) {
        this.studioEngine.state.modifiers.anomaly.epicenterX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.anomaly.epicenterY = Math.max(0.05, Math.min(0.95, clickY));
        updateAnomCoordsUI();
        this.renderStudio();
      } else if (this.studioEngine.state.modifiers.concentration.enabled) {
        this.studioEngine.state.modifiers.concentration.attractorX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.concentration.attractorY = Math.max(0.05, Math.min(0.95, clickY));
        updateConcCoordsUI();
        this.renderStudio();
      } else if (this.studioEngine.state.modifiers.anomaly.enabled) {
        this.studioEngine.state.modifiers.anomaly.epicenterX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.anomaly.epicenterY = Math.max(0.05, Math.min(0.95, clickY));
        updateAnomCoordsUI();
        this.renderStudio();
      }
    });

    // ------------------------------------------------------------
    // Contrast Modifier (Chapter 9)
    // ------------------------------------------------------------
    const contrastToggle = document.getElementById("mod-contrast-toggle");
    const contrastAccordion = document.getElementById("accordion-contrast");

    contrastToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.contrast.enabled = isChecked;
      if (isChecked) {
        contrastAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Contrast establishes visual disparity (majority vs. minority). Activate 'Repetition' or 'Radiation' to distribute across modules.", 4500);
        } else {
          this.showToast("Contrast Active: Visual Disparity & Dominance");
        }
      } else {
        contrastAccordion?.classList.add("hidden");
        this.showToast("Contrast Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("contrast-dimension")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.contrast.dimension = val;
      const scaleBox = document.getElementById("contrast-scale-box");
      const shapeBox = document.getElementById("contrast-shape-box");
      const angleBox = document.getElementById("contrast-angle-box");

      if (scaleBox) scaleBox.classList.toggle("hidden", val !== "scale");
      if (shapeBox) shapeBox.classList.toggle("hidden", val !== "shape");
      if (angleBox) angleBox.classList.toggle("hidden", val !== "direction");

      this.renderStudio();
    });

    const contrastDominance = document.getElementById("input-contrast-dominance");
    const valContrastDominance = document.getElementById("val-contrast-dominance");
    contrastDominance?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.contrast.dominanceRatio = v;
      if (valContrastDominance) valContrastDominance.textContent = `${v}%`;
      this.renderStudio();
    });

    const contrastScale = document.getElementById("input-contrast-scale");
    const valContrastScale = document.getElementById("val-contrast-scale");
    contrastScale?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.modifiers.contrast.scaleFactor = v;
      if (valContrastScale) valContrastScale.textContent = `${v.toFixed(1)}x`;
      this.renderStudio();
    });

    document.getElementById("contrast-shape")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.contrast.contrastShape = e.target.value;
      this.renderStudio();
    });

    const contrastAngle = document.getElementById("input-contrast-angle");
    const valContrastAngle = document.getElementById("val-contrast-angle");
    contrastAngle?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.contrast.angle = v;
      if (valContrastAngle) valContrastAngle.textContent = `${v}°`;
      this.renderStudio();
    });

    document.getElementById("check-contrast-highlight")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.contrast.highlightContrast = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Concentration Modifier (Chapter 10)
    // ------------------------------------------------------------
    const concToggle = document.getElementById("mod-concentration-toggle");
    const concAccordion = document.getElementById("accordion-concentration");

    concToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.concentration.enabled = isChecked;
      if (isChecked) {
        concAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Concentration gathers modules into focal clusters. Activate 'Repetition' or 'Radiation' to establish the modular field.", 4500);
        } else {
          this.showToast("Concentration Active: Gravitational Field & Density");
        }
      } else {
        concAccordion?.classList.add("hidden");
        this.showToast("Concentration Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("conc-mode")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.concentration.mode = val;
      const lineBox = document.getElementById("conc-line-axis-box");
      if (lineBox) lineBox.classList.toggle("hidden", val !== "line");
      this.renderStudio();
    });

    document.getElementById("conc-line-axis")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.lineAxis = e.target.value;
      this.renderStudio();
    });

    const updateConcCoordsUI = () => {
      const xPct = Math.round(this.studioEngine.state.modifiers.concentration.attractorX * 100);
      const yPct = Math.round(this.studioEngine.state.modifiers.concentration.attractorY * 100);
      const valCoords = document.getElementById("val-conc-coords");
      if (valCoords) valCoords.textContent = `${xPct}%, ${yPct}%`;
      const inputX = document.getElementById("input-conc-x");
      const inputY = document.getElementById("input-conc-y");
      if (inputX) inputX.value = xPct;
      if (inputY) inputY.value = yPct;
    };

    document.getElementById("input-conc-x")?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.concentration.attractorX = parseInt(e.target.value, 10) / 100;
      updateConcCoordsUI();
      this.renderStudio();
    });

    document.getElementById("input-conc-y")?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.concentration.attractorY = parseInt(e.target.value, 10) / 100;
      updateConcCoordsUI();
      this.renderStudio();
    });

    const concPower = document.getElementById("input-conc-power");
    const valConcPower = document.getElementById("val-conc-power");
    concPower?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.concentration.power = v;
      if (valConcPower) valConcPower.textContent = `${v}%`;
      this.renderStudio();
    });

    const concRadius = document.getElementById("input-conc-radius");
    const valConcRadius = document.getElementById("val-conc-radius");
    concRadius?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.concentration.radius = v;
      if (valConcRadius) valConcRadius.textContent = `${v}px`;
      this.renderStudio();
    });

    document.getElementById("check-conc-align")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.alignToField = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-conc-scale")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.densityScale = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-conc-guide")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.showAttractor = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Texture Modifier (Chapter 11)
    // ------------------------------------------------------------
    const textToggle = document.getElementById("mod-texture-toggle");
    const textAccordion = document.getElementById("accordion-texture");

    textToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.texture.enabled = isChecked;
      if (isChecked) {
        textAccordion?.classList.remove("hidden");
        this.showToast("Texture Active: Visual Surface & Tactile Grain");
      } else {
        textAccordion?.classList.add("hidden");
        this.showToast("Texture Deactivated");
      }
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("text-target")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.texture.target = e.target.value;
      this.renderStudio();
    });

    document.getElementById("text-mode")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.texture.mode = e.target.value;
      this.renderStudio();
    });

    const textDensity = document.getElementById("input-text-density");
    const valTextDensity = document.getElementById("val-text-density");
    textDensity?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.texture.density = v;
      if (valTextDensity) valTextDensity.textContent = `${v}%`;
      this.renderStudio();
    });

    const textScale = document.getElementById("input-text-scale");
    const valTextScale = document.getElementById("val-text-scale");
    textScale?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.texture.scale = v;
      if (valTextScale) valTextScale.textContent = `${v}px`;
      this.renderStudio();
    });

    const textContrast = document.getElementById("input-text-contrast");
    const valTextContrast = document.getElementById("val-text-contrast");
    textContrast?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.texture.contrast = v;
      if (valTextContrast) valTextContrast.textContent = `${v}%`;
      this.renderStudio();
    });

    // Studio Canvas Toolbar Actions
    document.getElementById("studio-bounds-toggle")?.addEventListener("click", () => {
      this.studioEngine.state.showSafeBounds = !this.studioEngine.state.showSafeBounds;
      this.renderStudio();
    });

    document.getElementById("studio-invert-toggle")?.addEventListener("click", () => {
      this.studioEngine.state.invertFigureGround = !this.studioEngine.state.invertFigureGround;
      this.renderStudio();
    });

    document.getElementById("studio-reset-btn")?.addEventListener("click", () => {
      this.studioEngine.state = JSON.parse(JSON.stringify(defaultStudioState));
      this.syncStudioControlsFromState();
      this.renderStudio();
      this.showToast("Studio Parameters Reset");
    });

    document.getElementById("studio-copy-svg-btn")?.addEventListener("click", () => {
      const dataUrl = this.studioCanvas.toDataURL("image/png");
      navigator.clipboard.writeText(dataUrl).then(() => {
        this.showToast("Canvas image copied to clipboard");
      });
    });
  }

  syncStudioControlsFromState() {
    const s = this.studioEngine.state;
    // Sliders
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setVal("input-form-a-scale", s.formA.scale);
    setText("val-form-a-scale", s.formA.scale);
    setVal("input-form-a-rotation", s.formA.rotation);
    setText("val-form-a-rotation", `${s.formA.rotation}°`);
    setVal("input-form-a-offset-x", s.formA.offsetX || 0);
    setText("val-form-a-offset-x", `${s.formA.offsetX || 0}px`);
    setVal("input-form-a-offset-y", s.formA.offsetY || 0);
    setText("val-form-a-offset-y", `${s.formA.offsetY || 0}px`);

    setVal("input-form-b-scale", s.formB.scale);
    setText("val-form-b-scale", s.formB.scale);
    setVal("input-form-b-rotation", s.formB.rotation);
    setText("val-form-b-rotation", `${s.formB.rotation}°`);
    setVal("input-form-b-offset-x", s.formB.offsetX);
    setText("val-form-b-offset-x", `${s.formB.offsetX}px`);
    setVal("input-form-b-offset-y", s.formB.offsetY);
    setText("val-form-b-offset-y", `${s.formB.offsetY}px`);

    const toggleFormBBtn = document.getElementById("toggle-form-b-btn");
    if (toggleFormBBtn) {
      toggleFormBBtn.innerHTML = s.formB.enabled
        ? `<i data-lucide="minus" class="w-3.5 h-3.5"></i>`
        : `<i data-lucide="plus" class="w-3.5 h-3.5"></i>`;
      toggleFormBBtn.title = s.formB.enabled ? "Deactivate Form B" : "Activate Form B";
    }

    setVal("interrelation-select", s.interrelation);

    const repToggle = document.getElementById("mod-repetition-toggle");
    if (repToggle) repToggle.checked = s.modifiers.repetition.enabled;

    const repAccordion = document.getElementById("accordion-repetition");
    if (repAccordion) {
      if (s.modifiers.repetition.enabled) repAccordion.classList.remove("hidden");
      else repAccordion.classList.add("hidden");
    }

    setVal("rep-grid-type", s.modifiers.repetition.gridType);
    setVal("input-rep-cols", s.modifiers.repetition.cols);
    setText("val-rep-cols", s.modifiers.repetition.cols);
    setVal("input-rep-rows", s.modifiers.repetition.rows);
    setText("val-rep-rows", s.modifiers.repetition.rows);

    const checkActive = document.getElementById("check-rep-active");
    if (checkActive) checkActive.checked = s.modifiers.repetition.activeClipping;
    const checkVis = document.getElementById("check-rep-visible");
    if (checkVis) checkVis.checked = s.modifiers.repetition.showGridLines;
    const checkCheck = document.getElementById("check-rep-checker");
    if (checkCheck) checkCheck.checked = s.modifiers.repetition.checkerInvert;

    // Structure sync
    const structToggle = document.getElementById("mod-structure-toggle");
    if (structToggle) structToggle.checked = s.modifiers.structure.enabled;
    const structAccordion = document.getElementById("accordion-structure");
    if (structAccordion) {
      if (s.modifiers.structure.enabled) structAccordion.classList.remove("hidden");
      else structAccordion.classList.add("hidden");
    }
    setVal("struct-mode", s.modifiers.structure.mode);
    setVal("input-struct-col-ratio", s.modifiers.structure.colRatio);
    setText("val-struct-col-ratio", `${s.modifiers.structure.colRatio.toFixed(1)}x`);
    setVal("input-struct-row-ratio", s.modifiers.structure.rowRatio);
    setText("val-struct-row-ratio", `${s.modifiers.structure.rowRatio.toFixed(1)}x`);
    const checkBands = document.getElementById("check-struct-bands");
    if (checkBands) checkBands.checked = s.modifiers.structure.showBands;
    const bandBox = document.getElementById("struct-band-box");
    if (bandBox) {
      if (s.modifiers.structure.showBands) bandBox.classList.remove("hidden");
      else bandBox.classList.add("hidden");
    }
    setVal("input-struct-band-thick", s.modifiers.structure.bandThickness);
    setText("val-struct-band-thick", `${s.modifiers.structure.bandThickness}px`);

    // Similarity sync
    const simToggle = document.getElementById("mod-similarity-toggle");
    if (simToggle) simToggle.checked = s.modifiers.similarity.enabled;
    const simAccordion = document.getElementById("accordion-similarity");
    if (simAccordion) {
      if (s.modifiers.similarity.enabled) simAccordion.classList.remove("hidden");
      else simAccordion.classList.add("hidden");
    }
    setVal("sim-kinship-type", s.modifiers.similarity.kinshipType);
    setVal("input-sim-intensity", s.modifiers.similarity.intensity);
    setText("val-sim-intensity", `${s.modifiers.similarity.intensity}%`);
    setVal("input-sim-jitter", s.modifiers.similarity.cellJitter);
    setText("val-sim-jitter", `${s.modifiers.similarity.cellJitter}px`);

    // Gradation sync
    const gradToggle = document.getElementById("mod-gradation-toggle");
    if (gradToggle) gradToggle.checked = s.modifiers.gradation.enabled;
    const gradAccordion = document.getElementById("accordion-gradation");
    if (gradAccordion) {
      if (s.modifiers.gradation.enabled) gradAccordion.classList.remove("hidden");
      else gradAccordion.classList.add("hidden");
    }
    setVal("grad-type", s.modifiers.gradation.type);
    setVal("grad-pathway", s.modifiers.gradation.pathway);
    setVal("input-grad-range", s.modifiers.gradation.range);
    setText("val-grad-range", `${s.modifiers.gradation.range}°`);
    setVal("input-grad-cycles", s.modifiers.gradation.steps);
    setText("val-grad-cycles", `${s.modifiers.gradation.steps}x`);
    const checkGradRev = document.getElementById("check-grad-reverse");
    if (checkGradRev) checkGradRev.checked = s.modifiers.gradation.reverse;

    // Radiation sync
    const radToggle = document.getElementById("mod-radiation-toggle");
    if (radToggle) radToggle.checked = s.modifiers.radiation.enabled;
    const radAccordion = document.getElementById("accordion-radiation");
    if (radAccordion) {
      if (s.modifiers.radiation.enabled) radAccordion.classList.remove("hidden");
      else radAccordion.classList.add("hidden");
    }
    setVal("rad-scheme", s.modifiers.radiation.scheme);
    setVal("input-rad-rays", s.modifiers.radiation.rays);
    setText("val-rad-rays", `${s.modifiers.radiation.rays} rays`);
    setVal("input-rad-rings", s.modifiers.radiation.rings);
    setText("val-rad-rings", `${s.modifiers.radiation.rings} rings`);
    setVal("input-rad-twist", s.modifiers.radiation.spiralTwist);
    setText("val-rad-twist", `${s.modifiers.radiation.spiralTwist}°`);
    const checkRadRays = document.getElementById("check-rad-show-rays");
    if (checkRadRays) checkRadRays.checked = s.modifiers.radiation.showRays;
    const checkRadRings = document.getElementById("check-rad-show-rings");
    if (checkRadRings) checkRadRings.checked = s.modifiers.radiation.showRings;
    const twistBox = document.getElementById("rad-twist-box");
    if (twistBox) {
      if (s.modifiers.radiation.scheme === "spiral") twistBox.classList.remove("opacity-40");
      else twistBox.classList.add("opacity-40");
    }

    // Anomaly sync
    const anomToggle = document.getElementById("mod-anomaly-toggle");
    if (anomToggle) anomToggle.checked = s.modifiers.anomaly.enabled;
    const anomAccordion = document.getElementById("accordion-anomaly");
    if (anomAccordion) {
      if (s.modifiers.anomaly.enabled) anomAccordion.classList.remove("hidden");
      else anomAccordion.classList.add("hidden");
    }
    setVal("anom-type", s.modifiers.anomaly.type);
    const shapeBox = document.getElementById("anom-shape-box");
    if (shapeBox) {
      if (s.modifiers.anomaly.type === "focal") shapeBox.classList.remove("hidden");
      else shapeBox.classList.add("hidden");
    }
    const xPct = Math.round((s.modifiers.anomaly.epicenterX ?? 0.5) * 100);
    const yPct = Math.round((s.modifiers.anomaly.epicenterY ?? 0.5) * 100);
    setVal("input-anom-x", xPct);
    setVal("input-anom-y", yPct);
    setText("val-anom-coords", `${xPct}%, ${yPct}%`);
    setVal("input-anom-radius", s.modifiers.anomaly.radius);
    setText("val-anom-radius", `${s.modifiers.anomaly.radius}px`);
    setVal("input-anom-intensity", s.modifiers.anomaly.intensity);
    setText("val-anom-intensity", `${s.modifiers.anomaly.intensity}%`);
    setVal("anom-shape", s.modifiers.anomaly.anomalousShape);
    const checkAnomHl = document.getElementById("check-anom-highlight");
    if (checkAnomHl) checkAnomHl.checked = s.modifiers.anomaly.highlightColor;
    const checkAnomRet = document.getElementById("check-anom-reticle");
    if (checkAnomRet) checkAnomRet.checked = s.modifiers.anomaly.showReticle;

    // Contrast sync
    const contrastToggle = document.getElementById("mod-contrast-toggle");
    if (contrastToggle) contrastToggle.checked = s.modifiers.contrast.enabled;
    const contrastAccordion = document.getElementById("accordion-contrast");
    if (contrastAccordion) {
      if (s.modifiers.contrast.enabled) contrastAccordion.classList.remove("hidden");
      else contrastAccordion.classList.add("hidden");
    }
    setVal("contrast-dimension", s.modifiers.contrast.dimension);
    const scaleBox = document.getElementById("contrast-scale-box");
    const cShapeBox = document.getElementById("contrast-shape-box");
    const angleBox = document.getElementById("contrast-angle-box");
    if (scaleBox) scaleBox.classList.toggle("hidden", s.modifiers.contrast.dimension !== "scale");
    if (cShapeBox) cShapeBox.classList.toggle("hidden", s.modifiers.contrast.dimension !== "shape");
    if (angleBox) angleBox.classList.toggle("hidden", s.modifiers.contrast.dimension !== "direction");

    setVal("input-contrast-dominance", s.modifiers.contrast.dominanceRatio);
    setText("val-contrast-dominance", `${s.modifiers.contrast.dominanceRatio}%`);
    setVal("input-contrast-scale", s.modifiers.contrast.scaleFactor);
    setText("val-contrast-scale", `${s.modifiers.contrast.scaleFactor.toFixed(1)}x`);
    setVal("contrast-shape", s.modifiers.contrast.contrastShape);
    setVal("input-contrast-angle", s.modifiers.contrast.angle);
    setText("val-contrast-angle", `${s.modifiers.contrast.angle}°`);
    const checkContrastHl = document.getElementById("check-contrast-highlight");
    if (checkContrastHl) checkContrastHl.checked = s.modifiers.contrast.highlightContrast;

    // Concentration sync
    const concToggle = document.getElementById("mod-concentration-toggle");
    if (concToggle) concToggle.checked = s.modifiers.concentration.enabled;
    const concAccordion = document.getElementById("accordion-concentration");
    if (concAccordion) {
      if (s.modifiers.concentration.enabled) concAccordion.classList.remove("hidden");
      else concAccordion.classList.add("hidden");
    }
    setVal("conc-mode", s.modifiers.concentration.mode);
    const lineAxisBox = document.getElementById("conc-line-axis-box");
    if (lineAxisBox) lineAxisBox.classList.toggle("hidden", s.modifiers.concentration.mode !== "line");
    setVal("conc-line-axis", s.modifiers.concentration.lineAxis || "horizontal");

    const concXPct = Math.round((s.modifiers.concentration.attractorX ?? 0.5) * 100);
    const concYPct = Math.round((s.modifiers.concentration.attractorY ?? 0.5) * 100);
    setVal("input-conc-x", concXPct);
    setVal("input-conc-y", concYPct);
    setText("val-conc-coords", `${concXPct}%, ${concYPct}%`);

    setVal("input-conc-power", s.modifiers.concentration.power);
    setText("val-conc-power", `${s.modifiers.concentration.power}%`);
    setVal("input-conc-radius", s.modifiers.concentration.radius);
    setText("val-conc-radius", `${s.modifiers.concentration.radius}px`);

    const checkConcAlign = document.getElementById("check-conc-align");
    if (checkConcAlign) checkConcAlign.checked = s.modifiers.concentration.alignToField;
    const checkConcScale = document.getElementById("check-conc-scale");
    if (checkConcScale) checkConcScale.checked = s.modifiers.concentration.densityScale;
    const checkConcGuide = document.getElementById("check-conc-guide");
    if (checkConcGuide) checkConcGuide.checked = s.modifiers.concentration.showAttractor;

    // Texture sync
    const textToggle = document.getElementById("mod-texture-toggle");
    if (textToggle) textToggle.checked = s.modifiers.texture.enabled;
    const textAccordion = document.getElementById("accordion-texture");
    if (textAccordion) {
      if (s.modifiers.texture.enabled) textAccordion.classList.remove("hidden");
      else textAccordion.classList.add("hidden");
    }
    setVal("text-target", s.modifiers.texture.target || "shapes");
    setVal("text-mode", s.modifiers.texture.mode);
    setVal("input-text-density", s.modifiers.texture.density);
    setText("val-text-density", `${s.modifiers.texture.density}%`);
    setVal("input-text-scale", s.modifiers.texture.scale);
    setText("val-text-scale", `${s.modifiers.texture.scale}px`);
    setVal("input-text-contrast", s.modifiers.texture.contrast);
    setText("val-text-contrast", `${s.modifiers.texture.contrast}%`);

    this.initStudioShapePickers();
    this.updateModifierDependencyWarnings();
    this.updateStudioColophon();
  }

  updateModifierDependencyWarnings() {
    const s = this.studioEngine.state;
    const hasRep = s.modifiers.repetition.enabled;
    const hasRad = s.modifiers.radiation.enabled;
    const hasGrid = hasRep || hasRad;

    const warnStruct = document.getElementById("dep-warning-structure");
    if (warnStruct) {
      if (!hasRep) {
        warnStruct.classList.remove("hidden");
      } else {
        warnStruct.classList.add("hidden");
      }
    }

    const warnSim = document.getElementById("dep-warning-similarity");
    if (warnSim) {
      if (!hasGrid) {
        warnSim.classList.remove("hidden");
      } else {
        warnSim.classList.add("hidden");
      }
    }

    const warnGrad = document.getElementById("dep-warning-gradation");
    if (warnGrad) {
      if (!hasGrid) {
        warnGrad.classList.remove("hidden");
      } else {
        warnGrad.classList.add("hidden");
      }
    }

    const warnAnom = document.getElementById("dep-warning-anomaly");
    if (warnAnom) {
      if (!hasGrid) {
        warnAnom.classList.remove("hidden");
      } else {
        warnAnom.classList.add("hidden");
      }
    }

    const warnContrast = document.getElementById("dep-warning-contrast");
    if (warnContrast) {
      if (!hasGrid) {
        warnContrast.classList.remove("hidden");
      } else {
        warnContrast.classList.add("hidden");
      }
    }

    const warnConc = document.getElementById("dep-warning-concentration");
    if (warnConc) {
      if (!hasGrid) {
        warnConc.classList.remove("hidden");
      } else {
        warnConc.classList.add("hidden");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateStudioColophon() {
    const colophon = document.getElementById("studio-colophon-text");
    if (colophon) {
      colophon.textContent = this.studioEngine.getColophonString();
    }
  }

  renderStudio() {
    if (!this.studioCanvas) return;
    const palette = CanvasUtils.palettes[this.currentPaletteKey] || CanvasUtils.palettes.monochrome;
    this.studioEngine.render(palette);
    this.updateStudioColophon();
  }

  // ============================================================
  // THEORY: HANDBOOK, READING & CLASSICAL REFERENCE PLATE
  // ============================================================
  initTheorySidebar() {
    const list = document.getElementById("chapters-nav-list");
    if (!list) return;

    list.innerHTML = "";
    chaptersContent.forEach(ch => {
      const btn = document.createElement("button");
      btn.className = `w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ch-nav-btn ${
        ch.id === this.currentChapterId 
          ? 'bg-[var(--bg-secondary)] border-accent font-medium shadow-sm' 
          : 'border-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
      }`;
      btn.dataset.id = ch.id;

      btn.innerHTML = `
        <span class="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-accent">${ch.number}</span>
        <div class="flex-1 overflow-hidden">
          <div class="text-xs font-semibold truncate text-[var(--text-primary)]">${ch.title}</div>
          <div class="text-[10px] text-[var(--text-muted)] truncate">${ch.keyConcepts.slice(0, 2).join(' • ')}</div>
        </div>
      `;

      btn.addEventListener("click", () => {
        this.loadTheoryChapter(ch.id);
      });

      list.appendChild(btn);
    });
  }

  initTheoryDropdown() {
    const dropdown = document.getElementById("chapter-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";
    chaptersContent.forEach(ch => {
      const opt = document.createElement("option");
      opt.value = ch.id;
      opt.textContent = `Ch ${ch.number}: ${ch.title}`;
      dropdown.appendChild(opt);
    });

    dropdown.addEventListener("change", (e) => {
      this.loadTheoryChapter(parseInt(e.target.value, 10));
    });
  }

  loadTheoryChapter(id) {
    this.currentChapterId = id;

    // Update Dropdown & Sidebar active highlights
    const dropdown = document.getElementById("chapter-dropdown");
    if (dropdown) dropdown.value = id;

    document.querySelectorAll(".ch-nav-btn").forEach(btn => {
      if (parseInt(btn.dataset.id, 10) === id) {
        btn.className = "w-full text-left p-2.5 rounded-lg border border-accent bg-[var(--bg-secondary)] font-medium shadow-sm flex items-start gap-2.5 ch-nav-btn";
      } else {
        btn.className = "w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-start gap-2.5 ch-nav-btn";
      }
    });

    const content = chaptersContent.find(c => c.id === id);
    if (!content) return;

    // Render Text Pedagogy
    document.getElementById("ch-number-badge").textContent = `CHAPTER ${content.number}`;
    document.getElementById("ch-read-time").textContent = content.readingTime;
    document.getElementById("ch-title").textContent = content.title;
    document.getElementById("ch-subtitle").textContent = content.subtitle;
    document.getElementById("ch-summary").textContent = content.summary;

    // Badges
    const conceptsBox = document.getElementById("ch-concepts-container");
    if (conceptsBox) {
      conceptsBox.innerHTML = "";
      content.keyConcepts.forEach(k => {
        const tag = document.createElement("span");
        tag.className = "concept-tag";
        tag.textContent = k;
        conceptsBox.appendChild(tag);
      });
    }

    // Sections
    const sectionsBox = document.getElementById("ch-sections-container");
    if (sectionsBox) {
      sectionsBox.innerHTML = "";
      content.sections.forEach(sec => {
        const div = document.createElement("div");
        div.className = "space-y-2";
        div.innerHTML = `
          <h3 class="font-display font-bold text-base text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1">${sec.heading}</h3>
          <p class="text-xs text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">${sec.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>
        `;
        sectionsBox.appendChild(div);
      });
    }

    // Exercise
    if (content.exercise) {
      document.getElementById("ch-exercise-title").textContent = content.exercise.title;
      document.getElementById("ch-exercise-instructions").textContent = content.exercise.instructions;
      document.getElementById("ch-exercise-goal").textContent = content.exercise.targetGoal;
    }

    const figTitle = document.getElementById("theory-fig-title");
    if (figTitle) {
      figTitle.textContent = `Ch ${content.number}: ${content.title}`;
    }

    this.renderTheoryPlate();
  }

  renderTheoryPlate() {
    if (!this.theoryCanvas) return;
    const { ctx, width, height } = CanvasUtils.setupCanvas(this.theoryCanvas);
    const module = this.chaptersMap[this.currentChapterId];
    const palette = CanvasUtils.palettes[this.currentPaletteKey] || CanvasUtils.palettes.monochrome;

    if (module && typeof module.render === "function") {
      const params = module.presets && module.presets.length > 0
        ? { ...module.defaultParams, ...module.presets[0].params }
        : module.defaultParams;
      module.render(ctx, width, height, params, palette);
    }
  }

  stepTheoryChapter(delta) {
    let nextId = this.currentChapterId + delta;
    if (nextId < 1) nextId = 12;
    if (nextId > 12) nextId = 1;
    this.loadTheoryChapter(nextId);
  }

  // ============================================================
  // GLOBAL APPLICATION EVENTS
  // ============================================================
  initGlobalEvents() {
    window.addEventListener("resize", () => {
      this.renderCurrentView();
    });

    // Palette Dropdown
    document.getElementById("palette-dropdown")?.addEventListener("change", (e) => {
      this.currentPaletteKey = e.target.value;
      this.renderCurrentView();
    });

    // Theme Toggle
    document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    });

    // Theory Chapter Navigation Buttons
    document.getElementById("prev-ch-btn")?.addEventListener("click", () => this.stepTheoryChapter(-1));
    document.getElementById("next-ch-btn")?.addEventListener("click", () => this.stepTheoryChapter(1));
    document.getElementById("footer-prev-btn")?.addEventListener("click", () => this.stepTheoryChapter(-1));
    document.getElementById("footer-next-btn")?.addEventListener("click", () => this.stepTheoryChapter(1));

    // Keyboard Shortcuts (Arrow keys for Theory)
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (this.currentMode === "theory") {
        if (e.key === "ArrowLeft") this.stepTheoryChapter(-1);
        if (e.key === "ArrowRight") this.stepTheoryChapter(1);
      }
    });

    // Export Button
    document.getElementById("export-top-btn")?.addEventListener("click", () => {
      const canvasToExport = this.currentMode === "studio" ? this.studioCanvas : this.theoryCanvas;
      const filename = this.currentMode === "studio"
        ? `wong-studio-composition-${Date.now()}.png`
        : `wong-ch${this.currentChapterId}-plate.png`;
      CanvasUtils.exportPNG(canvasToExport, filename);
      this.showToast(`Exported ${filename}`);
    });
  }

  showToast(msg, duration = 2800) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0");
    }, duration);
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WongApp();
});
