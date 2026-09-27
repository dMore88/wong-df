// Real-World Graphic Design Renderer for Wucius Wong Design Studio
export const RealWorldRenderer = {
  render(canvas, caseItem, preset, options, palette) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const isDark = palette && palette.isDark;
    const bg = palette ? palette.bg : '#ffffff';
    const fg = palette ? palette.fg : '#111111';
    const accent = palette ? palette.accent : '#e11d48';

    // Clear background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (caseItem.id === 'brandmarks') {
      this.renderBrandmark(ctx, width, height, preset, options, { bg, fg, accent, isDark });
    } else if (caseItem.id === 'swiss-poster') {
      this.renderSwissPoster(ctx, width, height, preset, options, { bg, fg, accent, isDark });
    } else if (caseItem.id === 'patterns') {
      this.renderPackagingPattern(ctx, width, height, preset, options, { bg, fg, accent, isDark });
    } else if (caseItem.id === 'focal-hierarchy') {
      this.renderFocalHero(ctx, width, height, preset, options, { bg, fg, accent, isDark });
    }
  },

  // 1. BRANDMARKS & MONOGRAMS (Form Interrelations & Gestalt)
  renderBrandmark(ctx, width, height, preset, options, colors) {
    const cx = width / 2;
    const cy = height / 2 - (options.showOverlay ? 25 : 0);
    const scaleA = preset.scaleA || 120;
    const scaleB = preset.scaleB || 90;
    const offsetX = preset.offsetX || 35;
    const offsetY = preset.offsetY || -15;
    const interrelation = preset.interrelation || 'subtraction';

    // Construction grid guidelines if overlay is active
    if (options.showOverlay) {
      ctx.save();
      ctx.strokeStyle = colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Crosshairs & concentric circles
      ctx.beginPath();
      ctx.moveTo(cx, 40); ctx.lineTo(cx, height - 70);
      ctx.moveTo(40, cy); ctx.lineTo(width - 40, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, scaleA, 0, Math.PI * 2);
      ctx.arc(cx + offsetX, cy + offsetY, scaleB, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Form A & Form B based on Interrelation
    ctx.save();
    if (interrelation === 'subtraction') {
      // Form A solid, Form B cuts away with destination-out or composite
      // We draw Form A
      ctx.fillStyle = colors.fg;
      this.drawShape(ctx, preset.formA || 'circle', cx, cy, scaleA, 0);

      // Form B cuts out of Form A
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000000';
      this.drawShape(ctx, preset.formB || 'diamond', cx + offsetX, cy + offsetY, scaleB, (preset.rotationB || 0) * Math.PI / 180);
      ctx.globalCompositeOperation = 'source-over';
    } else if (interrelation === 'penetration') {
      // Both forms drawn with semi-transparency and outline
      ctx.fillStyle = colors.isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 3;

      this.drawShape(ctx, preset.formA || 'arch', cx, cy, scaleA, 0);
      ctx.stroke();

      this.drawShape(ctx, preset.formB || 'hexagon', cx + offsetX, cy + offsetY, scaleB, (preset.rotationB || 0) * Math.PI / 180);
      ctx.stroke();
    } else if (interrelation === 'touching') {
      // Contact at exactly one edge/point
      ctx.fillStyle = colors.fg;
      this.drawShape(ctx, preset.formA || 'circle', cx - scaleA / 2, cy, scaleA, 0);
      this.drawShape(ctx, preset.formB || 'circle', cx + scaleB / 2, cy, scaleB, 0);
    } else {
      // Union
      ctx.fillStyle = colors.fg;
      this.drawShape(ctx, preset.formA || 'circle', cx, cy, scaleA, 0);
      this.drawShape(ctx, preset.formB || 'diamond', cx + offsetX, cy + offsetY, scaleB, (preset.rotationB || 0) * Math.PI / 180);
    }
    ctx.restore();

    // Typographic Monogram Label if overlay active
    if (options.showOverlay) {
      ctx.save();
      ctx.fillStyle = colors.fg;
      ctx.font = 'bold 13px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STUDIO MONOGRAM • MARK Nº ' + (preset.id ? preset.id.toUpperCase() : '01'), cx, height - 45);

      ctx.fillStyle = colors.accent;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText('GESTALT OPERATION: ' + interrelation.toUpperCase() + ' // RATIO ' + Math.round(scaleB/scaleA*100) + '%', cx, height - 28);
      ctx.restore();
    }
  },

  // 2. SWISS TYPOGRAPHIC POSTER (Radiation & Structural Grids)
  renderSwissPoster(ctx, width, height, preset, options, colors) {
    const cx = width / 2;
    const cy = height / 2 + (options.showOverlay ? 15 : 0);
    const arms = preset.arms || 24;
    const curvature = preset.curvature || 35;
    const density = preset.density || 16;
    const maxR = Math.min(width, height) * 0.42;

    ctx.save();
    // Render dynamic vortex / radiation
    for (let i = 0; i < arms; i++) {
      const baseAngle = (i / arms) * Math.PI * 2;
      ctx.beginPath();
      for (let r = 15; r < maxR; r += 6) {
        const twist = (r / maxR) * (curvature * Math.PI / 180);
        const x = cx + Math.cos(baseAngle + twist) * r;
        const y = cy + Math.sin(baseAngle + twist) * r;
        if (r === 15) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    // Concentric ripple rings
    for (let j = 1; j <= 5; j++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (maxR / 5) * j, 0, Math.PI * 2);
      ctx.strokeStyle = colors.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // Swiss International Typographic Header & Footer
    if (options.showOverlay) {
      ctx.save();
      // Poster frame margin
      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(24, 24, width - 48, height - 48);

      // Top Title Block
      ctx.fillStyle = colors.fg;
      ctx.font = 'bold 15px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('KUNSTHALLE ZÜRICH', 36, 52);

      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.accent;
      ctx.fillText('1968 // RETROSPEKTIVE', 36, 68);

      ctx.font = 'bold 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = colors.fg;
      ctx.textAlign = 'right';
      ctx.fillText('INTERNATIONALE TYPOGRAFIE', width - 36, 52);
      ctx.font = '400 10px "Inter", sans-serif';
      ctx.fillText('HERBSTKURS OKT 12 — NOV 24', width - 36, 68);

      // Bottom Metadata
      ctx.textAlign = 'left';
      ctx.font = 'bold 18px "Space Grotesk", sans-serif';
      ctx.fillText('FORM & VORTEX RADIATON', 36, height - 52);

      ctx.font = '400 10px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.isDark ? '#a1a1aa' : '#71717a';
      ctx.fillText('CANONICAL 2D VECTOR GRAMMAR // WUCIUS WONG', 36, height - 36);

      ctx.textAlign = 'right';
      ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      ctx.fillStyle = colors.fg;
      ctx.fillText('SERIE Nº 07', width - 36, height - 44);
      ctx.restore();
    }
  },

  // 3. PACKAGING & BRAND PATTERNS (Repetition, Similarity & Texture)
  renderPackagingPattern(ctx, width, height, preset, options, colors) {
    const rows = preset.rows || 6;
    const cols = preset.cols || 6;
    const cellW = (width - 60) / cols;
    const cellH = (height - (options.showOverlay ? 120 : 60)) / rows;
    const startX = 30 + cellW / 2;
    const startY = (options.showOverlay ? 70 : 30) + cellH / 2;
    const module = preset.module || 'quatrefoil';
    const isBrick = preset.gridType === 'brick';

    ctx.save();
    for (let r = 0; r < rows; r++) {
      const rowShift = (isBrick && r % 2 === 1) ? cellW / 2 : 0;
      for (let c = 0; c < cols; c++) {
        const x = startX + c * cellW + rowShift;
        const y = startY + r * cellH;
        if (x > width - 20) continue;

        // Draw individual rapport unit
        ctx.fillStyle = colors.fg;
        const modSize = Math.min(cellW, cellH) * 0.42;

        if (module === 'quatrefoil') {
          // Classic Wong "Meeting of 4 Circles"
          const rSub = modSize * 0.45;
          ctx.beginPath();
          ctx.arc(x - rSub, y, rSub, 0, Math.PI * 2);
          ctx.arc(x + rSub, y, rSub, 0, Math.PI * 2);
          ctx.arc(x, y - rSub, rSub, 0, Math.PI * 2);
          ctx.arc(x, y + rSub, rSub, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = colors.bg;
          ctx.beginPath();
          ctx.arc(x, y, rSub * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (module === 'diamond-star') {
          this.drawDiamondStar(ctx, x, y, modSize, colors.fg);
        } else {
          // Chevron
          this.drawChevron(ctx, x, y, modSize, colors.fg);
        }
      }
    }
    ctx.restore();

    // Luxury Packaging Presentation Wrap
    if (options.showOverlay) {
      ctx.save();
      // Outer luxury frame
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Centered Boutique Emblem Box
      const badgeW = 260;
      const badgeH = 50;
      const bx = (width - badgeW) / 2;
      const by = 28;

      ctx.fillStyle = colors.bg;
      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 1.5;
      ctx.fillRect(bx, by, badgeW, badgeH);
      ctx.strokeRect(bx, by, badgeW, badgeH);

      ctx.fillStyle = colors.fg;
      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ATELIER MAISON • N° 03', width / 2, by + 22);

      ctx.font = '500 9px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.accent;
      ctx.fillText('SEAMLESS REPETITION // RAPPORT 100%', width / 2, by + 37);
      ctx.restore();
    }
  },

  // 4. FOCAL HIERARCHY & HERO (Anomaly & Concentration)
  renderFocalHero(ctx, width, height, preset, options, colors) {
    const rows = preset.gridRows || 8;
    const cols = preset.gridCols || 8;
    const epX = (preset.epicenterX || 0.65) * width;
    const epY = (preset.epicenterY || 0.45) * height;
    const cellW = width / (cols + 1);
    const cellH = (height - (options.showOverlay ? 100 : 0)) / (rows + 1);

    ctx.save();
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const x = c * cellW;
        const y = (options.showOverlay ? 50 : 0) + r * cellH;

        const dist = Math.hypot(x - epX, y - epY);
        const maxDist = Math.hypot(width, height) * 0.45;
        const factor = Math.max(0, 1 - dist / maxDist);

        let size = 14;
        let rot = 0;
        let isAnomaly = false;

        if (dist < 45) {
          isAnomaly = true;
          size = 32;
          rot = Math.PI / 4;
        } else if (factor > 0) {
          if (preset.anomalyType === 'rotation') {
            rot = factor * Math.PI;
          } else {
            size = 14 + factor * 14;
          }
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);

        if (isAnomaly) {
          ctx.fillStyle = colors.accent;
          ctx.fillRect(-size/2, -size/2, size, size);
        } else {
          ctx.fillStyle = colors.fg;
          ctx.beginPath();
          ctx.arc(0, 0, size/2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    ctx.restore();

    // Digital Editorial UI Overlay (Headline & CTA)
    if (options.showOverlay) {
      ctx.save();
      // Target Reticle around Anomaly
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(epX, epY, 36, 0, Math.PI * 2);
      ctx.stroke();

      // Connecting pointer line
      ctx.beginPath();
      ctx.moveTo(epX + 38, epY);
      ctx.lineTo(epX + 75, epY - 20);
      ctx.lineTo(epX + 160, epY - 20);
      ctx.stroke();

      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('PRIMARY EYE ANCHOR', epX + 78, epY - 26);

      // Hero Headline Bottom Card
      const cardW = width - 48;
      const cardH = 80;
      const cardX = 24;
      const cardY = height - 100;

      ctx.setLineDash([]);
      ctx.fillStyle = colors.isDark ? 'rgba(18,18,21,0.92)' : 'rgba(255,255,255,0.92)';
      ctx.strokeStyle = colors.isDark ? '#27272a' : '#e4e4e7';
      ctx.lineWidth = 1;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.fillStyle = colors.fg;
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.fillText(preset.headline || 'THE ATTENTION ANOMALY', cardX + 18, cardY + 30);

      ctx.font = '400 11px "Inter", sans-serif';
      ctx.fillStyle = colors.isDark ? '#a1a1aa' : '#71717a';
      ctx.fillText('Breaking structural uniformity to command the user eye path in 0.4 seconds.', cardX + 18, cardY + 50);

      // Mini CTA button in card
      const btnW = 140;
      const btnH = 32;
      const btnX = cardX + cardW - btnW - 18;
      const btnY = cardY + 24;

      ctx.fillStyle = colors.accent;
      ctx.fillRect(btnX, btnY, btnW, btnH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(preset.ctaText || 'EXPLORE NOW →', btnX + btnW / 2, btnY + 20);
      ctx.restore();
    }
  },

  // Helper Geometric Primitives
  drawShape(ctx, shape, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, 0);
      ctx.lineTo(0, size / 2);
      ctx.lineTo(-size / 2, 0);
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'arch') {
      const r = size / 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, 0, false);
      ctx.lineTo(r, r);
      ctx.lineTo(-r, r);
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'hexagon') {
      const r = size / 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const hx = Math.cos(a) * r;
        const hy = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(-size / 2, -size / 2, size, size);
    }
    ctx.restore();
  },

  drawDiamondStar(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.quadraticCurveTo(0, 0, size / 2, 0);
    ctx.quadraticCurveTo(0, 0, 0, size / 2);
    ctx.quadraticCurveTo(0, 0, -size / 2, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  drawChevron(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/3);
    ctx.lineTo(0, size/3);
    ctx.lineTo(size/2, -size/3);
    ctx.lineTo(size/3, -size/3);
    ctx.lineTo(0, size/6);
    ctx.lineTo(-size/3, -size/3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
};
