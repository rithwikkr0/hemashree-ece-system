const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const WIDTH = 640;
const HEIGHT = 360;
const FPS = 30;
const DURATION = 3.0; // 3 seconds loop
const TOTAL_FRAMES = Math.round(FPS * DURATION);

const VIDEO_DIR = path.join(__dirname, '..', 'public', 'assets', 'video');
const POSTER_DIR = path.join(VIDEO_DIR, 'posters');

if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });
if (!fs.existsSync(POSTER_DIR)) fs.mkdirSync(POSTER_DIR, { recursive: true });

// Minimal 2D Rasterizer for Buffer
class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = Buffer.alloc(width * height * 4);
  }

  clear(r, g, b, a = 255) {
    for (let i = 0; i < this.width * this.height; i++) {
      const idx = i * 4;
      this.buffer[idx] = r;
      this.buffer[idx + 1] = g;
      this.buffer[idx + 2] = b;
      this.buffer[idx + 3] = a;
    }
  }

  setPixel(x, y, r, g, b, a = 255) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (y * this.width + x) * 4;
    const alpha = a / 255;
    if (alpha >= 1) {
      this.buffer[idx] = r;
      this.buffer[idx + 1] = g;
      this.buffer[idx + 2] = b;
      this.buffer[idx + 3] = 255;
    } else {
      this.buffer[idx] = Math.min(255, Math.round(this.buffer[idx] * (1 - alpha) + r * alpha));
      this.buffer[idx + 1] = Math.min(255, Math.round(this.buffer[idx + 1] * (1 - alpha) + g * alpha));
      this.buffer[idx + 2] = Math.min(255, Math.round(this.buffer[idx + 2] * (1 - alpha) + b * alpha));
      this.buffer[idx + 3] = 255;
    }
  }

  drawGrid(spacing, r, g, b, a = 35) {
    for (let x = 0; x < this.width; x += spacing) {
      for (let y = 0; y < this.height; y++) {
        this.setPixel(x, y, r, g, b, a);
      }
    }
    for (let y = 0; y < this.height; y += spacing) {
      for (let x = 0; x < this.width; x++) {
        this.setPixel(x, y, r, g, b, a);
      }
    }
  }

  drawLine(x0, y0, x1, y1, r, g, b, a = 255, thickness = 1) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    const rOffset = Math.floor(thickness / 2);

    while (true) {
      for (let ox = -rOffset; ox <= rOffset; ox++) {
        for (let oy = -rOffset; oy <= rOffset; oy++) {
          this.setPixel(x + ox, y + oy, r, g, b, a);
        }
      }
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  drawCircle(cx, cy, radius, r, g, b, a = 255, thickness = 1) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    radius = Math.round(radius);
    const steps = Math.max(32, Math.round(radius * 2.5));
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      for (let t = 0; t < thickness; t++) {
        this.setPixel(x + (t - thickness / 2), y, r, g, b, a);
      }
    }
  }

  drawFilledCircle(cx, cy, radius, r, g, b, a = 255) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    radius = Math.round(radius);
    const r2 = radius * radius;
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= r2) {
          this.setPixel(cx + x, cy + y, r, g, b, a);
        }
      }
    }
  }

  drawGlowDot(cx, cy, radius, r, g, b) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    radius = Math.round(radius);
    for (let rad = radius * 2.5; rad >= radius; rad -= 1) {
      const alpha = Math.round(50 * (1 - rad / (radius * 2.5)));
      this.drawFilledCircle(cx, cy, rad, r, g, b, alpha);
    }
    this.drawFilledCircle(cx, cy, radius, r, g, b, 255);
    this.drawFilledCircle(cx, cy, Math.max(1, radius * 0.4), 255, 255, 255, 255);
  }

  drawRect(x, y, w, h, r, g, b, a = 255) {
    this.drawLine(x, y, x + w, y, r, g, b, a);
    this.drawLine(x + w, y, x + w, y + h, r, g, b, a);
    this.drawLine(x + w, y + h, x, y + h, r, g, b, a);
    this.drawLine(x, y + h, x, y, r, g, b, a);
  }

  drawFilledRect(x, y, w, h, r, g, b, a = 255) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    for (let py = y; py < y + h; py++) {
      for (let px = x; px < x + w; px++) {
        this.setPixel(px, py, r, g, b, a);
      }
    }
  }
}

// Async frame writer with backpressure drain
async function writeFrame(stream, buffer) {
  if (!stream.write(buffer)) {
    await new Promise((resolve) => stream.once('drain', resolve));
  }
}

// Render video using child_process spawn
async function renderVideo(outputName, frameRenderer) {
  const outPath = path.join(VIDEO_DIR, `${outputName}.mp4`);
  console.log(`Starting render for ${outputName}.mp4 (${TOTAL_FRAMES} frames)...`);

  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-s', `${WIDTH}x${HEIGHT}`,
    '-r', `${FPS}`,
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '22',
    outPath
  ]);

  let stderrOutput = '';
  ffmpeg.stderr.on('data', (d) => { stderrOutput += d.toString(); });

  const canvas = new PixelCanvas(WIDTH, HEIGHT);

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const progress = frame / TOTAL_FRAMES;
    const t = frame / FPS;
    frameRenderer(canvas, progress, t, frame);
    await writeFrame(ffmpeg.stdin, canvas.buffer);
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderrOutput}`));
    });
  });

  console.log(`✓ Rendered ${outputName}.mp4 successfully!`);

  // Extract poster frame (frame at 0.5s)
  const posterPath = path.join(POSTER_DIR, `${outputName}.webp`);
  await new Promise((resolve) => {
    const posterProc = spawn('ffmpeg', [
      '-y',
      '-ss', '00:00:00.5',
      '-i', outPath,
      '-vframes', '1',
      '-c:v', 'libwebp',
      '-quality', '85',
      posterPath
    ]);
    posterProc.on('close', () => {
      console.log(`  ✓ Poster extracted: ${outputName}.webp`);
      resolve();
    });
  });
}

// 1. BOOT SEQUENCE: Power surge, illuminating PCB traces, cyan scanline
function renderBoot(canvas, progress, t) {
  canvas.clear(5, 8, 12);
  canvas.drawGrid(32, 0, 240, 255, 25);

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  // Expanding power shockwave rings
  for (let i = 0; i < 4; i++) {
    const ringPhase = (t * 0.8 + i * 0.25) % 1;
    const radius = ringPhase * (WIDTH * 0.5);
    const alpha = Math.round(180 * (1 - ringPhase));
    canvas.drawCircle(cx, cy, radius, 0, 240, 255, alpha, 2);
  }

  // Radiating circuit buses
  const buses = 12;
  for (let b = 0; b < buses; b++) {
    const angle = (b / buses) * Math.PI * 2;
    const len = 110 + Math.sin(t * 3 + b) * 30;
    const x1 = cx + Math.cos(angle) * 20;
    const y1 = cy + Math.sin(angle) * 20;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    canvas.drawLine(x1, y1, x2, y2, 0, 240, 255, 120, 2);

    // Conduction electron packet
    const packetDist = 20 + ((t * 80 + b * 20) % len);
    const px = cx + Math.cos(angle) * packetDist;
    const py = cy + Math.sin(angle) * packetDist;
    canvas.drawGlowDot(px, py, 2.5, 255, 170, 0); // Amber packet
  }

  // Central core power processor
  canvas.drawFilledCircle(cx, cy, 22, 10, 25, 35, 240);
  canvas.drawCircle(cx, cy, 22, 0, 240, 255, 255, 2);
  canvas.drawGlowDot(cx, cy, 6, 0, 240, 255);

  // Vertical scan line
  const scanY = (t * 180) % HEIGHT;
  canvas.drawLine(0, scanY, WIDTH, scanY, 0, 240, 255, 160, 2);
  canvas.drawLine(0, (scanY - 1 + HEIGHT) % HEIGHT, WIDTH, (scanY - 1 + HEIGHT) % HEIGHT, 0, 240, 255, 60, 1);
}

// 2. PCB FLIGHT: Low angle flight over surface-mount circuit board
function renderPcbFlight(canvas, progress, t) {
  canvas.clear(6, 10, 15);
  canvas.drawGrid(36, 0, 200, 230, 20);

  // Horizontal multi-channel bus traces
  const busY = [80, 105, 130, 230, 255, 280];
  busY.forEach((by, idx) => {
    canvas.drawLine(0, by, WIDTH, by, 0, 240, 255, 100, 2);
    // Flowing signals
    for (let p = 0; p < 4; p++) {
      const px = (t * 180 + p * 160 + idx * 40) % WIDTH;
      canvas.drawGlowDot(px, by, 2.5, idx % 2 === 0 ? 0 : 255, idx % 2 === 0 ? 240 : 160, idx % 2 === 0 ? 255 : 0);
    }
  });

  // Vertical connect traces with 45-degree chamfers
  for (let vx = 70; vx < WIDTH; vx += 110) {
    const shift = (t * 30) % 110;
    const curX = (vx + shift) % WIDTH;
    canvas.drawLine(curX, 130, curX + 20, 170, 0, 240, 255, 80, 2);
    canvas.drawLine(curX + 20, 170, curX + 20, 230, 0, 240, 255, 80, 2);
    // Via pads
    canvas.drawCircle(curX, 130, 5, 255, 180, 0, 200, 2);
    canvas.drawCircle(curX + 20, 230, 5, 255, 180, 0, 200, 2);
  }

  // Microcontroller IC Package in center
  const icX = WIDTH / 2 - 60;
  const icY = HEIGHT / 2 - 40;
  canvas.drawFilledRect(icX, icY, 120, 80, 15, 20, 28, 240);
  canvas.drawRect(icX, icY, 120, 80, 0, 240, 255, 180);
  // IC Pins
  for (let pin = 0; pin < 7; pin++) {
    const pinX = icX + 12 + pin * 16;
    canvas.drawLine(pinX, icY - 10, pinX, icY, 200, 200, 220, 200, 2);
    canvas.drawLine(pinX, icY + 80, pinX, icY + 90, 200, 200, 220, 200, 2);
  }
}

// 3. PORTRAIT TRANSFORM: Holographic scanning, biometric rings, particle dispersion
function renderPortraitTransform(canvas, progress, t) {
  canvas.clear(5, 7, 10);
  canvas.drawGrid(28, 0, 240, 255, 20);

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  // Biometric calibration rings
  canvas.drawCircle(cx, cy, 100, 0, 240, 255, 100, 1);
  canvas.drawCircle(cx, cy, 130, 0, 240, 255, 80, 1);
  canvas.drawCircle(cx, cy, 160, 0, 240, 255, 50, 1);

  // Rotating reticle ticks
  const ticks = 24;
  for (let i = 0; i < ticks; i++) {
    const angle = (i / ticks) * Math.PI * 2 + t * 0.4;
    const r1 = 100;
    const r2 = i % 4 === 0 ? 112 : 105;
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = cy + Math.sin(angle) * r1;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = cy + Math.sin(angle) * r2;
    canvas.drawLine(x1, y1, x2, y2, 0, 240, 255, 180, 1);
  }

  // Hologram wireframe head silhouette approximation
  const headY = cy - 15;
  canvas.drawCircle(cx, headY, 48, 0, 240, 255, 120, 2);
  for (let sx = -70; sx <= 70; sx += 4) {
    const sy = cy + 45 + (sx * sx) / 90;
    canvas.setPixel(cx + sx, sy, 0, 240, 255, 140);
  }

  // Scanning laser beam
  const laserY = cy - 90 + ((t * 110) % 180);
  canvas.drawLine(cx - 120, laserY, cx + 120, laserY, 0, 240, 255, 240, 2);
  canvas.drawLine(cx - 120, laserY - 1, cx + 120, laserY - 1, 255, 255, 255, 180, 1);

  // Floating telemetry particles
  for (let p = 0; p < 30; p++) {
    const pAngle = p * 1.6 + t * 0.8;
    const pDist = 40 + (p * 4.0 + t * 25) % 130;
    const px = cx + Math.cos(pAngle) * pDist;
    const py = cy + Math.sin(pAngle) * (pDist * 0.8);
    canvas.drawGlowDot(px, py, 2, 0, 240, 255);
  }
}

// 4. RF WAVE: 2.4 GHz Electromagnetic concentric radiation & frequency spectrum
function renderRfWave(canvas, progress, t) {
  canvas.clear(5, 8, 14);

  const cx = WIDTH * 0.35;
  const cy = HEIGHT * 0.5;

  // Concentric radiating electromagnetic wavefronts
  const waves = 12;
  for (let w = 0; w < waves; w++) {
    const waveProgress = ((t * 1.2 + w / waves) % 1);
    const radius = waveProgress * 320;
    const alpha = Math.round(220 * Math.sin(waveProgress * Math.PI));
    canvas.drawCircle(cx, cy, radius, 0, 240, 255, alpha, 2);
    if (w % 3 === 0) {
      canvas.drawCircle(cx, cy, radius * 0.95, 160, 100, 255, Math.round(alpha * 0.6), 1);
    }
  }

  // RF Transmitter antenna pole
  canvas.drawLine(cx, cy - 60, cx, cy + 60, 200, 220, 240, 220, 3);
  canvas.drawGlowDot(cx, cy - 60, 5, 255, 170, 0);
  canvas.drawCircle(cx, cy - 60, 12, 255, 170, 0, 160, 1);

  // Real-time spectrum analyzer on the right side
  const specX = WIDTH * 0.68;
  const specW = 180;
  const specY = HEIGHT * 0.82;
  canvas.drawLine(specX, specY, specX + specW, specY, 0, 240, 255, 180, 1);

  const bars = 20;
  const barW = specW / bars - 2;
  for (let b = 0; b < bars; b++) {
    const freqFactor = Math.exp(-Math.pow((b - 10) / 3.5, 2));
    const barH = 10 + Math.sin(t * 8 + b * 0.8) * 10 + freqFactor * 75;
    const bx = specX + b * (barW + 2);
    const by = specY - barH;
    canvas.drawFilledRect(bx, by, barW, barH, 0, 220, 255, 200);
    canvas.drawFilledRect(bx, by - 3, barW, 2, 255, 180, 0, 240);
  }
}

// 5. SOLAR ENERGY: Photovoltaic excitation, current vector flow, fluid movement
function renderSolarEnergy(canvas, progress, t) {
  canvas.clear(8, 10, 14);

  // Sunlight flux rays entering from top right
  for (let r = 0; r < 7; r++) {
    const rx = WIDTH * 0.5 + r * 50;
    const ry = -20;
    const rx2 = WIDTH * 0.2 + r * 40;
    const ry2 = HEIGHT * 0.45;
    const alpha = Math.round(140 + Math.sin(t * 4 + r) * 60);
    canvas.drawLine(rx, ry, rx2, ry2, 255, 200, 50, alpha, 2);
  }

  // Solar PV Cell Array grid
  const pvX = 100;
  const pvY = 110;
  const pvW = 320;
  const pvH = 120;
  canvas.drawFilledRect(pvX, pvY, pvW, pvH, 12, 22, 38, 230);
  canvas.drawRect(pvX, pvY, pvW, pvH, 0, 240, 255, 200);

  // Cell divisions
  for (let cx = pvX; cx <= pvX + pvW; cx += 40) {
    canvas.drawLine(cx, pvY, cx, pvY + pvH, 0, 240, 255, 120, 1);
  }
  for (let cy = pvY; cy <= pvY + pvH; cy += 30) {
    canvas.drawLine(pvX, cy, pvX + pvW, cy, 0, 240, 255, 120, 1);
  }

  // Excited photo-carrier electrons
  for (let e = 0; e < 20; e++) {
    const ex = pvX + 12 + ((e * 47 + t * 50) % (pvW - 24));
    const ey = pvY + 10 + ((e * 31 + t * 35) % (pvH - 20));
    canvas.drawGlowDot(ex, ey, 2, 255, 210, 60);
  }

  // Conduit current flow line toward pump
  const conduitY = 270;
  canvas.drawLine(pvX + pvW / 2, pvY + pvH, pvX + pvW / 2, conduitY, 0, 240, 255, 180, 2);
  canvas.drawLine(pvX + pvW / 2, conduitY, WIDTH - 120, conduitY, 0, 240, 255, 180, 2);

  // Water sine waves at bottom (dewatering discharge)
  for (let x = 0; x < WIDTH; x++) {
    const wy = 320 + Math.sin(x * 0.03 + t * 5) * 8 + Math.sin(x * 0.015 - t * 3) * 5;
    canvas.setPixel(x, wy, 0, 220, 255, 220);
    canvas.setPixel(x, wy + 1, 0, 180, 240, 160);
    canvas.setPixel(x, wy + 2, 0, 120, 200, 100);
  }
}

// 6. AI TRANSITION: Neural network graph, synaptic packet triggers, matrix flow
function renderAiTransition(canvas, progress, t) {
  canvas.clear(6, 8, 14);
  canvas.drawGrid(32, 0, 240, 255, 15);

  // 4-layer Neural Network architecture
  const layers = [
    { x: 120, nodes: [90, 150, 210, 270] },
    { x: 260, nodes: [70, 120, 170, 220, 270, 310] },
    { x: 400, nodes: [80, 140, 200, 260, 305] },
    { x: 530, nodes: [130, 190, 250] },
  ];

  // Synaptic connections with weight activations
  for (let l = 0; l < layers.length - 1; l++) {
    const l1 = layers[l];
    const l2 = layers[l + 1];
    l1.nodes.forEach((y1, i1) => {
      l2.nodes.forEach((y2, i2) => {
        const pulse = Math.sin(t * 6 + l * 2 + i1 * 0.5 + i2 * 0.8);
        if (pulse > 0.3) {
          const alpha = Math.round(pulse * 120);
          canvas.drawLine(l1.x, y1, l2.x, y2, 0, 240, 255, alpha, 1);
        }
      });
    });
  }

  // Active synaptic firing packets
  for (let p = 0; p < 14; p++) {
    const lIdx = p % (layers.length - 1);
    const l1 = layers[lIdx];
    const l2 = layers[lIdx + 1];
    const n1 = l1.nodes[p % l1.nodes.length];
    const n2 = l2.nodes[(p * 2) % l2.nodes.length];

    const pktProg = ((t * 1.5 + p * 0.12) % 1);
    const px = l1.x + (l2.x - l1.x) * pktProg;
    const py = n1 + (n2 - n1) * pktProg;
    canvas.drawGlowDot(px, py, 2.5, 255, 180, 0); // Amber packet
  }

  // Draw Nodes
  layers.forEach((layer) => {
    layer.nodes.forEach((y) => {
      canvas.drawFilledCircle(layer.x, y, 6, 10, 24, 38, 255);
      canvas.drawCircle(layer.x, y, 6, 0, 240, 255, 220, 2);
      canvas.drawFilledCircle(layer.x, y, 2.5, 0, 240, 255, 255);
    });
  });
}

// 7. FINAL SEQUENCE: Full ECE operating system montage
function renderFinalSequence(canvas, progress, t) {
  canvas.clear(5, 7, 11);
  canvas.drawGrid(28, 0, 240, 255, 20);

  // Multi-tier oscilloscope signal streams
  const tracks = [80, 160, 240, 310];
  tracks.forEach((trackY, idx) => {
    canvas.drawLine(0, trackY, WIDTH, trackY, 0, 240, 255, 60, 1);
    for (let x = 0; x < WIDTH; x++) {
      let sig = 0;
      if (idx === 0) sig = Math.sin(x * 0.04 + t * 6) * 24;
      else if (idx === 1) sig = (Math.sin(x * 0.03 + t * 4) > 0 ? 20 : -20);
      else if (idx === 2) sig = (Math.sin(x * 0.06 + t * 8) * 14) + (Math.sin(x * 0.015 - t * 2) * 10);
      else sig = Math.sin(x * 0.02 + t * 5) * Math.sin(x * 0.005 + t) * 28;
      const y = Math.round(trackY + sig);
      canvas.setPixel(x, y, 0, 240, 255, 240);
      canvas.setPixel(x, y + 1, 0, 160, 220, 120);
    }
  });

  // Central system radar telemetry ring
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  canvas.drawCircle(cx, cy, 75, 0, 240, 255, 140, 1);
  canvas.drawCircle(cx, cy, 40, 255, 170, 0, 120, 1);

  // Sweeping radar sweep line
  const sweepAngle = t * 3.5;
  const sx = cx + Math.cos(sweepAngle) * 75;
  const sy = cy + Math.sin(sweepAngle) * 75;
  canvas.drawLine(cx, cy, sx, sy, 0, 240, 255, 240, 2);

  // Vector corner targeting brackets
  canvas.drawRect(25, 25, 20, 20, 0, 240, 255, 160);
  canvas.drawRect(WIDTH - 45, 25, 20, 20, 0, 240, 255, 160);
  canvas.drawRect(25, HEIGHT - 45, 20, 20, 0, 240, 255, 160);
  canvas.drawRect(WIDTH - 45, HEIGHT - 45, 20, 20, 0, 240, 255, 160);
}

// Master execution
async function main() {
  console.log('=== STARTING CINEMATIC VIDEO GENERATION ===');
  const queue = [
    { name: 'boot', renderer: renderBoot },
    { name: 'pcb_flight', renderer: renderPcbFlight },
    { name: 'portrait_transform', renderer: renderPortraitTransform },
    { name: 'rf_wave', renderer: renderRfWave },
    { name: 'solar_energy', renderer: renderSolarEnergy },
    { name: 'ai_transition', renderer: renderAiTransition },
    { name: 'final_sequence', renderer: renderFinalSequence },
  ];

  for (const item of queue) {
    await renderVideo(item.name, item.renderer);
  }

  // Create backward-compatibility alias copies
  console.log('Creating alias copies for backward compatibility...');
  const aliases = [
    { src: 'boot.mp4', dest: 'pcb_boot.mp4' },
    { src: 'pcb_flight.mp4', dest: 'circuit_flight.mp4' },
    { src: 'portrait_transform.mp4', dest: 'portrait_particles.mp4' },
  ];

  for (const alias of aliases) {
    const s = path.join(VIDEO_DIR, alias.src);
    const d = path.join(VIDEO_DIR, alias.dest);
    if (fs.existsSync(s)) {
      fs.copyFileSync(s, d);
      console.log(`  ✓ Alias: ${alias.src} -> ${alias.dest}`);
    }
  }

  console.log('=== ALL 7 CINEMATIC VIDEOS & POSTERS GENERATED SUCCESSFULLY ===');
}

main().catch((err) => {
  console.error('Fatal error generating videos:', err);
  process.exit(1);
});
