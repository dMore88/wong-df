// Studio Composition Engine: Unified Grammar Pipeline for Wucius Wong 2D Design
import { Shapes } from './shapes.js';
import { CanvasUtils } from '../canvas-utils.js';

export const defaultStudioState = {
  // Primary Module Form A
  formA: {
    shape: "circle",
    scale: 110,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  },
  // Secondary Module Form B
  formB: {
    enabled: true,
    shape: "square",
    scale: 100,
    rotation: 0,
    offsetX: 65,
    offsetY: 0
  },
  // Interrelation between Form A and B
  interrelation: "overlapping", // detachment, touching, overlapping, penetration, union, subtraction, intersection, coincidence
  invertFigureGround: false,
  wireframe: false,

  // Modifiers Stack
  modifiers: {
    repetition: {
      enabled: false,
      gridType: "basic", // basic, sliding, sheared, curved, zigzag, triangular, alternating
      cols: 4,
      rows: 4,
      spacing: 0,
      shearAngle: 15,
      slideOffset: 0.5,
      curveIntensity: 18,
      activeClipping: false,
      showGridLines: false,
      gridLineWidth: 1.5,
      checkerInvert: false
    },
    structure: { enabled: false },
    similarity: { enabled: false },
    gradation: { enabled: false },
    radiation: { enabled: false },
    anomaly: { enabled: false },
    contrast: { enabled: false },
    concentration: { enabled: false },
    texture: { enabled: false },
    space: { enabled: false }
  },

  // Mat / Canvas display settings
  showSafeBounds: true,
  zoomLevel: 1.0
};

export class StudioEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = JSON.parse(JSON.stringify(defaultStudioState));
  }

  // Get active principles list for the editorial colophon
  getActivePrinciples() {
    const list = ["FORM"];
    if (this.state.modifiers.repetition.enabled) list.push("REPETITION");
    if (this.state.modifiers.structure.enabled) list.push("STRUCTURE");
    if (this.state.modifiers.similarity.enabled) list.push("SIMILARITY");
    if (this.state.modifiers.gradation.enabled) list.push("GRADATION");
    if (this.state.modifiers.radiation.enabled) list.push("RADIATION");
    if (this.state.modifiers.anomaly.enabled) list.push("ANOMALY");
    if (this.state.modifiers.contrast.enabled) list.push("CONTRAST");
    if (this.state.modifiers.concentration.enabled) list.push("CONCENTRATION");
    if (this.state.modifiers.texture.enabled) list.push("TEXTURE");
    if (this.state.modifiers.space.enabled) list.push("SPACE");
    return list;
  }

  getColophonString() {
    return `USED ON THIS DESIGN: ${this.getActivePrinciples().join(" / ")}`;
  }

  // Draw a single shape helper
  drawShape(ctx, shapeId, size, fgColor, strokeOnly = false, lineWidth = 2) {
    const shapeDef = Shapes[shapeId] || Shapes.circle;
    ctx.save();
    shapeDef.draw(ctx, size);

    if (strokeOnly) {
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else {
      ctx.fillStyle = fgColor;
      ctx.fill();
    }
    ctx.restore();
  }

  // Render the base unit form (Module) with interrelation operations
  renderModule(ctx, sizeMultiplier = 1, fgColor = "#111111", bgColor = "#FAFAFA", customScaleA = null, customScaleB = null) {
    const { formA, formB, interrelation, wireframe } = this.state;
    const rA = (customScaleA ?? formA.scale) * sizeMultiplier;
    const rB = (customScaleB ?? formB.scale) * sizeMultiplier;

    const ax = (formA.offsetX || 0) * sizeMultiplier;
    const ay = (formA.offsetY || 0) * sizeMultiplier;

    // If Form B is disabled, render just Form A
    if (!formB.enabled) {
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate((formA.rotation * Math.PI) / 180);
      this.drawShape(ctx, formA.shape, rA, fgColor, wireframe);
      ctx.restore();
      return;
    }

    // Determine actual offset based on interrelation mode
    let ox = formB.offsetX * sizeMultiplier;
    let oy = formB.offsetY * sizeMultiplier;

    if (interrelation === "touching") {
      const angle = Math.atan2(oy || 0.0001, ox || 1);
      const touchDist = (rA + rB) / 2;
      ox = Math.cos(angle) * touchDist;
      oy = Math.sin(angle) * touchDist;
    } else if (interrelation === "coincidence") {
      ox = ax;
      oy = ay;
    }

    ctx.save();

    // Handling 8 Interrelations
    switch (interrelation) {
      case "detachment":
      case "touching":
      case "overlapping": {
        // Draw Form A
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, formA.shape, rA, fgColor, wireframe);
        ctx.restore();

        // Draw Form B (if overlapping, add fine outline separation for clarity)
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);

        if (!wireframe && interrelation === "overlapping") {
          // Clean border cut around Form B to clearly distinguish layering
          ctx.save();
          this.drawShape(ctx, formB.shape, rB, bgColor, true, 3);
          ctx.restore();
        }

        this.drawShape(ctx, formB.shape, rB, fgColor, wireframe);
        ctx.restore();
        break;
      }

      case "union": {
        // Unified single silhouette
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, formA.shape, rA, fgColor, wireframe);
        ctx.restore();

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);
        this.drawShape(ctx, formB.shape, rB, fgColor, wireframe);
        ctx.restore();
        break;
      }

      case "subtraction": {
        // Offscreen canvas technique to cut B out of A
        const pad = Math.max(rA, rB, Math.abs(ax), Math.abs(ay), Math.abs(ox), Math.abs(oy)) * 4 + 100;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = pad;
        offCanvas.height = pad;
        const offCtx = offCanvas.getContext("2d");
        const cx = pad / 2;
        const cy = pad / 2;

        offCtx.save();
        offCtx.translate(cx + ax, cy + ay);
        offCtx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(offCtx, formA.shape, rA, fgColor, wireframe);
        offCtx.restore();

        offCtx.save();
        offCtx.translate(cx + ox, cy + oy);
        offCtx.rotate((formB.rotation * Math.PI) / 180);
        offCtx.globalCompositeOperation = "destination-out";
        this.drawShape(offCtx, formB.shape, rB, fgColor, false);
        offCtx.restore();

        ctx.drawImage(offCanvas, -cx, -cy);
        break;
      }

      case "intersection": {
        // Offscreen canvas technique: keep only overlap
        const pad = Math.max(rA, rB, Math.abs(ax), Math.abs(ay), Math.abs(ox), Math.abs(oy)) * 4 + 100;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = pad;
        offCanvas.height = pad;
        const offCtx = offCanvas.getContext("2d");
        const cx = pad / 2;
        const cy = pad / 2;

        offCtx.save();
        offCtx.translate(cx + ax, cy + ay);
        offCtx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(offCtx, formA.shape, rA, fgColor, wireframe);
        offCtx.restore();

        offCtx.save();
        offCtx.translate(cx + ox, cy + oy);
        offCtx.rotate((formB.rotation * Math.PI) / 180);
        offCtx.globalCompositeOperation = "destination-in";
        this.drawShape(offCtx, formB.shape, rB, fgColor, false);
        offCtx.restore();

        ctx.drawImage(offCanvas, -cx, -cy);
        break;
      }

      case "penetration": {
        // Transparent overlap where intersecting area reverses or shows transparency
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, formA.shape, rA, fgColor, wireframe);
        ctx.restore();

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);
        ctx.globalAlpha = 0.55;
        this.drawShape(ctx, formB.shape, rB, fgColor, wireframe);
        ctx.restore();
        break;
      }

      case "coincidence": {
        // Form B perfectly aligned over Form A
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, formA.shape, rA, fgColor, wireframe);
        ctx.restore();

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);
        this.drawShape(ctx, formB.shape, rB, bgColor, true, 2);
        ctx.restore();
        break;
      }
    }

    ctx.restore();
  }

  // Build the boundary path for a cell in the given grid variation
  buildCellPath(ctx, r, c, rows, cols, cx, cy, cellW, cellH, rep, margin) {
    ctx.beginPath();
    if (rep.gridType === "sheared") {
      const rad = (rep.shearAngle * Math.PI) / 180;
      const dxTop = -(cellH / 2) * Math.tan(rad);
      const dxBot = (cellH / 2) * Math.tan(rad);
      ctx.moveTo(cx - cellW / 2 + dxTop, cy - cellH / 2);
      ctx.lineTo(cx + cellW / 2 + dxTop, cy - cellH / 2);
      ctx.lineTo(cx + cellW / 2 + dxBot, cy + cellH / 2);
      ctx.lineTo(cx - cellW / 2 + dxBot, cy + cellH / 2);
    } else if (rep.gridType === "triangular") {
      const isUp = (r + c) % 2 === 0;
      if (isUp) {
        ctx.moveTo(cx, cy - cellH / 2);
        ctx.lineTo(cx + cellW * 0.55, cy + cellH / 2);
        ctx.lineTo(cx - cellW * 0.55, cy + cellH / 2);
      } else {
        ctx.moveTo(cx, cy + cellH / 2);
        ctx.lineTo(cx + cellW * 0.55, cy - cellH / 2);
        ctx.lineTo(cx - cellW * 0.55, cy - cellH / 2);
      }
    } else if (rep.gridType === "curved") {
      const wTop = Math.sin((r / rows) * Math.PI * 2) * rep.curveIntensity;
      const wBot = Math.sin(((r + 1) / rows) * Math.PI * 2) * rep.curveIntensity;
      const baseX = margin + c * cellW;
      ctx.moveTo(baseX + wTop, cy - cellH / 2);
      ctx.lineTo(baseX + cellW + wTop, cy - cellH / 2);
      ctx.lineTo(baseX + cellW + wBot, cy + cellH / 2);
      ctx.lineTo(baseX + wBot, cy + cellH / 2);
    } else if (rep.gridType === "zigzag") {
      const zTop = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
      const zBot = ((r + 1) % 2 === 0 ? 1 : -1) * rep.curveIntensity;
      const baseX = margin + c * cellW;
      ctx.moveTo(baseX + zTop, cy - cellH / 2);
      ctx.lineTo(baseX + cellW + zTop, cy - cellH / 2);
      ctx.lineTo(baseX + cellW + zBot, cy + cellH / 2);
      ctx.lineTo(baseX + zBot, cy + cellH / 2);
    } else {
      // Basic orthogonal, sliding, alternating
      ctx.rect(cx - cellW / 2 + 0.5, cy - cellH / 2 + 0.5, cellW - 1, cellH - 1);
    }
    ctx.closePath();
  }

  // Render the repetition grid
  renderRepetitionGrid(ctx, width, height, palette) {
    const rep = this.state.modifiers.repetition;
    const cols = Math.max(1, rep.cols);
    const rows = Math.max(1, rep.rows);

    const margin = 40;
    const usableW = width - margin * 2;
    const usableH = height - margin * 2;
    const cellW = usableW / cols;
    const cellH = usableH / rows;

    const baseScale = Math.min(cellW, cellH) * 0.45;
    const normScale = baseScale / 100;

    // Wrap in outer bounding clip so shapes never bleed outside grid canvas
    ctx.save();
    ctx.beginPath();
    ctx.rect(margin, margin, usableW, usableH);
    ctx.clip();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let cx = margin + (c + 0.5) * cellW;
        let cy = margin + (r + 0.5) * cellH;

        // Apply grid deformations to center coordinates
        if (rep.gridType === "sliding") {
          if (r % 2 === 1) cx += cellW * rep.slideOffset;
        } else if (rep.gridType === "sheared") {
          const rad = (rep.shearAngle * Math.PI) / 180;
          cx += (r - rows / 2) * Math.tan(rad) * (cellH * 0.6);
        } else if (rep.gridType === "curved") {
          const wave = Math.sin((r / rows) * Math.PI * 2) * rep.curveIntensity;
          cx += wave;
        } else if (rep.gridType === "zigzag") {
          const zig = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
          cx += zig;
        } else if (rep.gridType === "triangular") {
          if (r % 2 === 1) cx += cellW * 0.5;
        }

        ctx.save();

        const isOddCell = (r + c) % 2 === 1;
        let fgColor = palette.fg;
        let bgColor = palette.bg;

        // Checkerboard inversion
        if (rep.checkerInvert && isOddCell) {
          ctx.save();
          this.buildCellPath(ctx, r, c, rows, cols, cx, cy, cellW, cellH, rep, margin);
          ctx.fillStyle = palette.fg;
          ctx.fill();
          ctx.restore();
          fgColor = palette.bg;
          bgColor = palette.fg;
        }

        // Active clipping: restrict drawing strictly to cell boundaries
        if (rep.activeClipping) {
          this.buildCellPath(ctx, r, c, rows, cols, cx, cy, cellW, cellH, rep, margin);
          ctx.clip();
        }

        ctx.translate(cx, cy);

        // Alternating mirror / rotation
        if (rep.gridType === "alternating" && isOddCell) {
          ctx.rotate(Math.PI);
        }

        this.renderModule(ctx, normScale, fgColor, bgColor);
        ctx.restore();
      }
    }

    ctx.restore(); // end outer clip

    // Optional visible structure grid lines
    if (rep.showGridLines) {
      ctx.save();
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = rep.gridLineWidth;

      // Draw horizontal lines
      for (let r = 0; r <= rows; r++) {
        const y = margin + r * cellH;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // Draw vertical / deformed lines
      for (let c = 0; c <= cols; c++) {
        const baseX = margin + c * cellW;
        ctx.beginPath();

        if (rep.gridType === "sheared") {
          const rad = (rep.shearAngle * Math.PI) / 180;
          const topX = baseX - (rows / 2) * Math.tan(rad) * (cellH * 0.6);
          const botX = baseX + (rows / 2) * Math.tan(rad) * (cellH * 0.6);
          ctx.moveTo(topX, margin);
          ctx.lineTo(botX, height - margin);
        } else if (rep.gridType === "curved") {
          ctx.moveTo(baseX, margin);
          const steps = 30;
          for (let s = 1; s <= steps; s++) {
            const frac = s / steps;
            const y = margin + frac * usableH;
            const wave = Math.sin(frac * Math.PI * 2) * rep.curveIntensity;
            ctx.lineTo(baseX + wave, y);
          }
        } else if (rep.gridType === "zigzag") {
          ctx.moveTo(baseX, margin);
          for (let r = 0; r < rows; r++) {
            const zig = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
            ctx.lineTo(baseX + zig, margin + (r + 1) * cellH);
          }
        } else {
          ctx.moveTo(baseX, margin);
          ctx.lineTo(baseX, height - margin);
        }
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Master render method
  render(palette) {
    if (!this.canvas) return;
    const { ctx, width, height } = CanvasUtils.setupCanvas(this.canvas);

    // 1. Clear background
    ctx.save();
    ctx.fillStyle = this.state.invertFigureGround ? palette.fg : palette.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const fgColor = this.state.invertFigureGround ? palette.bg : palette.fg;
    const bgColor = this.state.invertFigureGround ? palette.fg : palette.bg;

    // 2. Architectural Guide Grid & Safe Bounds (faint red grid matching wireframe)
    if (this.state.showSafeBounds) {
      ctx.save();
      const margin = 28;

      // Draw faint red architectural coordinate grid
      ctx.strokeStyle = palette.accent;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      const gridSize = 48;
      for (let x = margin; x <= width - margin; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
      }
      for (let y = margin; y <= height - margin; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // Dashed red outer safe boundary
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      ctx.restore();
    }

    // 3. Render Pipeline
    if (this.state.modifiers.repetition.enabled) {
      this.renderRepetitionGrid(ctx, width, height, palette);
    } else {
      // Single Module Study in Center
      ctx.save();
      ctx.translate(width / 2, height / 2);
      this.renderModule(ctx, 1.25, fgColor, bgColor);
      ctx.restore();
    }

    // 4. Subtle center reference dot (when in single module mode)
    if (!this.state.modifiers.repetition.enabled) {
      ctx.save();
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
