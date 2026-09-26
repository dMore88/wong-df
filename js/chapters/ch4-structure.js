// Chapter 4: Structure - Formal Grids, Active Slicing & Grid Variations
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter4 = {
  id: 4,
  defaultParams: {
    gridType: "basic", // basic, sheared, sliding, curved, zigzag
    isActive: true, // active structure cuts/clips and inverts shapes
    isVisible: true, // visible structure lines with tangible thickness
    gridLineWidth: 2,
    gridSize: 70,
    moduleShape: "c-shape", // c-shape, circle, square, diagonal-split
    moduleScale: 0.75, // relative to cell
    shearAngle: 15,
    slideOffset: 0.5,
    curveIntensity: 18,
    checkerInvert: true
  },

  controls: [
    {
      id: "gridType",
      label: "Grid Variation",
      type: "select",
      options: [
        { value: "basic", label: "Fig. 21: Basic Repetition Grid" },
        { value: "sheared", label: "Fig. 22b: Sheared / Directional Angle" },
        { value: "sliding", label: "Fig. 22c: Sliding / Staggered Rows" },
        { value: "curved", label: "Fig. 22d: Curved Structural Lines" },
        { value: "zigzag", label: "Fig. 22e: Zigzag / Bent Grid" }
      ]
    },
    {
      id: "moduleShape",
      label: "Module (Unit Form)",
      type: "select",
      options: [
        { value: "c-shape", label: "Wong's Classic C-Ring (Fig. 26a)" },
        { value: "circle", label: "Solid Circle" },
        { value: "square", label: "Rotated Square" },
        { value: "quarter", label: "Quarter Circles (Fig. 20)" }
      ]
    },
    { id: "isActive", label: "Active Structure (Clips & Inverts at Boundary)", type: "checkbox" },
    { id: "isVisible", label: "Visible Grid Lines (Measurable Caliber)", type: "checkbox" },
    { id: "gridLineWidth", label: "Structural Line Thickness", type: "range", min: 1, max: 12, step: 1 },
    { id: "gridSize", label: "Cell Size (Scale)", type: "range", min: 45, max: 120, step: 5 },
    { id: "moduleScale", label: "Module Proportion", type: "range", min: 0.3, max: 1.2, step: 0.05 },
    { id: "checkerInvert", label: "Alternating Cell Inversion", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 26a: Active Ring Inversion",
      description: "Active grid slices and inverts C-ring modules across alternating cells.",
      params: { gridType: "basic", isActive: true, isVisible: false, moduleShape: "c-shape", gridSize: 65, moduleScale: 0.85, checkerInvert: true }
    },
    {
      name: "Fig. 20a: Visible Structural Framework",
      description: "Structural lines possess strong physical caliber separating unit forms.",
      params: { gridType: "basic", isActive: false, isVisible: true, gridLineWidth: 6, moduleShape: "quarter", gridSize: 80, moduleScale: 0.75, checkerInvert: false }
    },
    {
      name: "Fig. 22c: Staggered Brick Grid",
      description: "Sliding horizontal rows creating dynamic syncopated rhythm.",
      params: { gridType: "sliding", isActive: true, isVisible: true, gridLineWidth: 2, moduleShape: "circle", gridSize: 60, moduleScale: 0.7, checkerInvert: true }
    },
    {
      name: "Fig. 22d: Curved Dynamic Weave",
      description: "Curved active lines undulating across repeating shapes.",
      params: { gridType: "curved", isActive: true, isVisible: true, gridLineWidth: 2, moduleShape: "c-shape", gridSize: 70, moduleScale: 0.8, curveIntensity: 22, checkerInvert: false }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const sz = params.gridSize;
    const cols = Math.ceil(width / sz) + 2;
    const rows = Math.ceil(height / sz) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        let x = c * sz;
        let y = r * sz;

        // Apply grid variation shifts
        if (params.gridType === "sliding") {
          if (r % 2 === 1) x += sz * params.slideOffset;
        } else if (params.gridType === "sheared") {
          x += Math.tan((params.shearAngle * Math.PI) / 180) * y;
        }

        const isEven = (r + c) % 2 === 0;
        const cellBg = (params.checkerInvert && !isEven) ? palette.fg : palette.bg;
        const cellFg = (params.checkerInvert && !isEven) ? palette.bg : palette.fg;

        ctx.save();

        if (params.isActive) {
          // In active structures, cell boundaries clip the module and invert background
          ctx.beginPath();
          if (params.gridType === "curved") {
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + sz / 2, y + params.curveIntensity, x + sz, y);
            ctx.lineTo(x + sz, y + sz);
            ctx.quadraticCurveTo(x + sz / 2, y + sz + params.curveIntensity, x, y + sz);
          } else {
            ctx.rect(x, y, sz, sz);
          }
          ctx.closePath();

          ctx.fillStyle = cellBg;
          ctx.fill();
          ctx.clip(); // Active structure clips shapes!
        }

        // Draw module inside cell
        const modCx = x + sz / 2;
        const modCy = y + sz / 2;
        const modR = (sz / 2) * params.moduleScale;

        ctx.fillStyle = cellFg;
        ctx.strokeStyle = cellFg;

        this.drawModule(ctx, modCx, modCy, modR, params.moduleShape, palette);

        ctx.restore();
      }
    }

    // Draw visible structural lines on top if enabled
    if (params.isVisible) {
      ctx.save();
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = params.gridLineWidth;

      // Vertical lines
      for (let c = 0; c <= cols; c++) {
        let x = c * sz;
        ctx.beginPath();
        if (params.gridType === "curved") {
          ctx.moveTo(x, 0);
          for (let y = 0; y <= height; y += sz) {
            ctx.quadraticCurveTo(x + params.curveIntensity, y + sz / 2, x, y + sz);
          }
        } else {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        let y = r * sz;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  drawModule(ctx, x, y, r, shape, palette) {
    ctx.save();
    ctx.translate(x, y);

    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "square") {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
    } else if (shape === "c-shape") {
      // Wucius Wong's famous cut-out C module
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 0.25, Math.PI * 1.75, false);
      ctx.arc(0, 0, r * 0.5, Math.PI * 1.75, Math.PI * 0.25, true);
      ctx.closePath();
      ctx.fill();
    } else if (shape === "quarter") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, 0, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
};
