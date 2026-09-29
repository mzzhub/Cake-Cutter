/**
 * Drawing utilities for Cake Cutter AR Overlays
 */

export const NEON_THEMES = {
  cyan: {
    stroke: '#00f3ff',
    glow: 'rgba(0, 243, 255, 0.8)',
    fill: 'rgba(0, 243, 255, 0.12)',
    text: '#ffffff',
    accent: '#00c8d6'
  },
  pink: {
    stroke: '#ff007f',
    glow: 'rgba(255, 0, 127, 0.8)',
    fill: 'rgba(255, 0, 127, 0.12)',
    text: '#ffffff',
    accent: '#d6006b'
  },
  green: {
    stroke: '#39ff14',
    glow: 'rgba(57, 255, 20, 0.8)',
    fill: 'rgba(57, 255, 20, 0.12)',
    text: '#ffffff',
    accent: '#2ecc10'
  },
  yellow: {
    stroke: '#ffe600',
    glow: 'rgba(255, 230, 0, 0.8)',
    fill: 'rgba(255, 230, 0, 0.12)',
    text: '#ffffff',
    accent: '#d6c200'
  },
  purple: {
    stroke: '#b026ff',
    glow: 'rgba(176, 38, 255, 0.8)',
    fill: 'rgba(176, 38, 255, 0.12)',
    text: '#ffffff',
    accent: '#941dd9'
  }
};

/**
 * Draws AR cutting overlay onto canvas based on object bounding box and requested slice count.
 */
export function drawAROverlay({
  ctx,
  bbox, // [x, y, width, height]
  label = 'Cake',
  score = 0.95,
  sliceCount = 6,
  cutType = 'radial', // 'radial' | 'parallel' | 'grid'
  themeKey = 'cyan',
  showNumbers = true,
  isLocked = false
}) {
  if (!bbox || bbox.length < 4) return;

  const theme = NEON_THEMES[themeKey] || NEON_THEMES.cyan;
  const [x, y, w, h] = bbox;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = w / 2;
  const ry = h / 2;

  ctx.save();

  // 1. Draw glowing outer boundary (Ellipse for round food like cake/pizza/donut, Rect for box/pan)
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 18;
  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.stroke;
  ctx.fillStyle = theme.fill;

  if (cutType === 'radial') {
    // Outer Ellipse Fit
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  } else {
    // Outer Rounded Rect Fit
    ctx.beginPath();
    const cornerRadius = Math.min(16, w * 0.1, h * 0.1);
    ctx.roundRect(x, y, w, h, cornerRadius);
    ctx.fill();
    ctx.stroke();
  }

  // 2. Draw Corner Target Reticles / Lock Status
  ctx.shadowBlur = 0; // reset for reticles
  drawCornerReticles(ctx, x, y, w, h, theme.stroke);

  // 3. Draw Object Detection Tag Header
  drawLabelTag(ctx, x, y, label, score, sliceCount, theme, isLocked);

  // 4. Draw Cutting Lines based on slice count N
  if (sliceCount > 1) {
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = theme.stroke;
    ctx.setLineDash([8, 6]); // Modern dashed styling

    if (cutType === 'radial') {
      drawRadialSlices(ctx, cx, cy, rx, ry, sliceCount, theme, showNumbers);
    } else if (cutType === 'parallel') {
      drawParallelSlices(ctx, x, y, w, h, sliceCount, theme, showNumbers);
    } else if (cutType === 'grid') {
      drawGridSlices(ctx, x, y, w, h, sliceCount, theme, showNumbers);
    }
  }

  ctx.restore();
}

/**
 * Draws Radial (pie) cut lines from center to outer boundary at equal angles.
 */
function drawRadialSlices(ctx, cx, cy, rx, ry, sliceCount, theme, showNumbers) {
  const angleStep = (2 * Math.PI) / sliceCount;

  // Center point indicator
  ctx.fillStyle = theme.stroke;
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
  ctx.fill();

  for (let i = 0; i < sliceCount; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top 12 o'clock
    const px = cx + rx * Math.cos(angle);
    const py = cy + ry * Math.sin(angle);

    // Draw slice radial line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Draw Slice Numbers near perimeter
    if (showNumbers) {
      const midAngle = angle + angleStep / 2;
      const numRadiusX = rx * 0.72;
      const numRadiusY = ry * 0.72;
      const nx = cx + numRadiusX * Math.cos(midAngle);
      const ny = cy + numRadiusY * Math.sin(midAngle);

      drawSliceNumberBadge(ctx, i + 1, nx, ny, theme);
    }
  }
}

/**
 * Draws Parallel vertical cut lines dividing bounding box into N equal strips.
 */
function drawParallelSlices(ctx, x, y, w, h, sliceCount, theme, showNumbers) {
  const step = w / sliceCount;

  for (let i = 1; i < sliceCount; i++) {
    const lx = x + i * step;
    ctx.beginPath();
    ctx.moveTo(lx, y);
    ctx.lineTo(lx, y + h);
    ctx.stroke();
  }

  if (showNumbers) {
    for (let i = 0; i < sliceCount; i++) {
      const nx = x + i * step + step / 2;
      const ny = y + h / 2;
      drawSliceNumberBadge(ctx, i + 1, nx, ny, theme);
    }
  }
}

/**
 * Draws Grid cut lines (Rows x Cols) inside bounding box.
 */
function drawGridSlices(ctx, x, y, w, h, sliceCount, theme, showNumbers) {
  // Find grid factors (cols x rows ≈ sliceCount)
  let cols = Math.ceil(Math.sqrt(sliceCount));
  let rows = Math.ceil(sliceCount / cols);

  const colStep = w / cols;
  const rowStep = h / rows;

  // Vertical lines
  for (let i = 1; i < cols; i++) {
    const lx = x + i * colStep;
    ctx.beginPath();
    ctx.moveTo(lx, y);
    ctx.lineTo(lx, y + h);
    ctx.stroke();
  }

  // Horizontal lines
  for (let j = 1; j < rows; j++) {
    const ly = y + j * rowStep;
    ctx.beginPath();
    ctx.moveTo(x, ly);
    ctx.lineTo(x + w, ly);
    ctx.stroke();
  }

  if (showNumbers) {
    let count = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count > sliceCount) break;
        const nx = x + c * colStep + colStep / 2;
        const ny = y + r * rowStep + rowStep / 2;
        drawSliceNumberBadge(ctx, count, nx, ny, theme);
        count++;
      }
    }
  }
}

/**
 * Draws corner target reticles for high tech aesthetic.
 */
function drawCornerReticles(ctx, x, y, w, h, color) {
  const len = Math.min(20, w * 0.15, h * 0.15);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.setLineDash([]);

  // Top Left
  ctx.beginPath();
  ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len); ctx.lineTo(x, y + h); ctx.lineTo(x + len, y + h);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
}

/**
 * Draws floating tag above detection box with confidence and portion count.
 */
function drawLabelTag(ctx, x, y, label, score, sliceCount, theme, isLocked) {
  const text = `${isLocked ? '🔒 LOCKED ' : ''}${label.toUpperCase()} (${Math.round(score * 100)}%) • ${sliceCount} PIECES`;
  ctx.font = 'bold 13px Inter, sans-serif';
  const textWidth = ctx.measureText(text).width;
  const paddingX = 10;
  const paddingY = 6;
  const tagH = 26;
  const tagW = textWidth + paddingX * 2;
  const tagY = Math.max(10, y - tagH - 6);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = theme.stroke;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.roundRect(x, tagY, tagW, tagH, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = theme.stroke;
  ctx.fillText(text, x + paddingX, tagY + 17);
}

/**
 * Draws slice number badge inside slice area.
 */
function drawSliceNumberBadge(ctx, number, cx, cy, theme) {
  ctx.save();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  const radius = 12;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = theme.stroke;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(number.toString(), cx, cy);

  ctx.restore();
}
