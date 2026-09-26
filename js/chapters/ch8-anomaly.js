// Chapter 8: Anomaly - Regularity Disruption, Focal Epicenter & Structural Fractures
import { CanvasUtils } from '../canvas-utils.js';

export const Chapter8 = {
  id: 8,
  defaultParams: {
    anomalyType: "focal", // focal (in module), fracture (in structure), tear, monotony
    epicenterX: 0.5, // 0.0 to 1.0 (relative to canvas width)
    epicenterY: 0.5, // 0.0 to 1.0
    distortionRadius: 180,
    disruptionIntensity: 75,
    gridSize: 45,
    regularShape: "square",
    anomalousShape: "triangle",
    highlightColor: true
  },

  controls: [
    {
      id: "anomalyType",
      label: "Anomaly Manifestation",
      type: "select",
      options: [
        { value: "focal", label: "Fig. 56a: Focal Module Anomaly (Attracting Eye)" },
        { value: "fracture", label: "Fig. 56d: Structural Fault Line / Tectonic Rupture" },
        { value: "monotony", label: "Fig. 57a: Relieving Monotony (Gentle Swell)" },
        { value: "tear", label: "Fig. 58e: Void Tear / Structural Disintegration" }
      ]
    },
    { id: "disruptionIntensity", label: "Disruption Severity", type: "range", min: 10, max: 100, step: 2 },
    { id: "distortionRadius", label: "Anomaly Influence Radius", type: "range", min: 60, max: 350, step: 10 },
    { id: "gridSize", label: "Base Regular Grid Size", type: "range", min: 30, max: 80, step: 5 },
    { id: "highlightColor", label: "Highlight Anomaly Accent Color", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 56a: Singular Intruder",
      description: "A single contrasting triangular module breaks a field of rigid squares.",
      params: { anomalyType: "focal", disruptionIntensity: 50, distortionRadius: 120, highlightColor: true }
    },
    {
      name: "Fig. 56d: Tectonic Fracture",
      description: "A jagged fault-line shears through the regular structural columns.",
      params: { anomalyType: "fracture", disruptionIntensity: 85, distortionRadius: 220, highlightColor: false }
    },
    {
      name: "Fig. 57a: Compression Swell",
      description: "Modules stretch and bend around a central gravity distortion.",
      params: { anomalyType: "monotony", disruptionIntensity: 65, distortionRadius: 260 }
    },
    {
      name: "Fig. 58e: Disintegration Void",
      description: "Regular matrix torn open, leaving a dramatic negative rift.",
      params: { anomalyType: "tear", disruptionIntensity: 90, distortionRadius: 200 }
    }
  ],

  // Interactive mouse/touch click allows user to reposition the anomaly epicenter!
  onCanvasClick(e, rect, params) {
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;
    params.epicenterX = Math.max(0.05, Math.min(0.95, clickX));
    params.epicenterY = Math.max(0.05, Math.min(0.95, clickY));
  },

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const epiX = params.epicenterX * width;
    const epiY = params.epicenterY * height;
    const sz = params.gridSize;
    const cols = Math.floor(width / sz);
    const rows = Math.floor(height / sz);
    const padX = (width - cols * sz) / 2;
    const padY = (height - rows * sz) / 2;

    ctx.save();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = padX + (c + 0.5) * sz;
        let y = padY + (r + 0.5) * sz;

        const distToEpicenter = Math.hypot(x - epiX, y - epiY);
        const inZone = distToEpicenter < params.distortionRadius;
        const factor = inZone ? (1 - distToEpicenter / params.distortionRadius) : 0;

        ctx.save();

        if (params.anomalyType === "focal") {
          // If closest to epicenter, substitute anomalous shape
          const isClosest = distToEpicenter < sz * 0.75;
          ctx.translate(x, y);

          if (isClosest) {
            ctx.fillStyle = params.highlightColor ? palette.accent : palette.fg;
            // Draw anomaly intruder: rotated triangle
            ctx.rotate(Math.PI / 6);
            CanvasUtils.drawPolygon(ctx, 0, 0, sz * 0.42, 3, -Math.PI / 2);
            ctx.fill();
          } else {
            ctx.fillStyle = palette.fg;
            ctx.fillRect(-sz * 0.35, -sz * 0.35, sz * 0.7, sz * 0.7);
          }

        } else if (params.anomalyType === "fracture") {
          // Fault line: vertical shear offset along fracture line
          let shearY = 0;
          if (Math.abs(x - epiX) < params.distortionRadius * 0.4) {
            const jag = Math.sin(y * 0.05) * 15;
            shearY = (y > epiY ? 1 : -1) * (params.disruptionIntensity * 0.5) + jag;
            x += (Math.random() - 0.5) * (factor * 12);
          }

          ctx.translate(x, y + shearY);
          ctx.rotate((factor * (params.disruptionIntensity / 100) * Math.PI) / 3);
          ctx.fillStyle = (factor > 0.6 && params.highlightColor) ? palette.accent : palette.fg;
          ctx.fillRect(-sz * 0.38, -sz * 0.38, sz * 0.76, sz * 0.76);

        } else if (params.anomalyType === "monotony") {
          // Compression swell: push outwards from epicenter
          if (inZone) {
            const angle = Math.atan2(y - epiY, x - epiX);
            const push = Math.sin(factor * Math.PI) * (params.disruptionIntensity * 0.6);
            x += Math.cos(angle) * push;
            y += Math.sin(angle) * push;
          }

          ctx.translate(x, y);
          const currentSize = sz * (0.7 + factor * 0.4);
          ctx.fillStyle = palette.fg;
          ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);

        } else if (params.anomalyType === "tear") {
          // Void tear: cells inside epicenter disintegrate into broken fragments or vanish
          if (factor > 0.6) {
            // Vanished void
          } else if (factor > 0.2) {
            // Shattered debris
            ctx.translate(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            ctx.rotate(Math.random() * Math.PI);
            ctx.fillStyle = palette.fg;
            ctx.fillRect(-sz * 0.2, -sz * 0.2, sz * 0.4, sz * 0.4);
          } else {
            ctx.translate(x, y);
            ctx.fillStyle = palette.fg;
            ctx.fillRect(-sz * 0.38, -sz * 0.38, sz * 0.76, sz * 0.76);
          }
        }

        ctx.restore();
      }
    }

    // Epicenter target reticle
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(epiX, epiY, 8, 0, Math.PI * 2);
    ctx.moveTo(epiX - 14, epiY);
    ctx.lineTo(epiX + 14, epiY);
    ctx.moveTo(epiX, epiY - 14);
    ctx.lineTo(epiX, epiY + 14);
    ctx.stroke();

    ctx.restore();
  }
};
