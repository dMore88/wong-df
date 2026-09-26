// Chapter 9: Contrast - Opposites, Dominance, Emphasis & Dynamic Equilibrium
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter9 = {
  id: 9,
  defaultParams: {
    contrastType: "scale", // scale, shape, direction, dominance
    dominanceRatio: 85, // % occupied by majority
    elementCount: 28,
    majorityShape: "rectilinear", // rectilinear vs organic
    minorityShape: "curvilinear",
    showBalanceScale: true
  },

  controls: [
    {
      id: "contrastType",
      label: "Contrast Dimension",
      type: "select",
      options: [
        { value: "scale", label: "Fig. 59b: Contrast of Scale (Monolith vs. Micro)" },
        { value: "shape", label: "Fig. 59a: Contrast of Shape (Curvilinear vs. Rectilinear)" },
        { value: "direction", label: "Fig. 59e: Contrast of Direction (Orthogonal vs. Acute)" },
        { value: "dominance", label: "Fig. 63a: Dominance & Emphasis (Visual Weight Balance)" }
      ]
    },
    { id: "dominanceRatio", label: "Dominance Ratio (Majority %)", type: "range", min: 60, max: 95, step: 1, unit: "%" },
    { id: "elementCount", label: "Element Count", type: "range", min: 10, max: 60, step: 2 },
    { id: "showBalanceScale", label: "Show Dynamic Visual Weight Gauge", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 63a: Heavy Monoliths & Micro Dots",
      description: "Dominant rectilinear slabs paired with a tiny cluster of floating circular accents.",
      params: { contrastType: "dominance", dominanceRatio: 90, elementCount: 22 }
    },
    {
      name: "Fig. 59a: Curvilinear vs Rectilinear",
      description: "Organic soft blobs clashing with sharp mathematical rectangles.",
      params: { contrastType: "shape", dominanceRatio: 75, elementCount: 26 }
    },
    {
      name: "Fig. 61b: Asymmetric Balance",
      description: "A large mass near the fulcrum counterbalanced by a small mass far on the opposite arm.",
      params: { contrastType: "scale", dominanceRatio: 85, elementCount: 16 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 45);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();

    if (params.contrastType === "dominance" || params.contrastType === "scale") {
      // Large dominant forms anchoring the composition
      ctx.fillStyle = palette.fg;

      // Dominant slab
      const slabW = width * 0.45;
      const slabH = height * 0.55;
      ctx.fillRect(cx - slabW * 0.65, cy - slabH * 0.5, slabW, slabH);

      // Secondary contrasting element (minority emphasis)
      const accentCount = Math.max(1, Math.round(params.elementCount * (1 - params.dominanceRatio / 100)));
      ctx.fillStyle = palette.accent;

      for (let i = 0; i < accentCount; i++) {
        const dotX = cx + slabW * 0.45 + (i % 3) * 28;
        const dotY = cy - slabH * 0.3 + Math.floor(i / 3) * 32;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 9, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (params.contrastType === "shape") {
      // Rectilinear bars vs organic circles
      const total = params.elementCount;
      const majCount = Math.round((total * params.dominanceRatio) / 100);
      const minCount = total - majCount;

      ctx.fillStyle = palette.fg;
      for (let i = 0; i < majCount; i++) {
        const x = 50 + (i % 6) * (width * 0.12);
        const y = 60 + Math.floor(i / 6) * 70;
        ctx.fillRect(x, y, 45, 45);
      }

      ctx.fillStyle = palette.accent;
      for (let j = 0; j < minCount; j++) {
        const x = width * 0.72 + (j % 2) * 55;
        const y = height * 0.4 + Math.floor(j / 2) * 65;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (params.contrastType === "direction") {
      // Rigid vertical beams vs acute diagonal slashes
      ctx.fillStyle = palette.fg;
      for (let i = 0; i < 7; i++) {
        ctx.fillRect(70 + i * 55, 60, 24, height - 120);
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(-width * 0.35, -18, width * 0.7, 36);
      ctx.restore();
    }

    // Dynamic Balance Scale / Gauge at the bottom (Fig. 61)
    if (params.showBalanceScale) {
      const baseY = height - 35;
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 150, baseY);
      ctx.lineTo(cx + 150, baseY);
      ctx.stroke();

      // Fulcrum triangle
      CanvasUtils.drawPolygon(ctx, cx, baseY + 12, 12, 3, -Math.PI / 2);
      ctx.fillStyle = palette.fg;
      ctx.fill();

      // Labels
      ctx.font = "10px monospace";
      ctx.fillText(`DOMINANCE: ${params.dominanceRatio}%`, cx - 145, baseY - 8);
      ctx.fillStyle = palette.accent;
      ctx.fillText(`EMPHASIS: ${100 - params.dominanceRatio}%`, cx + 60, baseY - 8);
    }

    ctx.restore();
  }
};
