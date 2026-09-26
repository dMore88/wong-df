// Chapter 3: Repetition - Units, Super-Units & Reflection
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter3 = {
  id: 3,
  defaultParams: {
    arrangement: "square", // linear, square, rhombic, triangular, circular
    unitCount: 4, // 2, 3, 4
    circleRadius: 36,
    interDistance: 45, // distance from center of super-unit
    rotation: 0,
    reflectX: false,
    tileRows: 4,
    tileCols: 4,
    displayMode: "tiled", // "single" supermodule or "tiled" repetition
    invertAlternating: false
  },

  controls: [
    {
      id: "displayMode",
      label: "Display Mode",
      type: "select",
      options: [
        { value: "tiled", label: "Tiled Repetition Field" },
        { value: "single", label: "Single Super-Unit Study" }
      ]
    },
    {
      id: "arrangement",
      label: "Meeting of 4 Circles (Arrangement)",
      type: "select",
      options: [
        { value: "square", label: "Fig. 15b: Square / Rectangular" },
        { value: "linear", label: "Fig. 15a: Linear Sequence" },
        { value: "rhombic", label: "Fig. 15c: Rhombic (Diamond)" },
        { value: "triangular", label: "Fig. 15d: Triangular" },
        { value: "circular", label: "Fig. 15e: Circular Radial" }
      ]
    },
    { id: "circleRadius", label: "Circle Radius", type: "range", min: 10, max: 80, step: 2 },
    { id: "interDistance", label: "Inter-Circle Distance (Offset)", type: "range", min: 0, max: 120, step: 2 },
    { id: "rotation", label: "Super-Unit Rotation", type: "range", min: 0, max: 360, step: 5, unit: "°" },
    { id: "tileRows", label: "Repetition Grid Rows", type: "range", min: 2, max: 8, step: 1 },
    { id: "tileCols", label: "Repetition Grid Columns", type: "range", min: 2, max: 8, step: 1 },
    { id: "reflectX", label: "Mirror Reflection (Alternating Cols)", type: "checkbox" },
    { id: "invertAlternating", label: "Alternating Positive/Negative Scheme", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 15b: Square Super-Unit",
      description: "Four overlapping circles positioned at the corners of a square.",
      params: { arrangement: "square", displayMode: "single", circleRadius: 65, interDistance: 50, rotation: 0 }
    },
    {
      name: "Fig. 17a: Tiled Linear Rhythm",
      description: "Dense repetition of small circular modules in strict column alignment.",
      params: { arrangement: "linear", displayMode: "tiled", circleRadius: 18, interDistance: 20, tileRows: 6, tileCols: 6 }
    },
    {
      name: "Fig. 18b: Penetrated Super-Modules",
      description: "Overlapping circles creating floral negative counter-forms.",
      params: { arrangement: "square", displayMode: "tiled", circleRadius: 32, interDistance: 30, tileRows: 4, tileCols: 4, reflectX: true }
    },
    {
      name: "Fig. 18f: Swirling Circular Unit",
      description: "Radial circular arrangement forming dynamic centrifugal pinwheels.",
      params: { arrangement: "circular", displayMode: "single", circleRadius: 70, interDistance: 45, rotation: 45 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const cx = width / 2;
    const cy = height / 2;

    if (params.displayMode === "single") {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((params.rotation * Math.PI) / 180);
      this.drawSuperUnit(ctx, 0, 0, params, palette.fg, false);
      ctx.restore();
    } else {
      // Tiled repetition field
      const rows = params.tileRows;
      const cols = params.tileCols;
      const stepX = width / cols;
      const stepY = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = stepX * (c + 0.5);
          const posY = stepY * (r + 0.5);

          const shouldMirror = params.reflectX && (c % 2 === 1);
          const shouldInvert = params.invertAlternating && ((r + c) % 2 === 1);

          const cellFg = shouldInvert ? palette.bg : palette.fg;
          const cellBg = shouldInvert ? palette.fg : palette.bg;

          ctx.save();
          ctx.translate(posX, posY);

          if (shouldInvert) {
            ctx.fillStyle = cellBg;
            ctx.fillRect(-stepX / 2, -stepY / 2, stepX, stepY);
          }

          if (shouldMirror) {
            ctx.scale(-1, 1);
          }

          ctx.rotate((params.rotation * Math.PI) / 180);
          this.drawSuperUnit(ctx, 0, 0, params, cellFg, shouldInvert);
          ctx.restore();
        }
      }
    }
  },

  drawSuperUnit(ctx, x, y, params, fgColor) {
    const d = params.interDistance;
    const r = params.circleRadius;
    const pts = [];

    switch (params.arrangement) {
      case "square":
        pts.push({ x: -d, y: -d }, { x: d, y: -d }, { x: d, y: d }, { x: -d, y: d });
        break;
      case "linear":
        pts.push({ x: -d * 1.5, y: 0 }, { x: -d * 0.5, y: 0 }, { x: d * 0.5, y: 0 }, { x: d * 1.5, y: 0 });
        break;
      case "rhombic":
        pts.push({ x: 0, y: -d * 1.4 }, { x: d * 1.4, y: 0 }, { x: 0, y: d * 1.4 }, { x: -d * 1.4, y: 0 });
        break;
      case "triangular":
        pts.push(
          { x: 0, y: -d * 1.2 },
          { x: -d, y: d * 0.7 },
          { x: d, y: d * 0.7 },
          { x: 0, y: 0 }
        );
        break;
      case "circular":
        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2;
          pts.push({ x: Math.cos(ang) * d, y: Math.sin(ang) * d });
        }
        break;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = fgColor;

    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
};
