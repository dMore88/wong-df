// Chapter 1: Introduction - Conceptual, Visual & Relational Elements
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter1 = {
  id: 1,
  defaultParams: {
    elementType: "all", // point, line, plane, volume, all
    pointSize: 18,
    lineWidth: 4,
    lineLength: 140,
    planeSize: 90,
    gravity: 0, // -100 (floating/buoyant) to +100 (heavy/grounded)
    direction: 45, // degrees
    showReferenceFrame: true,
    showCoordinates: true,
    density: 5
  },

  controls: [
    {
      id: "elementType",
      label: "Element Classification",
      type: "select",
      options: [
        { value: "all", label: "All Elements (Point, Line, Plane, Volume)" },
        { value: "point", label: "Conceptual Point (Position without Area)" },
        { value: "line", label: "Conceptual Line (Breadthless Length)" },
        { value: "plane", label: "Conceptual Plane (Length & Breadth)" },
        { value: "volume", label: "Conceptual Volume (Illusory 3D)" }
      ]
    },
    { id: "pointSize", label: "Point Scale", type: "range", min: 4, max: 40, step: 1 },
    { id: "lineWidth", label: "Line Caliber", type: "range", min: 1, max: 20, step: 1 },
    { id: "planeSize", label: "Plane Dimension", type: "range", min: 30, max: 200, step: 5 },
    { id: "direction", label: "Relational Direction", type: "range", min: 0, max: 360, step: 5, unit: "°" },
    { id: "gravity", label: "Relational Gravity (Weight)", type: "range", min: -100, max: 100, step: 5 },
    { id: "showReferenceFrame", label: "Show Reference Frame Coordinates", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 1: Conceptual Evolution",
      description: "Point extends to line, line sweeps to plane, plane extrudes to volume.",
      params: { elementType: "all", pointSize: 14, lineWidth: 3, planeSize: 80, direction: 30, gravity: 0, showReferenceFrame: true }
    },
    {
      name: "Fig. 2: Visual Elements (Scale & Texture)",
      description: "Varying visual dimensions, tones, and silhouette weights.",
      params: { elementType: "plane", planeSize: 120, direction: 90, gravity: 50, showReferenceFrame: true }
    },
    {
      name: "Fig. 3: Relational Gravity & Tension",
      description: "Heavy mass suspended against the baseline of the frame.",
      params: { elementType: "point", pointSize: 36, direction: 0, gravity: 90, showReferenceFrame: true }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, params.showReferenceFrame, 50);

    const cx = width / 2;
    const cy = height / 2;
    const gravOffset = (params.gravity / 100) * (height * 0.28);
    const rad = (params.direction * Math.PI) / 180;

    // Draw reference frame coordinate guides if requested
    if (params.showReferenceFrame) {
      ctx.save();
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Label corners
      ctx.fillStyle = palette.accent;
      ctx.font = "10px monospace";
      ctx.fillText("REFERENCE FRAME BOUNDS", 38, 48);
      ctx.fillText(`CENTER (${Math.round(cx)}, ${Math.round(cy)})`, cx - 60, cy - 12);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = params.lineWidth;

    if (params.elementType === "all") {
      // Step-by-step conceptual evolution (Wong Fig 1)
      const colW = width / 4;
      const baseCy = cy + gravOffset;

      // 1. Point
      ctx.beginPath();
      ctx.arc(colW * 0.65, baseCy, params.pointSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "11px sans-serif";
      ctx.fillText("Point", colW * 0.65 - 15, baseCy + params.pointSize + 22);

      // 2. Line
      ctx.save();
      ctx.translate(colW * 1.6, baseCy);
      ctx.rotate(rad);
      ctx.beginPath();
      ctx.moveTo(-params.lineLength / 2, 0);
      ctx.lineTo(params.lineLength / 2, 0);
      ctx.stroke();
      ctx.restore();
      ctx.fillText("Line", colW * 1.6 - 12, baseCy + 50);

      // 3. Plane
      ctx.save();
      ctx.translate(colW * 2.55, baseCy);
      ctx.rotate(rad * 0.5);
      ctx.fillRect(-params.planeSize / 2, -params.planeSize / 2, params.planeSize, params.planeSize);
      ctx.restore();
      ctx.fillText("Plane", colW * 2.55 - 15, baseCy + 55);

      // 4. Volume (Isometric illusory cube)
      ctx.save();
      ctx.translate(colW * 3.4, baseCy);
      this.drawIsometricBox(ctx, 0, 0, params.planeSize * 0.7, palette);
      ctx.restore();
      ctx.fillText("Volume", colW * 3.4 - 20, baseCy + 55);

    } else if (params.elementType === "point") {
      // Point array demonstrating position & gravity
      const positions = [
        { x: cx, y: cy + gravOffset, r: params.pointSize * 1.5 },
        { x: cx - 120, y: cy - 60 + gravOffset, r: params.pointSize * 0.7 },
        { x: cx + 110, y: cy + 40 + gravOffset, r: params.pointSize * 0.9 },
        { x: cx + 50, y: cy - 110 + gravOffset, r: params.pointSize * 0.4 }
      ];
      positions.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

    } else if (params.elementType === "line") {
      // Set of lines demonstrating caliber, direction, and grouping
      ctx.save();
      ctx.translate(cx, cy + gravOffset);
      ctx.rotate(rad);
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-params.lineLength, i * 22);
        ctx.lineTo(params.lineLength, i * 22);
        ctx.stroke();
      }
      ctx.restore();

    } else if (params.elementType === "plane") {
      // Overlapping planes demonstrating space & orientation
      ctx.save();
      ctx.translate(cx, cy + gravOffset);
      ctx.rotate(rad);
      ctx.fillRect(-params.planeSize / 2, -params.planeSize / 2, params.planeSize, params.planeSize);
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(params.planeSize * 0.4, params.planeSize * 0.4, params.planeSize * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (params.elementType === "volume") {
      // High-contrast volumetric projection
      ctx.save();
      ctx.translate(cx, cy + gravOffset);
      this.drawIsometricBox(ctx, 0, 0, params.planeSize, palette);
      ctx.restore();
    }

    ctx.restore();
  },

  drawIsometricBox(ctx, x, y, size, palette) {
    const s = size * 0.6;
    const h = s * Math.sin(Math.PI / 6);
    const w = s * Math.cos(Math.PI / 6);

    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + w, y - s + h);
    ctx.lineTo(x, y - s + 2 * h);
    ctx.lineTo(x - w, y - s + h);
    ctx.closePath();
    ctx.stroke();

    // Left face
    ctx.beginPath();
    ctx.moveTo(x - w, y - s + h);
    ctx.lineTo(x, y - s + 2 * h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x - w, y);
    ctx.closePath();
    ctx.fillStyle = palette.fg;
    ctx.fill();
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(x, y - s + 2 * h);
    ctx.lineTo(x + w, y - s + h);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
  }
};
