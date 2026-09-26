// Chapter 12: Space - Flat vs Illusory, Fluctuating Depth & Conflicting Paradoxes
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter12 = {
  id: 12,
  defaultParams: {
    spaceMode: "conflicting", // flat, illusory, fluctuating, conflicting
    illusionDepth: 60,
    cubeCount: 5,
    shadingContrast: 80,
    showIsometricGuides: true,
    impossibleJoint: true
  },

  controls: [
    {
      id: "spaceMode",
      label: "Spatial Category",
      type: "select",
      options: [
        { value: "conflicting", label: "Fig. 77: Conflicting (Impossible) Isometric Space" },
        { value: "fluctuating", label: "Fig. 76: Fluctuating Reversible Spatial Planes" },
        { value: "illusory", label: "Fig. 74d: Illusory Isometric Cube Train" },
        { value: "flat", label: "Fig. 72a: Pure Flat Figure-Ground Ambiguity" }
      ]
    },
    { id: "illusionDepth", label: "Perspective / Shear Depth", type: "range", min: 20, max: 100, step: 5 },
    { id: "shadingContrast", label: "Tonal Shading Contrast", type: "range", min: 30, max: 100, step: 5 },
    { id: "impossibleJoint", label: "Impossible Optical Interlock", type: "checkbox" },
    { id: "showIsometricGuides", label: "Show Isometric Guidelines", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 77b: Impossible Isometric Tower",
      description: "Contradictory planes where staircases and beams wrap simultaneously front and back.",
      params: { spaceMode: "conflicting", illusionDepth: 70, impossibleJoint: true }
    },
    {
      name: "Fig. 76b: Fluctuating Ribbon Step",
      description: "A zigzag plane that oscillates in perception between facing upward and downward.",
      params: { spaceMode: "fluctuating", illusionDepth: 55 }
    },
    {
      name: "Fig. 74d: Receding Cube Train",
      description: "Isometric solid cubes stepping diagonally into deep space.",
      params: { spaceMode: "illusory", cubeCount: 4, illusionDepth: 60 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, params.showIsometricGuides, 40);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = palette.fg;

    if (params.spaceMode === "conflicting") {
      // Impossible Escher/Wong optical box with conflicting depth lines (Fig. 77)
      this.drawImpossibleBlock(ctx, cx, cy, 140, params, palette);

    } else if (params.spaceMode === "fluctuating") {
      // Reversible fluctuating step (Fig. 76a / 76b)
      this.drawFluctuatingStep(ctx, cx, cy, 130, params, palette);

    } else if (params.spaceMode === "illusory") {
      // Receding isometric cubes
      const count = params.cubeCount;
      const sz = 55;
      for (let i = 0; i < count; i++) {
        const x = cx - (count / 2 - i) * 65;
        const y = cy - (count / 2 - i) * 45;
        this.drawSolidIsometricCube(ctx, x, y, sz, palette);
      }

    } else if (params.spaceMode === "flat") {
      // Flat reversible figure-ground grid (Fig. 72a)
      const sz = 60;
      const cols = 6;
      const rows = 6;
      const startX = cx - (cols * sz) / 2;
      const startY = cy - (rows * sz) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * sz;
          const y = startY + r * sz;
          const isOdd = (r + c) % 2 === 1;

          ctx.fillStyle = isOdd ? palette.fg : palette.bg;
          ctx.fillRect(x, y, sz, sz);

          ctx.fillStyle = isOdd ? palette.bg : palette.fg;
          ctx.beginPath();
          ctx.arc(x + sz / 2, y + sz / 2, sz * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  },

  drawImpossibleBlock(ctx, x, y, size, params, palette) {
    const s = size * 0.55;
    const h = s * 0.577; // 30 deg isometric angle

    // Draw the front frame
    ctx.save();
    ctx.translate(x, y);

    // Impossible hexagonal interlock
    ctx.fillStyle = palette.fg;
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.4);
    ctx.lineTo(s * 1.2, -h * 0.8);
    ctx.lineTo(s * 1.2, h * 0.8);
    ctx.lineTo(0, s * 1.4);
    ctx.lineTo(-s * 1.2, h * 0.8);
    ctx.lineTo(-s * 1.2, -h * 0.8);
    ctx.closePath();
    ctx.stroke();

    // Internal contradictory bands (Wong Fig 77b)
    for (let i = -4; i <= 4; i++) {
      const offset = i * 16;
      ctx.beginPath();
      ctx.moveTo(-s * 0.9, offset);
      ctx.lineTo(0, offset + (params.impossibleJoint ? -20 : 20));
      ctx.lineTo(s * 0.9, offset);
      ctx.stroke();
    }

    ctx.restore();
  },

  drawFluctuatingStep(ctx, x, y, size, params, palette) {
    const s = size;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = palette.fg;
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.3);
    ctx.lineTo(-s * 0.2, -s * 0.6);
    ctx.lineTo(s * 0.8, -s * 0.1);
    ctx.lineTo(0, s * 0.2);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, s * 0.2);
    ctx.lineTo(s * 0.8, -s * 0.1);
    ctx.lineTo(s * 0.8, s * 0.5);
    ctx.lineTo(0, s * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  },

  drawSolidIsometricCube(ctx, x, y, size, palette) {
    const s = size;
    const dx = s * Math.cos(Math.PI / 6);
    const dy = s * Math.sin(Math.PI / 6);

    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + dx, y - s + dy);
    ctx.lineTo(x, y - s + 2 * dy);
    ctx.lineTo(x - dx, y - s + dy);
    ctx.closePath();
    ctx.fillStyle = palette.bg;
    ctx.fill();
    ctx.stroke();

    // Left face (Darker)
    ctx.beginPath();
    ctx.moveTo(x - dx, y - s + dy);
    ctx.lineTo(x, y - s + 2 * dy);
    ctx.lineTo(x, y + dy);
    ctx.lineTo(x - dx, y);
    ctx.closePath();
    ctx.fillStyle = palette.fg;
    ctx.fill();
    ctx.stroke();

    // Right face (Hatched or medium)
    ctx.beginPath();
    ctx.moveTo(x, y - s + 2 * dy);
    ctx.lineTo(x + dx, y - s + dy);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x, y + dy);
    ctx.closePath();
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
  }
};
