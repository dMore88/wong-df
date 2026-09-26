// Main Application Controller for Wucius Wong 2D Design Studio
import { chaptersContent } from './data/chapters-content.js';
import { CanvasUtils } from './canvas-utils.js';

// Import all 12 Two-Dimensional Chapter Modules
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

    this.currentChapterId = 1;
    this.currentPaletteKey = "monochrome";
    this.currentParams = {};
    this.viewMode = "split"; // "split", "studio", "theory"
    this.theme = "light";

    // DOM Elements
    this.canvas = document.getElementById("main-canvas");
    this.ctx = null;
    this.canvasMetrics = null;

    this.init();
  }

  init() {
    // Theme setup from preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme("dark");
    }

    this.initSidebarNav();
    this.initDropdown();
    this.initGlobalEvents();
    this.loadChapter(1);

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
  }

  initSidebarNav() {
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

      btn.addEventListener("click", () => this.loadChapter(ch.id));
      list.appendChild(btn);
    });
  }

  initDropdown() {
    const dropdown = document.getElementById("chapter-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";
    chaptersContent.forEach(ch => {
      const opt = document.createElement("option");
      opt.value = ch.id;
      opt.textContent = `Ch. ${ch.number}: ${ch.title}`;
      dropdown.appendChild(opt);
    });

    dropdown.addEventListener("change", (e) => {
      this.loadChapter(parseInt(e.target.value, 10));
    });
  }

  loadChapter(chapterId) {
    if (!this.chaptersMap[chapterId]) return;
    this.currentChapterId = chapterId;

    const module = this.chaptersMap[chapterId];
    const content = chaptersContent.find(c => c.id === chapterId);

    // Deep clone default params
    this.currentParams = JSON.parse(JSON.stringify(module.defaultParams));

    // Update Dropdown and Sidebar selection
    const dropdown = document.getElementById("chapter-dropdown");
    if (dropdown) dropdown.value = chapterId;

    document.querySelectorAll(".ch-nav-btn").forEach(btn => {
      const id = parseInt(btn.dataset.id, 10);
      if (id === chapterId) {
        btn.classList.add("bg-[var(--bg-secondary)]", "border-accent", "font-medium", "shadow-sm");
        btn.classList.remove("border-transparent");
      } else {
        btn.classList.remove("bg-[var(--bg-secondary)]", "border-accent", "font-medium", "shadow-sm");
        btn.classList.add("border-transparent");
      }
    });

    // Populate Theory Panel
    this.renderTheory(content);

    // Populate Controls and Presets
    this.renderPresets(module.presets || []);
    this.renderControls(module.controls || []);

    // Render Canvas
    this.renderCanvas();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderTheory(content) {
    document.getElementById("ch-number-badge").textContent = `CHAPTER ${content.number}`;
    document.getElementById("ch-read-time").textContent = content.readingTime;
    document.getElementById("ch-title").textContent = content.title;
    document.getElementById("ch-subtitle").textContent = content.subtitle;
    document.getElementById("ch-summary").textContent = content.summary;

    // Badges
    const conceptsBox = document.getElementById("ch-concepts-container");
    conceptsBox.innerHTML = "";
    content.keyConcepts.forEach(k => {
      const tag = document.createElement("span");
      tag.className = "concept-tag";
      tag.textContent = k;
      conceptsBox.appendChild(tag);
    });

    // Sections
    const sectionsBox = document.getElementById("ch-sections-container");
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

    // Exercise
    if (content.exercise) {
      document.getElementById("ch-exercise-title").textContent = content.exercise.title;
      document.getElementById("ch-exercise-instructions").textContent = content.exercise.instructions;
      document.getElementById("ch-exercise-goal").textContent = content.exercise.targetGoal;
    }
  }

  renderPresets(presets) {
    const container = document.getElementById("presets-container");
    if (!container) return;

    container.innerHTML = "";
    if (presets.length === 0) {
      container.innerHTML = `<span class="text-xs text-[var(--text-muted)] font-mono">No preset presets defined.</span>`;
      return;
    }

    presets.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "preset-btn text-xs font-mono px-3 py-1.5 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] transition-all";
      btn.textContent = p.name;
      btn.title = p.description || "";
      btn.addEventListener("click", () => {
        Object.assign(this.currentParams, p.params);
        this.updateControlInputs();
        this.renderCanvas();
        this.showToast(`Loaded Preset: ${p.name}`);
      });
      container.appendChild(btn);
    });
  }

  renderControls(controls) {
    const grid = document.getElementById("controls-grid");
    if (!grid) return;

    grid.innerHTML = "";
    controls.forEach(ctrl => {
      const wrapper = document.createElement("div");
      wrapper.className = "p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between gap-1.5";

      if (ctrl.type === "range") {
        const val = this.currentParams[ctrl.id] ?? ctrl.min;
        wrapper.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-medium">
            <label for="ctrl-${ctrl.id}" class="truncate text-[var(--text-primary)]">${ctrl.label}</label>
            <span id="val-${ctrl.id}" class="font-mono text-accent font-bold">${val}${ctrl.unit || ''}</span>
          </div>
          <input type="range" id="ctrl-${ctrl.id}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step || 1}" value="${val}">
        `;
        const input = wrapper.querySelector("input");
        const valDisplay = wrapper.querySelector(`#val-${ctrl.id}`);
        input.addEventListener("input", (e) => {
          const num = parseFloat(e.target.value);
          this.currentParams[ctrl.id] = num;
          valDisplay.textContent = `${num}${ctrl.unit || ''}`;
          this.renderCanvas();
        });

      } else if (ctrl.type === "select") {
        const optionsHtml = ctrl.options.map(opt => 
          `<option value="${opt.value}" ${this.currentParams[ctrl.id] === opt.value ? 'selected' : ''}>${opt.label}</option>`
        ).join("");

        wrapper.innerHTML = `
          <label for="ctrl-${ctrl.id}" class="text-[11px] font-medium text-[var(--text-primary)] truncate">${ctrl.label}</label>
          <div class="relative mt-0.5">
            <select id="ctrl-${ctrl.id}" class="w-full appearance-none bg-[var(--bg-card)] border border-[var(--border-color)] text-xs py-1 px-2 pr-6 rounded focus:outline-none focus:border-accent">
              ${optionsHtml}
            </select>
          </div>
        `;
        const select = wrapper.querySelector("select");
        select.addEventListener("change", (e) => {
          this.currentParams[ctrl.id] = e.target.value;
          this.renderCanvas();
        });

      } else if (ctrl.type === "checkbox") {
        const checked = !!this.currentParams[ctrl.id];
        wrapper.innerHTML = `
          <label class="flex items-center justify-between cursor-pointer gap-2 text-[11px] font-medium text-[var(--text-primary)]">
            <span class="truncate">${ctrl.label}</span>
            <input type="checkbox" id="ctrl-${ctrl.id}" ${checked ? 'checked' : ''}>
          </label>
        `;
        const checkbox = wrapper.querySelector("input");
        checkbox.addEventListener("change", (e) => {
          this.currentParams[ctrl.id] = e.target.checked;
          this.renderCanvas();
        });
      }

      grid.appendChild(wrapper);
    });
  }

  updateControlInputs() {
    const module = this.chaptersMap[this.currentChapterId];
    if (!module || !module.controls) return;

    module.controls.forEach(ctrl => {
      const input = document.getElementById(`ctrl-${ctrl.id}`);
      if (!input) return;

      if (ctrl.type === "range") {
        input.value = this.currentParams[ctrl.id];
        const valSpan = document.getElementById(`val-${ctrl.id}`);
        if (valSpan) valSpan.textContent = `${this.currentParams[ctrl.id]}${ctrl.unit || ''}`;
      } else if (ctrl.type === "select") {
        input.value = this.currentParams[ctrl.id];
      } else if (ctrl.type === "checkbox") {
        input.checked = !!this.currentParams[ctrl.id];
      }
    });
  }

  renderCanvas() {
    if (!this.canvas) return;
    const { ctx, width, height } = CanvasUtils.setupCanvas(this.canvas);
    this.ctx = ctx;
    this.canvasMetrics = { width, height };

    const module = this.chaptersMap[this.currentChapterId];
    const palette = CanvasUtils.palettes[this.currentPaletteKey] || CanvasUtils.palettes.monochrome;

    if (module && typeof module.render === "function") {
      module.render(ctx, width, height, this.currentParams, palette);
    }
  }

  initGlobalEvents() {
    // Canvas Click Interaction (e.g. for anomaly epicenter, concentration attractors)
    this.canvas.addEventListener("click", (e) => {
      const module = this.chaptersMap[this.currentChapterId];
      if (module && typeof module.onCanvasClick === "function") {
        const rect = this.canvas.getBoundingClientRect();
        module.onCanvasClick(e, rect, this.currentParams);
        this.renderCanvas();
        this.updateControlInputs();
      }
    });

    // Window Resize
    window.addEventListener("resize", () => {
      this.renderCanvas();
    });

    // Navigation buttons
    document.getElementById("prev-ch-btn")?.addEventListener("click", () => this.stepChapter(-1));
    document.getElementById("next-ch-btn")?.addEventListener("click", () => this.stepChapter(1));
    document.getElementById("footer-prev-btn")?.addEventListener("click", () => this.stepChapter(-1));
    document.getElementById("footer-next-btn")?.addEventListener("click", () => this.stepChapter(1));

    // Keyboard Shortcuts (Arrow keys)
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowLeft") this.stepChapter(-1);
      if (e.key === "ArrowRight") this.stepChapter(1);
    });

    // Palette Dropdown
    document.getElementById("palette-dropdown")?.addEventListener("change", (e) => {
      this.currentPaletteKey = e.target.value;
      this.renderCanvas();
    });

    // Theme Toggle
    document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    });

    // Reset Defaults Button
    document.getElementById("reset-params-btn")?.addEventListener("click", () => {
      const module = this.chaptersMap[this.currentChapterId];
      if (module) {
        this.currentParams = JSON.parse(JSON.stringify(module.defaultParams));
        this.updateControlInputs();
        this.renderCanvas();
        this.showToast("Reset to chapter defaults");
      }
    });

    // Canvas Grid Toggle
    document.getElementById("canvas-grid-toggle")?.addEventListener("click", () => {
      const keys = ["showReferenceFrame", "showGrid", "showIsometricGuides", "isVisible"];
      for (const k of keys) {
        if (this.currentParams[k] !== undefined) {
          this.currentParams[k] = !this.currentParams[k];
          break;
        }
      }
      this.updateControlInputs();
      this.renderCanvas();
      this.showToast("Toggled structural grid");
    });

    // Export PNG
    document.getElementById("export-png-btn")?.addEventListener("click", () => {
      const filename = `wong-ch${this.currentChapterId}-${Date.now()}.png`;
      CanvasUtils.exportPNG(this.canvas, filename);
      this.showToast(`Exported ${filename}`);
    });

    // Copy SVG / SVG Code
    document.getElementById("copy-svg-btn")?.addEventListener("click", () => {
      const dataUrl = this.canvas.toDataURL("image/png");
      navigator.clipboard.writeText(dataUrl).then(() => {
        this.showToast("Copied canvas data image URL to clipboard!");
      });
    });

    // Layout View Switcher
    const splitBtn = document.getElementById("view-split-btn");
    const studioBtn = document.getElementById("view-studio-btn");
    const theoryBtn = document.getElementById("view-theory-btn");
    const theoryPanel = document.getElementById("theory-panel");
    const studioPanel = document.getElementById("studio-panel");

    const updateViewButtons = (activeBtn) => {
      [splitBtn, studioBtn, theoryBtn].forEach(b => {
        b.className = "px-2.5 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)]";
      });
      activeBtn.className = "px-2.5 py-1 rounded bg-[var(--bg-card)] font-medium shadow-sm text-[var(--text-primary)]";
    };

    splitBtn?.addEventListener("click", () => {
      theoryPanel.classList.remove("hidden");
      studioPanel.classList.remove("hidden");
      updateViewButtons(splitBtn);
      this.renderCanvas();
    });

    studioBtn?.addEventListener("click", () => {
      theoryPanel.classList.add("hidden");
      studioPanel.classList.remove("hidden");
      updateViewButtons(studioBtn);
      this.renderCanvas();
    });

    theoryBtn?.addEventListener("click", () => {
      theoryPanel.classList.remove("hidden");
      studioPanel.classList.add("hidden");
      updateViewButtons(theoryBtn);
    });
  }

  stepChapter(delta) {
    let nextId = this.currentChapterId + delta;
    if (nextId < 1) nextId = 12;
    if (nextId > 12) nextId = 1;
    this.loadChapter(nextId);
  }

  showToast(msg) {
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
    }, 2400);
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WongApp();
});
