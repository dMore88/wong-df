// Chapter 10: Concentration - Gathering, Scattering, Attractors & Voids
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter10 = {
  id: 10,
  defaultParams: {
    concentrationMode: "point", // point, line, free, void, super
    particleCount: 220,
    attractorPower: 65,
    dispersion: 40,
    particleType: "teardrop", // teardrop, dot, diamond
    alignToField: true,
    centerX: 0.5,
    centerY: 0.5
  },

  controls: [
    {
      id: "concentrationMode",
      label: "Concentration Structure",
      type: "select",
      options: [
        { value: "point", label: "Fig. 65a: Concentration Toward a Point" },
        { value: "void", label: "Fig. 65b: Concentration Away from a Point (Void)" },
        { value: "line", label: "Fig. 65c: Concentration Toward a Line" },
        { value: "free", label: "Fig. 65e: Free Concentration (Multiple Hotspots)" },
        { value: "super", label: "Fig. 66c: Super-concentration (Dense Cluster)" }
      ]
    },
    {
      id: "particleType",
      label: "Module Morphology",
      type: "select",
      options: [
        { value: "teardrop", label: "Directional Teardrop (Fig. 66)" },
        { value: "dot", label: "Circular Dots" },
        { value: "diamond", label: "Rhombic Diamonds" }
      ]
    },
    { id: "particleCount", label: "Module Quantity (Population)", type: "range", min: 80, max: 450, step: 10 },
    { id: "attractorPower", label: "Gathering Force (Pull)", type: "range", min: 20, max: 100, step: 2 },
    { id: "alignToField", label: "Orient Modules Along Field Direction", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 66e: Teardrop Vortex to Center",
      description: "Organic teardrop unit forms streaming rapidly toward a central gravitational vortex.",
      params: { concentrationMode: "point", particleType: "teardrop", particleCount: 260, attractorPower: 80, alignToField: true }
    },
    {
      name: "Fig. 65b: Centrifugal Void",
      description: "Modules flee the central coordinate, leaving a striking negative clearing.",
      params: { concentrationMode: "void", particleType: "dot", particleCount: 200, attractorPower: 70 }
    },
    {
      name: "Fig. 65c: Riverbank Concentration Line",
      description: "High-density gathering along a horizontal central fault.",
      params: { concentrationMode: "line", particleType: "diamond", particleCount: 240, attractorPower: 75 }
    }
  ],

  onCanvasClick(e, rect, params) {
    params.centerX = (e.clientX - rect.left) / rect.width;
    params.centerY = (e.clientY - rect.top) / rect.height;
  },

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const cx = params.centerX * width;
    const cy = params.centerY * height;
    const count = params.particleCount;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;

    // Deterministic pseudo-random generation with clustering distribution
    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 12.9898) * 43758.5453;
      const seed2 = Math.cos(i * 78.233) * 23421.631;
      const rand1 = seed1 - Math.floor(seed1);
      const rand2 = seed2 - Math.floor(seed2);

      let px, py;
      const power = params.attractorPower / 100;

      if (params.concentrationMode === "point") {
        // Power distribution clustering strongly near center
        const angle = rand1 * Math.PI * 2;
        const dist = Math.pow(rand2, 1 / (1 - power * 0.75)) * (width * 0.48);
        px = cx + Math.cos(angle) * dist;
        py = cy + Math.sin(angle) * dist;

      } else if (params.concentrationMode === "void") {
        // Void in center
        const angle = rand1 * Math.PI * 2;
        const innerVoid = 80;
        const dist = innerVoid + Math.pow(rand2, 0.6) * (width * 0.42);
        px = cx + Math.cos(angle) * dist;
        py = cy + Math.sin(angle) * dist;

      } else if (params.concentrationMode === "line") {
        px = rand1 * width;
        const yDist = Math.pow(rand2, 1 / (1 - power * 0.8)) * (height * 0.45);
        py = cy + (i % 2 === 0 ? 1 : -1) * yDist;

      } else if (params.concentrationMode === "free") {
        // Two interacting cluster centers
        const c1 = { x: width * 0.3, y: height * 0.4 };
        const c2 = { x: width * 0.7, y: height * 0.65 };
        const target = i % 2 === 0 ? c1 : c2;
        const angle = rand1 * Math.PI * 2;
        const dist = Math.pow(rand2, 2.0) * (width * 0.35);
        px = target.x + Math.cos(angle) * dist;
        py = target.y + Math.sin(angle) * dist;

      } else { // super
        const angle = rand1 * Math.PI * 2;
        const dist = Math.pow(rand2, 3.2) * (width * 0.3);
        px = cx + Math.cos(angle) * dist;
        py = cy + Math.sin(angle) * dist;
      }

      // Orientation angle pointing toward attractor center
      let angleToCenter = Math.atan2(cy - py, cx - px);
      if (!params.alignToField) angleToCenter = 0;

      // Distance factor for scale
      const distCenter = Math.hypot(px - cx, py - cy);
      const scaleFactor = Math.max(0.3, Math.min(1.4, 1.2 - distCenter / (width * 0.5)));

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angleToCenter + Math.PI / 2);

      if (params.particleType === "teardrop") {
        CanvasUtils.drawTeardrop(ctx, 0, 0, 8 * scaleFactor, 18 * scaleFactor, 0);
        ctx.fill();
      } else if (params.particleType === "dot") {
        ctx.beginPath();
        ctx.arc(0, 0, 4.5 * scaleFactor, 0, Math.PI * 2);
        ctx.fill();
      } else if (params.particleType === "diamond") {
        CanvasUtils.drawPolygon(ctx, 0, 0, 7 * scaleFactor, 4, Math.PI / 4);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }
};
