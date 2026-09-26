// Chapter 11: Texture - Visual Grain, Typographic Fields & Halftones
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter11 = {
  id: 11,
  defaultParams: {
    textureMode: "typography", // typography, halftone, decorative, spontaneous
    glyphSet: "latin", // latin, chinese, geometric
    density: 55,
    fontScale: 18,
    contrastThreshold: 45,
    rotationVariance: 45,
    overlayGrain: true
  },

  controls: [
    {
      id: "textureMode",
      label: "Texture Category",
      type: "select",
      options: [
        { value: "typography", label: "Fig. 71: Typography as Visual Texture (Wong Exercise)" },
        { value: "halftone", label: "Fig. 67c: Mechanical Halftone Raster" },
        { value: "decorative", label: "Fig. 68a: Decorative Linear Wave Pattern" },
        { value: "spontaneous", label: "Fig. 69b: Spontaneous Splatter & Grain" }
      ]
    },
    {
      id: "glyphSet",
      label: "Typographic Character Set",
      type: "select",
      options: [
        { value: "latin", label: "Latin Bold Display (A-Z, 0-9)" },
        { value: "swiss", label: "Swiss Grotesk Neutral (HELVETICA)" },
        { value: "symbols", label: "Constructivist Symbols & Blocks" }
      ]
    },
    { id: "density", label: "Packing Density", type: "range", min: 20, max: 90, step: 2 },
    { id: "fontScale", label: "Glyph / Grain Scale", type: "range", min: 8, max: 48, step: 2 },
    { id: "rotationVariance", label: "Rotational Freedom", type: "range", min: 0, max: 180, step: 15, unit: "°" }
  ],

  presets: [
    {
      name: "Fig. 71c: Dense Typographic Collage",
      description: "Layered bold letterforms woven into an intricate optical tonal carpet.",
      params: { textureMode: "typography", glyphSet: "latin", density: 70, fontScale: 20, rotationVariance: 90 }
    },
    {
      name: "Fig. 67c: Mechanical Dot Screen",
      description: "Mathematical halftone dots producing smooth continuous gradation.",
      params: { textureMode: "halftone", density: 40, fontScale: 14 }
    },
    {
      name: "Fig. 68a: Woven Linear Ribbing",
      description: "Fine hand-drawn parallel ridges generating organic tactile vibration.",
      params: { textureMode: "decorative", density: 60, fontScale: 16 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;

    if (params.textureMode === "typography") {
      // Wong's famous typographic texture exercise (Fig. 71)
      const letters = params.glyphSet === "latin"
        ? ["A", "B", "R", "K", "X", "M", "Q", "S", "8", "E", "W", "Z", "N", "H"]
        : ["■", "▲", "●", "◆", "┼", "│", "─", "╱", "╲", "░", "▒", "▓"];

      const step = Math.max(12, 60 - params.density * 0.5);
      const cols = Math.floor(width / step);
      const rows = Math.floor(height / step);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * step;
          const y = (r + 0.5) * step;

          // Deterministic seed
          const seed = Math.sin(r * 45.12 + c * 91.34) * 43758.5453;
          const rand = seed - Math.floor(seed);
          const char = letters[Math.floor(rand * letters.length)];

          // Dynamic scale based on distance from center for tonal gradient
          const distToCenter = Math.hypot(x - cx, y - cy);
          const tone = 0.5 + 0.5 * Math.sin(distToCenter * 0.015);
          const size = params.fontScale * (0.8 + rand * 0.6) * (0.6 + tone * 0.8);

          ctx.save();
          ctx.translate(x, y);
          const rotAngle = ((rand - 0.5) * params.rotationVariance * Math.PI) / 90;
          ctx.rotate(rotAngle);
          ctx.font = `bold ${Math.round(size)}px 'Space Grotesk', 'Helvetica Neue', sans-serif`;

          // Opacity variation
          ctx.globalAlpha = 0.4 + tone * 0.6;
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }

    } else if (params.textureMode === "halftone") {
      // Mechanical halftone screen
      const spacing = 18;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const dist = Math.hypot(x - cx, y - cy);
          const maxR = spacing * 0.48;
          const radius = Math.max(0.5, (1 - dist / (width * 0.55)) * maxR);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

    } else if (params.textureMode === "decorative") {
      // Decorative linear wave ridges
      const lines = 40;
      const lineStep = height / lines;
      ctx.lineWidth = 2.5;

      for (let i = 0; i <= lines; i++) {
        const y = i * lineStep;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 15) {
          const wave = Math.sin(x * 0.05 + i * 0.4) * 8;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

    } else if (params.textureMode === "spontaneous") {
      // Spontaneous ink splatter
      for (let i = 0; i < 400; i++) {
        const seed = Math.sin(i * 123.45) * 43758.5453;
        const rand = seed - Math.floor(seed);
        const x = ((i * 137.5) % width);
        const y = ((i * 269.3) % height);
        const r = Math.pow(rand, 3) * 12 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
};
