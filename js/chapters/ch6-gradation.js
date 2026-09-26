// Chapter 6: Gradation - Planar, Spatial & Shape Progressions
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter6 = {
  id: 6,
  defaultParams: {
    progressionType: "shape", // shape, size, rotation, alternating
    pathway: "parallel", // parallel, concentric, zigzag
    stepsX: 8,
    stepsY: 8,
    velocity: "linear", // linear, accelerated, decelerated
    startShape: "circle",
    endShape: "triangle",
    maxRotation: 180,
    alternatingInvert: true
  },

  controls: [
    {
      id: "progressionType",
      label: "Gradation Type",
      type: "select",
      options: [
        { value: "shape", label: "Fig. 36: Shape Gradation (Circle → Triangle)" },
        { value: "size", label: "Fig. 35d: Spatial Gradation (Scale / Distance)" },
        { value: "rotation", label: "Fig. 35a: Planar Rotation Gradation" },
        { value: "alternating", label: "Fig. 43: Alternating Dual Gradation" }
      ]
    },
    {
      id: "pathway",
      label: "Movement Pathway",
      type: "select",
      options: [
        { value: "parallel", label: "Fig. 39: Parallel Movement" },
        { value: "concentric", label: "Fig. 40: Concentric Movement" },
        { value: "zigzag", label: "Fig. 41: Zigzag Movement" }
      ]
    },
    { id: "stepsX", label: "Horizontal Steps (Columns)", type: "range", min: 4, max: 16, step: 1 },
    { id: "stepsY", label: "Vertical Steps (Rows)", type: "range", min: 4, max: 16, step: 1 },
    { id: "maxRotation", label: "Max Rotation Span", type: "range", min: 0, max: 360, step: 15, unit: "°" },
    { id: "alternatingInvert", label: "Interlace Alternating Contrast", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 36: Morphing Circle to Triangle",
      description: "Shape transition across rows with subtle intermediate rounded apexes.",
      params: { progressionType: "shape", pathway: "parallel", stepsX: 10, stepsY: 6, startShape: "circle", endShape: "triangle" }
    },
    {
      name: "Fig. 40: Concentric Spatial Tunnel",
      description: "Modules shrink rapidly toward the center, creating deep illusory perspective.",
      params: { progressionType: "size", pathway: "concentric", stepsX: 9, stepsY: 9 }
    },
    {
      name: "Fig. 43b: Opposing Alternating Flow",
      description: "Even rows expand while odd rows contract in counterpoint rhythm.",
      params: { progressionType: "alternating", pathway: "parallel", stepsX: 10, stepsY: 8, alternatingInvert: true }
    },
    {
      name: "Fig. 47d: Op-Art Dynamic Wave",
      description: "Wave gradation generating visual ripple across a dense matrix.",
      params: { progressionType: "rotation", pathway: "zigzag", stepsX: 12, stepsY: 12, maxRotation: 270 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const cols = params.stepsX;
    const rows = params.stepsY;
    const stepX = width / cols;
    const stepY = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = stepX * (c + 0.5);
        const y = stepY * (r + 0.5);

        // Calculate progress t from 0.0 to 1.0 depending on pathway
        let t = 0;
        if (params.pathway === "parallel") {
          t = (c / (cols - 1) + r / (rows - 1)) / 2;
        } else if (params.pathway === "concentric") {
          const normX = (c - (cols - 1) / 2) / ((cols - 1) / 2);
          const normY = (r - (rows - 1) / 2) / ((rows - 1) / 2);
          t = Math.sqrt(normX * normX + normY * normY) / Math.SQRT2;
          t = Math.min(1.0, Math.max(0.0, t));
        } else if (params.pathway === "zigzag") {
          const colProg = (r % 2 === 0) ? (c / (cols - 1)) : (1 - c / (cols - 1));
          t = (colProg + r / (rows - 1)) / 2;
        }

        // Alternating logic
        if (params.progressionType === "alternating" && r % 2 === 1) {
          t = 1.0 - t;
        }

        ctx.save();
        ctx.translate(x, y);

        const isEven = (r + c) % 2 === 0;
        const cellFg = (params.alternatingInvert && !isEven && params.progressionType === "alternating")
          ? palette.accent : palette.fg;

        ctx.fillStyle = cellFg;
        ctx.strokeStyle = cellFg;

        // Render based on progression type
        const maxR = Math.min(stepX, stepY) * 0.42;

        if (params.progressionType === "rotation") {
          const angle = (t * params.maxRotation * Math.PI) / 180;
          ctx.rotate(angle);
          ctx.fillRect(-maxR * 0.75, -maxR * 0.75, maxR * 1.5, maxR * 1.5);

        } else if (params.progressionType === "size") {
          const currentR = maxR * (0.15 + 0.85 * t);
          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.fill();

        } else if (params.progressionType === "shape" || params.progressionType === "alternating") {
          // Morph between circle (t=0) and sharp triangle/square (t=1)
          const currentR = maxR * (0.35 + 0.65 * (1 - t * 0.2));
          this.drawMorphedShape(ctx, currentR, t);
        }

        ctx.restore();
      }
    }
  },

  drawMorphedShape(ctx, radius, t) {
    // Morph between 3-sided triangle and circle smoothly
    const pts = 36;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const angle = (i * 2 * Math.PI) / pts - Math.PI / 2;
      // Circle radius
      const rCircle = radius;
      // Triangle radius formula
      const triAngle = (angle + Math.PI / 2) % ((2 * Math.PI) / 3) - Math.PI / 3;
      const rTri = (radius * Math.cos(Math.PI / 3)) / Math.max(0.1, Math.cos(triAngle));
      const rCurrent = rCircle * (1 - t) + Math.min(radius * 1.5, rTri) * t;

      const px = Math.cos(angle) * rCurrent;
      const py = Math.sin(angle) * rCurrent;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
};
