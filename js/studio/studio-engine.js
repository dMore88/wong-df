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
    structure: {
      enabled: false,
      mode: "rhythmic", // rhythmic (A:B:A:B cadence), compression
      colRatio: 1.8,
      rowRatio: 1.8,
      bandThickness: 3,
      showBands: false
    },
    similarity: {
      enabled: false,
      kinshipType: "distortion", // distortion, foreshortening, rotation_wobble, scale_kinship, hybrid
      intensity: 50, // 0 to 100
      cellJitter: 0, // 0 to 30
      seed: 42
    },
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
  buildCellPath(ctx, r, c, rows, cols, cx, cy, cW, cH, rep, startX) {
    ctx.beginPath();
    if (rep.gridType === "sheared") {
      const rad = (rep.shearAngle * Math.PI) / 180;
      const dxTop = -(cH / 2) * Math.tan(rad);
      const dxBot = (cH / 2) * Math.tan(rad);
      ctx.moveTo(cx - cW / 2 + dxTop, cy - cH / 2);
      ctx.lineTo(cx + cW / 2 + dxTop, cy - cH / 2);
      ctx.lineTo(cx + cW / 2 + dxBot, cy + cH / 2);
      ctx.lineTo(cx - cW / 2 + dxBot, cy + cH / 2);
    } else if (rep.gridType === "triangular") {
      const isUp = (r + c) % 2 === 0;
      if (isUp) {
        ctx.moveTo(cx, cy - cH / 2);
        ctx.lineTo(cx + cW * 0.55, cy + cH / 2);
        ctx.lineTo(cx - cW * 0.55, cy + cH / 2);
      } else {
        ctx.moveTo(cx, cy + cH / 2);
        ctx.lineTo(cx + cW * 0.55, cy - cH / 2);
        ctx.lineTo(cx - cW * 0.55, cy - cH / 2);
      }
    } else if (rep.gridType === "curved") {
      const wTop = Math.sin((r / rows) * Math.PI * 2) * rep.curveIntensity;
      const wBot = Math.sin(((r + 1) / rows) * Math.PI * 2) * rep.curveIntensity;
      const baseX = startX;
      ctx.moveTo(baseX + wTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + wTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + wBot, cy + cH / 2);
      ctx.lineTo(baseX + wBot, cy + cH / 2);
    } else if (rep.gridType === "zigzag") {
      const zTop = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
      const zBot = ((r + 1) % 2 === 0 ? 1 : -1) * rep.curveIntensity;
      const baseX = startX;
      ctx.moveTo(baseX + zTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + zTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + zBot, cy + cH / 2);
      ctx.lineTo(baseX + zBot, cy + cH / 2);
    } else {
      // Basic orthogonal, sliding, alternating
      ctx.rect(cx - cW / 2 + 0.5, cy - cH / 2 + 0.5, cW - 1, cH - 1);
    }
    ctx.closePath();
  }

  // Render the repetition / structural grid with similarity kinematics
  renderRepetitionGrid(ctx, width, height, palette) {
    const rep = this.state.modifiers.repetition;
    const struct = this.state.modifiers.structure;
    const sim = this.state.modifiers.similarity;

    const cols = Math.max(1, rep.cols);
    const rows = Math.max(1, rep.rows);

    const margin = 40;
    const usableW = width - margin * 2;
    const usableH = height - margin * 2;

    // Calculate column widths and x positions (Dual rhythmic interval support)
    const colWidths = [];
    const colX = [];
    const colStarts = [];
    if (struct.enabled && struct.mode === "rhythmic") {
      const rA = struct.colRatio;
      let weightSum = 0;
      for (let c = 0; c < cols; c++) {
        weightSum += (c % 2 === 0 ? rA : 1.0);
      }
      const unitW = usableW / weightSum;
      let currX = margin;
      for (let c = 0; c < cols; c++) {
        const w = (c % 2 === 0 ? rA : 1.0) * unitW;
        colStarts.push(currX);
        colWidths.push(w);
        colX.push(currX + w / 2);
        currX += w;
      }
    } else {
      const cellW = usableW / cols;
      for (let c = 0; c < cols; c++) {
        colStarts.push(margin + c * cellW);
        colWidths.push(cellW);
        colX.push(margin + (c + 0.5) * cellW);
      }
    }

    // Calculate row heights and y positions (Dual rhythmic interval support)
    const rowHeights = [];
    const rowY = [];
    const rowStarts = [];
    if (struct.enabled && struct.mode === "rhythmic") {
      const rA = struct.rowRatio;
      let weightSum = 0;
      for (let r = 0; r < rows; r++) {
        weightSum += (r % 2 === 0 ? rA : 1.0);
      }
      const unitH = usableH / weightSum;
      let currY = margin;
      for (let r = 0; r < rows; r++) {
        const h = (r % 2 === 0 ? rA : 1.0) * unitH;
        rowStarts.push(currY);
        rowHeights.push(h);
        rowY.push(currY + h / 2);
        currY += h;
      }
    } else {
      const cellH = usableH / rows;
      for (let r = 0; r < rows; r++) {
        rowStarts.push(margin + r * cellH);
        rowHeights.push(cellH);
        rowY.push(margin + (r + 0.5) * cellH);
      }
    }

    // Wrap in outer bounding clip so shapes never bleed outside grid canvas
    ctx.save();
    ctx.beginPath();
    ctx.rect(margin, margin, usableW, usableH);
    ctx.clip();

    const seed = sim.seed || 42;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cW = colWidths[c];
        const cH = rowHeights[r];
        let cx = colX[c];
        let cy = rowY[r];
        const startX = colStarts[c];

        // Apply grid deformations to center coordinates
        if (rep.gridType === "sliding") {
          if (r % 2 === 1) cx += cW * rep.slideOffset;
        } else if (rep.gridType === "sheared") {
          const rad = (rep.shearAngle * Math.PI) / 180;
          cx += (r - rows / 2) * Math.tan(rad) * (cH * 0.6);
        } else if (rep.gridType === "curved") {
          const wave = Math.sin((r / rows) * Math.PI * 2) * rep.curveIntensity;
          cx += wave;
        } else if (rep.gridType === "zigzag") {
          const zig = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
          cx += zig;
        } else if (rep.gridType === "triangular") {
          if (r % 2 === 1) cx += cW * 0.5;
        }

        // Similarity PRNG helper
        const pRand = (salt) => {
          const x = Math.sin(seed * 997 + r * 1337 + c * 31 + salt * 101) * 10000;
          return (x - Math.floor(x)) * 2 - 1; // -1 to 1
        };

        // Similarity: cell spatial jitter
        if (sim.enabled && sim.cellJitter > 0) {
          cx += pRand(10) * sim.cellJitter;
          cy += pRand(11) * sim.cellJitter;
        }

        ctx.save();

        const isOddCell = (r + c) % 2 === 1;
        let fgColor = palette.fg;
        let bgColor = palette.bg;

        // Checkerboard inversion
        if (rep.checkerInvert && isOddCell) {
          ctx.save();
          this.buildCellPath(ctx, r, c, rows, cols, cx, cy, cW, cH, rep, startX);
          ctx.fillStyle = palette.fg;
          ctx.fill();
          ctx.restore();
          fgColor = palette.bg;
          bgColor = palette.fg;
        }

        // Active clipping: restrict drawing strictly to cell boundaries
        if (rep.activeClipping) {
          this.buildCellPath(ctx, r, c, rows, cols, cx, cy, cW, cH, rep, startX);
          ctx.clip();
        }

        ctx.translate(cx, cy);

        // Alternating mirror / rotation
        if (rep.gridType === "alternating" && isOddCell) {
          ctx.rotate(Math.PI);
        }

        // Similarity: Module Kinship & Fluctuation
        if (sim.enabled) {
          const intensity = (sim.intensity ?? 50) / 100;
          if (sim.kinshipType === "distortion") {
            const sx = 1 + pRand(1) * intensity * 0.65;
            const sy = 1 + pRand(2) * intensity * 0.65;
            ctx.scale(sx, sy);
          } else if (sim.kinshipType === "foreshortening") {
            const rot = pRand(3) * Math.PI;
            const tilt = Math.max(0.18, 1 - Math.abs(pRand(4)) * intensity * 0.82);
            ctx.rotate(rot);
            ctx.scale(1, tilt);
            ctx.rotate(-rot);
          } else if (sim.kinshipType === "rotation_wobble") {
            const wobble = pRand(5) * intensity * (Math.PI / 2);
            ctx.rotate(wobble);
          } else if (sim.kinshipType === "scale_kinship") {
            const sFactor = Math.max(0.2, 1 + pRand(6) * intensity * 0.7);
            ctx.scale(sFactor, sFactor);
          } else if (sim.kinshipType === "hybrid") {
            const sx = 1 + pRand(1) * intensity * 0.35;
            const sy = 1 + pRand(2) * intensity * 0.35;
            const wobble = pRand(5) * intensity * 0.4;
            ctx.rotate(wobble);
            ctx.scale(sx, sy);
          }
        }

        const baseScale = Math.min(cW, cH) * 0.45;
        const normScale = baseScale / 100;
        this.renderModule(ctx, normScale, fgColor, bgColor);
        ctx.restore();
      }
    }

    ctx.restore(); // end outer clip

    // Optional visible structure grid lines
    if (rep.showGridLines || (struct.enabled && struct.showBands)) {
      ctx.save();
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = struct.enabled && struct.showBands ? struct.bandThickness : rep.gridLineWidth;

      // Draw horizontal lines
      for (let r = 0; r <= rows; r++) {
        const y = r === rows ? margin + usableH : rowStarts[r];
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // Draw vertical / deformed lines
      for (let c = 0; c <= cols; c++) {
        const baseX = c === cols ? margin + usableW : colStarts[c];
        ctx.beginPath();

        if (rep.gridType === "sheared") {
          const rad = (rep.shearAngle * Math.PI) / 180;
          const topX = baseX - (rows / 2) * Math.tan(rad) * (rowHeights[0] * 0.6);
          const botX = baseX + (rows / 2) * Math.tan(rad) * (rowHeights[0] * 0.6);
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
            ctx.lineTo(baseX + zig, margin + (r + 1) * rowHeights[r]);
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
    if (this.state.modifiers.repetition.enabled || this.state.modifiers.structure.enabled) {
      this.renderRepetitionGrid(ctx, width, height, palette);
    } else {
      // Single Module Study in Center
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // If similarity is active on single module, apply kinship transform
      const sim = this.state.modifiers.similarity;
      if (sim.enabled) {
        const intensity = (sim.intensity ?? 50) / 100;
        if (sim.kinshipType === "distortion") {
          ctx.scale(1 + intensity * 0.45, 1 - intensity * 0.25);
        } else if (sim.kinshipType === "foreshortening") {
          ctx.rotate(0.35);
          ctx.scale(1, Math.max(0.2, 1 - intensity * 0.75));
          ctx.rotate(-0.35);
        } else if (sim.kinshipType === "rotation_wobble") {
          ctx.rotate(intensity * 0.6);
        } else if (sim.kinshipType === "scale_kinship") {
          ctx.scale(1 + intensity * 0.4, 1 + intensity * 0.4);
        } else if (sim.kinshipType === "hybrid") {
          ctx.rotate(intensity * 0.25);
          ctx.scale(1 + intensity * 0.25, 1 - intensity * 0.15);
        }
      }

      this.renderModule(ctx, 1.25, fgColor, bgColor);
      ctx.restore();
    }

    // 4. Subtle center reference dot (when in single module mode)
    if (!this.state.modifiers.repetition.enabled && !this.state.modifiers.structure.enabled) {
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
