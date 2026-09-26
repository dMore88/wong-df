// Chapter 2: Form & The 8 Interrelations of Forms
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter2 = {
  id: 2,
  defaultParams: {
    interrelation: "overlapping", // detachment, touching, overlapping, penetration, union, subtraction, intersection, coincidence
    shapeA: "circle",
    shapeB: "square",
    sizeA: 110,
    sizeB: 110,
    offsetDistance: 70, // interactive slider or mouse drag
    invertFigureGround: false,
    outlineOnly: false,
    showLabels: true
  },

  controls: [
    {
      id: "interrelation",
      label: "Interrelation Mode",
      type: "select",
      options: [
        { value: "detachment", label: "1. Detachment (Distanciamiento)" },
        { value: "touching", label: "2. Touching (Toque)" },
        { value: "overlapping", label: "3. Overlapping (Superposición)" },
        { value: "penetration", label: "4. Penetration (Penetración / Transparency)" },
        { value: "union", label: "5. Union (Unión / Combined Silhouette)" },
        { value: "subtraction", label: "6. Subtraction (Sustracción / Negative Cut)" },
        { value: "intersection", label: "7. Intersection (Intersección / Shared Core)" },
        { value: "coincidence", label: "8. Coincidence (Coincidencia / Total Unity)" }
      ]
    },
    {
      id: "shapeA",
      label: "Primary Form (A)",
      type: "select",
      options: [
        { value: "circle", label: "Circle (Organic/Pure)" },
        { value: "square", label: "Square (Rectilinear)" },
        { value: "triangle", label: "Equilateral Triangle" }
      ]
    },
    {
      id: "shapeB",
      label: "Secondary Form (B)",
      type: "select",
      options: [
        { value: "circle", label: "Circle" },
        { value: "square", label: "Square" },
        { value: "triangle", label: "Equilateral Triangle" }
      ]
    },
    { id: "sizeA", label: "Form A Scale", type: "range", min: 40, max: 180, step: 5 },
    { id: "offsetDistance", label: "Inter-form Offset", type: "range", min: 0, max: 240, step: 2 },
    { id: "invertFigureGround", label: "Invert Figure-Ground (Negative Space)", type: "checkbox" },
    { id: "outlineOnly", label: "Wireframe / Outline Only", type: "checkbox" },
    { id: "showLabels", label: "Show Diagrammatic Annotations", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 12a: Detachment",
      description: "Two distinct shapes separated by negative void.",
      params: { interrelation: "detachment", offsetDistance: 150, sizeA: 100, sizeB: 100, invertFigureGround: false }
    },
    {
      name: "Fig. 12c: Overlapping",
      description: "One form asserts foreground dominance, occluding the rear form.",
      params: { interrelation: "overlapping", offsetDistance: 70, sizeA: 110, sizeB: 110, invertFigureGround: false }
    },
    {
      name: "Fig. 12e: Union",
      description: "Two forms coalesce into a single hybrid continuous silhouette.",
      params: { interrelation: "union", offsetDistance: 80, sizeA: 110, sizeB: 110, invertFigureGround: false }
    },
    {
      name: "Fig. 12f: Subtraction (Crescent)",
      description: "Form B cuts an invisible negative bite out of Form A.",
      params: { interrelation: "subtraction", offsetDistance: 60, sizeA: 120, sizeB: 120, invertFigureGround: false }
    },
    {
      name: "Fig. 11: Reversible Inversion",
      description: "Positive and negative figure-ground inversion across dual circles.",
      params: { interrelation: "overlapping", offsetDistance: 85, invertFigureGround: true }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const cx = width / 2;
    const cy = height / 2;
    const rA = params.sizeA;
    const rB = params.sizeB;

    // Determine actual offset based on mode or manual slider
    let dist = params.offsetDistance;
    if (params.interrelation === "detachment" && dist < rA + 20) dist = rA + 40;
    if (params.interrelation === "touching") dist = rA;
    if (params.interrelation === "coincidence") dist = 0;

    const posA = { x: cx - dist / 2, y: cy };
    const posB = { x: cx + dist / 2, y: cy };

    const fgColor = params.invertFigureGround ? palette.bg : palette.fg;
    const bgColor = params.invertFigureGround ? palette.fg : palette.bg;

    // Fill background if inverted
    if (params.invertFigureGround) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.save();

    // Helper to draw shape path
    const drawShape = (type, x, y, size) => {
      ctx.beginPath();
      if (type === "circle") {
        ctx.arc(x, y, size, 0, Math.PI * 2);
      } else if (type === "square") {
        ctx.rect(x - size, y - size, size * 2, size * 2);
      } else if (type === "triangle") {
        CanvasUtils.drawPolygon(ctx, x, y, size * 1.15, 3, -Math.PI / 2);
      }
      ctx.closePath();
    };

    if (params.outlineOnly) {
      // Wireframe analysis
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 3;
      drawShape(params.shapeA, posA.x, posA.y, rA);
      ctx.stroke();
      drawShape(params.shapeB, posB.x, posB.y, rB);
      ctx.stroke();

    } else {
      // Boolean operations simulation
      switch (params.interrelation) {
        case "detachment":
        case "touching":
          ctx.fillStyle = fgColor;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fill();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          break;

        case "overlapping":
          // Rear shape (B) with thin border to clarify occlusion
          ctx.fillStyle = fgColor;
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();

          // Foreground shape (A) with background halo/cutout to emphasize depth
          ctx.save();
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fillStyle = fgColor;
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = bgColor;
          ctx.stroke();
          ctx.restore();
          break;

        case "penetration":
          // Both shapes rendered with transparency so internal overlap is visible
          ctx.fillStyle = fgColor;
          ctx.globalAlpha = 0.45;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fill();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.lineWidth = 2;
          ctx.strokeStyle = fgColor;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.stroke();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.stroke();
          break;

        case "union":
          // Both shapes combined into single solid silhouette
          ctx.fillStyle = fgColor;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fill();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          break;

        case "subtraction":
          // Form A with Form B cut out of it
          // Offscreen canvas or composite operation
          ctx.save();
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fillStyle = fgColor;
          ctx.fill();
          ctx.globalCompositeOperation = 'destination-out';
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          ctx.restore();

          // Subtle dashed outline of the invisible cutting form
          ctx.save();
          ctx.strokeStyle = palette.accent;
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.stroke();
          ctx.restore();
          break;

        case "intersection":
          // Only the shared overlap remains
          ctx.save();
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.clip();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fillStyle = fgColor;
          ctx.fill();
          ctx.restore();

          // Subtle phantom outlines of the discarded parent forms
          ctx.save();
          ctx.strokeStyle = palette.grid;
          ctx.setLineDash([2, 4]);
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.stroke();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.stroke();
          ctx.restore();
          break;

        case "coincidence":
          ctx.fillStyle = fgColor;
          drawShape(params.shapeA, cx, cy, rA);
          ctx.fill();
          break;
      }
    }

    // Annotations
    if (params.showLabels) {
      ctx.fillStyle = palette.accent;
      ctx.font = "12px monospace";
      ctx.fillText(`MODE: ${params.interrelation.toUpperCase()}`, 30, height - 35);
      ctx.font = "11px sans-serif";
      ctx.fillStyle = fgColor;
      ctx.fillText(`Form A: ${params.shapeA} | Form B: ${params.shapeB}`, 30, height - 18);
    }

    ctx.restore();
  }
};
