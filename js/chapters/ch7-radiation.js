// Chapter 7: Radiation - Centrifugal, Concentric, Centripetal & Moiré Interference
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter7 = {
  id: 7,
  defaultParams: {
    radiationType: "centrifugal", // centrifugal, concentric, centripetal, spiral, moire
    rayCount: 36,
    curvature: 0, // 0 is straight, positive or negative is swirling
    apertureSize: 30, // central hole / polygon
    concentricRings: 18,
    dualCenterOffset: 60, // for moiré superposition
    lineWidth: 2,
    invertAlternatingSectors: true
  },

  controls: [
    {
      id: "radiationType",
      label: "Radiation Scheme",
      type: "select",
      options: [
        { value: "centrifugal", label: "Fig. 48: Centrifugal (Outward Rays)" },
        { value: "concentric", label: "Fig. 49: Concentric (Nested Rings / Layers)" },
        { value: "centripetal", label: "Fig. 50: Centripetal (Inward Converging)" },
        { value: "spiral", label: "Fig. 49d: Archimedean Spiral" },
        { value: "moire", label: "Fig. 51b: Dual-Center Moiré Interference" }
      ]
    },
    { id: "rayCount", label: "Ray / Sector Count", type: "range", min: 8, max: 72, step: 2 },
    { id: "curvature", label: "Swirl / Curvature Angle", type: "range", min: -90, max: 90, step: 5, unit: "°" },
    { id: "apertureSize", label: "Center Aperture Void", type: "range", min: 0, max: 120, step: 5 },
    { id: "concentricRings", label: "Concentric Layer Count", type: "range", min: 4, max: 40, step: 1 },
    { id: "dualCenterOffset", label: "Dual Center Moiré Offset", type: "range", min: 10, max: 160, step: 5 },
    { id: "invertAlternatingSectors", label: "Fill Alternating Sectors (Pie Wedge)", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 48a: Straight Centrifugal Sunburst",
      description: "Rigid straight structural lines radiating outward from a single focal origin.",
      params: { radiationType: "centrifugal", rayCount: 36, curvature: 0, apertureSize: 0, invertAlternatingSectors: true }
    },
    {
      name: "Fig. 48b: Swirling Dynamic Vortex",
      description: "Curved radiating lines creating intense optical rotation and momentum.",
      params: { radiationType: "centrifugal", rayCount: 32, curvature: 60, apertureSize: 25, invertAlternatingSectors: true }
    },
    {
      name: "Fig. 49a: Concentric Ripples",
      description: "Evenly spaced concentric circular rings enclosing a common center.",
      params: { radiationType: "concentric", concentricRings: 24, apertureSize: 10 }
    },
    {
      name: "Fig. 50a: Centripetal Inward Convergence",
      description: "Bent directional segments pointing sharply toward a central focal void.",
      params: { radiationType: "centripetal", rayCount: 24, apertureSize: 40 }
    },
    {
      name: "Fig. 51b: Dual-Center Moiré Interference",
      description: "Two offset radiation centers producing shimmering optical interference waves.",
      params: { radiationType: "moire", rayCount: 48, dualCenterOffset: 70, apertureSize: 0 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.hypot(width, height) * 0.55;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = params.lineWidth;

    if (params.radiationType === "centrifugal") {
      this.drawCentrifugal(ctx, cx, cy, maxRadius, params, palette);

    } else if (params.radiationType === "concentric") {
      this.drawConcentric(ctx, cx, cy, maxRadius, params);

    } else if (params.radiationType === "centripetal") {
      this.drawCentripetal(ctx, cx, cy, maxRadius, params);

    } else if (params.radiationType === "spiral") {
      this.drawSpiral(ctx, cx, cy, maxRadius, params);

    } else if (params.radiationType === "moire") {
      // Draw two offset radiation systems to induce Moiré fringes
      const offset = params.dualCenterOffset / 2;
      ctx.lineWidth = 1.5;
      this.drawRadialLines(ctx, cx - offset, cy, maxRadius, params.rayCount);
      this.drawRadialLines(ctx, cx + offset, cy, maxRadius, params.rayCount);
    }

    ctx.restore();
  },

  drawCentrifugal(ctx, cx, cy, maxRadius, params, palette) {
    const n = params.rayCount;
    const curveRad = (params.curvature * Math.PI) / 180;
    const rInner = params.apertureSize;

    for (let i = 0; i < n; i++) {
      const angle1 = (i * 2 * Math.PI) / n;
      const angle2 = ((i + 1) * 2 * Math.PI) / n;

      if (params.invertAlternatingSectors && i % 2 === 0) {
        // Draw filled sector wedge
        ctx.beginPath();
        if (rInner > 0) {
          ctx.arc(cx, cy, rInner, angle1, angle2, false);
          ctx.lineTo(cx + Math.cos(angle2 + curveRad) * maxRadius, cy + Math.sin(angle2 + curveRad) * maxRadius);
          ctx.arc(cx, cy, maxRadius, angle2 + curveRad, angle1 + curveRad, true);
        } else {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle1 + curveRad) * maxRadius, cy + Math.sin(angle1 + curveRad) * maxRadius);
          ctx.arc(cx, cy, maxRadius, angle1 + curveRad, angle2 + curveRad, false);
        }
        ctx.closePath();
        ctx.fill();
      } else if (!params.invertAlternatingSectors) {
        // Outline ray
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle1) * rInner, cy + Math.sin(angle1) * rInner);
        if (params.curvature !== 0) {
          const midR = maxRadius * 0.5;
          const ctrlX = cx + Math.cos(angle1 + curveRad * 0.5) * midR;
          const ctrlY = cy + Math.sin(angle1 + curveRad * 0.5) * midR;
          ctx.quadraticCurveTo(ctrlX, ctrlY, cx + Math.cos(angle1 + curveRad) * maxRadius, cy + Math.sin(angle1 + curveRad) * maxRadius);
        } else {
          ctx.lineTo(cx + Math.cos(angle1) * maxRadius, cy + Math.sin(angle1) * maxRadius);
        }
        ctx.stroke();
      }
    }
  },

  drawConcentric(ctx, cx, cy, maxRadius, params) {
    const rings = params.concentricRings;
    const step = (maxRadius - params.apertureSize) / rings;

    for (let i = 1; i <= rings; i++) {
      const r = params.apertureSize + i * step;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  drawCentripetal(ctx, cx, cy, maxRadius, params) {
    const n = params.rayCount;
    const rInner = params.apertureSize;

    for (let i = 0; i < n; i++) {
      const ang = (i * 2 * Math.PI) / n;
      const xOuter = cx + Math.cos(ang) * maxRadius;
      const yOuter = cy + Math.sin(ang) * maxRadius;

      // Inward bend toward center
      ctx.beginPath();
      ctx.moveTo(xOuter, yOuter);
      const midX = cx + Math.cos(ang + 0.3) * (maxRadius * 0.5);
      const midY = cy + Math.sin(ang + 0.3) * (maxRadius * 0.5);
      const inX = cx + Math.cos(ang) * rInner;
      const inY = cy + Math.sin(ang) * rInner;

      ctx.lineTo(midX, midY);
      ctx.lineTo(inX, inY);
      ctx.stroke();
    }
  },

  drawSpiral(ctx, cx, cy, maxRadius, params) {
    const turns = 8;
    const pts = turns * 72;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const theta = (i * 2 * Math.PI) / 72;
      const r = (theta / (turns * 2 * Math.PI)) * maxRadius;
      const x = cx + Math.cos(theta) * r;
      const y = cy + Math.sin(theta) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  drawRadialLines(ctx, cx, cy, radius, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
    }
  }
};
