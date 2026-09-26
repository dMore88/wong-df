// Chapter 5: Similarity - Visual Kinship, Elastic Tension & Organic Structures
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter5 = {
  id: 5,
  defaultParams: {
    method: "tension", // tension, imperfection, spatial, morphing, structure
    baseShape: "super-ellipse", // super-ellipse, teardrop, quad, pebble
    moduleCount: 36, // 6x6
    elasticity: 45, // tension/compression amount
    noiseSeed: 12,
    spatialAngle: 35, // 3D foreshortening angle
    irregularity: 30, // imperfection amount
    structureType: "grid", // grid, organic-voronoi
    fillMode: "solid"
  },

  controls: [
    {
      id: "method",
      label: "Similarity Method",
      type: "select",
      options: [
        { value: "tension", label: "Fig. 31: Tension & Compression (Elasticity)" },
        { value: "imperfection", label: "Fig. 28: Imperfection & Truncation" },
        { value: "spatial", label: "Fig. 29: Spatial Distortion (Foreshortening)" },
        { value: "structure", label: "Fig. 33: Similarity Structure (Organic Cells)" }
      ]
    },
    {
      id: "baseShape",
      label: "Base Family Form",
      type: "select",
      options: [
        { value: "super-ellipse", label: "Organic Pebble / Super-Ellipse" },
        { value: "teardrop", label: "Teardrop Form" },
        { value: "quad", label: "Rounded Quadrilateral" },
        { value: "c-shape", label: "C-Curved Hook" }
      ]
    },
    { id: "elasticity", label: "Elastic Deformation / Variation", type: "range", min: 0, max: 100, step: 2 },
    { id: "spatialAngle", label: "Spatial Tilt Angle (Foreshortening)", type: "range", min: 0, max: 75, step: 5, unit: "°" },
    { id: "irregularity", label: "Imperfection Amount", type: "range", min: 0, max: 80, step: 2 }
  ],

  presets: [
    {
      name: "Fig. 31: Elastic Tension Field",
      description: "Modules stretching and compressing under imaginary gravitational pulls.",
      params: { method: "tension", baseShape: "teardrop", elasticity: 60, spatialAngle: 20 }
    },
    {
      name: "Fig. 28: Imperfect Quadrilaterals",
      description: "Ideal squares subtly distorted with sheared corners and irregular wavering lines.",
      params: { method: "imperfection", baseShape: "quad", irregularity: 50, elasticity: 20 }
    },
    {
      name: "Fig. 29: Spatial 3D Rotation",
      description: "Identical forms tilted in 3D perspective across alternating viewing angles.",
      params: { method: "spatial", baseShape: "super-ellipse", spatialAngle: 65, elasticity: 30 }
    },
    {
      name: "Fig. 33: Organic Similarity Structure",
      description: "Semi-formal irregular network where every cell is related yet unique.",
      params: { method: "structure", baseShape: "pebble", elasticity: 40 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 45);

    const rows = 6;
    const cols = 6;
    const stepX = (width - 80) / cols;
    const stepY = (height - 80) / rows;
    const startX = 40 + stepX / 2;
    const startY = 40 + stepY / 2;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * stepX;
        const y = startY + r * stepY;

        // Pseudo-random deterministic variation based on cell coordinate
        const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
        const randA = seed - Math.floor(seed);
        const randB = Math.cos(seed) * 0.5 + 0.5;

        ctx.save();
        ctx.translate(x, y);

        if (params.method === "spatial") {
          // Spatial 3D tilt: foreshortening along varying axes
          const tiltX = Math.cos((params.spatialAngle * Math.PI) / 180 + randA * 0.8);
          const tiltY = 1.0;
          ctx.scale(Math.max(0.2, tiltX), tiltY);
          ctx.rotate(randB * Math.PI * 0.4 - 0.2);

        } else if (params.method === "tension") {
          // Tension & compression: stretching vertically or horizontally
          const stretch = 1.0 + ((randA - 0.5) * params.elasticity) / 50;
          const squash = 1.0 / stretch;
          ctx.scale(stretch, squash);
          ctx.rotate((randB - 0.5) * 0.4);

        } else if (params.method === "imperfection") {
          // Subtle shear and truncation
          const skew = ((randA - 0.5) * params.irregularity) / 80;
          ctx.transform(1, skew, 0, 1, 0, 0);
        }

        // Draw the base form with its deformation
        const baseRadius = Math.min(stepX, stepY) * 0.36;
        this.drawSimilarForm(ctx, baseRadius, params.baseShape, params, randA);

        ctx.restore();
      }
    }

    ctx.restore();
  },

  drawSimilarForm(ctx, radius, shape, params, variance) {
    ctx.beginPath();

    if (shape === "super-ellipse") {
      // Lamé curve / superellipse with organic variance
      const n = 2.5 + (variance - 0.5) * 1.5;
      const pts = 36;
      for (let i = 0; i <= pts; i++) {
        const theta = (i * 2 * Math.PI) / pts;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const px = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n) * radius;
        const py = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

    } else if (shape === "teardrop") {
      CanvasUtils.drawTeardrop(ctx, 0, 0, radius * 1.3, radius * 1.9, variance * Math.PI * 0.2);
      ctx.fill();

    } else if (shape === "quad") {
      // Deformed polygon
      const corners = 4;
      for (let i = 0; i < corners; i++) {
        const ang = (i * Math.PI) / 2 + Math.PI / 4;
        const d = radius * (1 + (variance - 0.5) * 0.35);
        const px = Math.cos(ang) * d;
        const py = Math.sin(ang) * d;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

    } else if (shape === "c-shape") {
      CanvasUtils.drawCShape(ctx, 0, 0, radius, radius * 0.45, Math.PI / 3, variance * 0.5);
      ctx.fill();
    }
  }
};
