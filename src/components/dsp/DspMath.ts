// ==============================================================================
// HEMASHREE // ECE SYSTEM - DSP MATHEMATICAL ENGINE (DETERMINISTIC SIMULATION)
// Rigorous discrete signal synthesis, convolution, difference equations,
// frequency response calculation, and Z-plane pole-zero mechanics.
// ==============================================================================

import { 
  DspSignalParams, 
  DspFilterParams, 
  DspTelemetry, 
  ComplexNumber 
} from '../../types/dsp';

// Deterministic pseudo-random number generator for reproducible noise
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Box-Muller Gaussian noise generator
function gaussianNoise(sampleIndex: number, scale: number = 1.0): number {
  const u1 = Math.max(1e-7, pseudoRandom(sampleIndex * 2 + 1));
  const u2 = pseudoRandom(sampleIndex * 2 + 2);
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * scale;
}

/**
 * Generate discrete raw and filtered time-domain waveform arrays
 */
export function generateWaveformData(
  signalParams: DspSignalParams,
  filterParams: DspFilterParams,
  sampleCount: number = 256,
  samplingRate: number = 200, // Hz
  timeOffset: number = 0
): {
  timeArray: number[];
  rawSignal: number[];
  filteredSignal: number[];
  telemetry: DspTelemetry;
} {
  const timeArray: number[] = new Array(sampleCount);
  const rawSignal: number[] = new Array(sampleCount);
  const filteredSignal: number[] = new Array(sampleCount);

  const dt = 1.0 / samplingRate;
  const f0 = signalParams.frequency;
  const A = signalParams.amplitude;
  const phi = (signalParams.phase * Math.PI) / 180;
  const noiseAmp = signalParams.noiseLevel * A * 1.2;

  // 1. Generate Raw Contaminated Signal
  for (let n = 0; n < sampleCount; n++) {
    const t = (n * dt) + timeOffset;
    timeArray[n] = t;

    const theta = 2 * Math.PI * f0 * t + phi;
    let base = 0;

    switch (signalParams.waveform) {
      case 'sine':
        base = A * Math.sin(theta);
        break;
      case 'square':
        base = A * (Math.sin(theta) >= 0 ? 1 : -1);
        break;
      case 'triangle':
        base = (2 * A / Math.PI) * Math.asin(Math.sin(theta));
        break;
    }

    // Add noise model
    let noise = 0;
    if (signalParams.noiseLevel > 0) {
      if (signalParams.noiseType === 'hum_harmonic') {
        // 50Hz hum simulation + 3rd harmonic + broadband jitter
        noise = (Math.sin(2 * Math.PI * 50 * t) * 0.6 +
                 Math.sin(2 * Math.PI * 150 * t) * 0.25 +
                 gaussianNoise(n + Math.floor(timeOffset * 100), 0.3)) * noiseAmp;
      } else {
        // Gaussian thermal/electromagnetic white noise
        noise = gaussianNoise(n + Math.floor(timeOffset * 1000), 0.7) * noiseAmp;
      }
    }

    rawSignal[n] = base + noise;
  }

  // 2. Apply Filtering Engine
  if (filterParams.type === 'bypass') {
    for (let n = 0; n < sampleCount; n++) {
      filteredSignal[n] = rawSignal[n];
    }
  } else if (filterParams.type === 'fir') {
    // FIR Windowed Sinc Filter
    const kernelSize = Math.min(31, Math.max(9, filterParams.order * 4 + 1));
    const kernel = computeFirKernel(
      filterParams.cutoffFreq / samplingRate,
      kernelSize,
      filterParams.window,
      filterParams.filterClass
    );

    for (let n = 0; n < sampleCount; n++) {
      let sum = 0;
      for (let k = 0; k < kernelSize; k++) {
        const idx = n - k;
        if (idx >= 0) {
          sum += kernel[k] * rawSignal[idx];
        } else {
          // Zero-padding or boundary mirror
          sum += kernel[k] * rawSignal[0];
        }
      }
      filteredSignal[n] = sum;
    }
  } else {
    // IIR Butterworth Filter using recursive difference equation
    const fc = Math.min(filterParams.cutoffFreq, samplingRate * 0.45);
    const coeffs = computeIirCoefficients(
      fc / samplingRate,
      filterParams.order,
      filterParams.filterClass,
      filterParams.damping
    );

    // Cascaded biquad simulation
    let currentSignal = [...rawSignal];

    coeffs.forEach((biquad) => {
      const stageOut = new Array(sampleCount);
      let x1 = currentSignal[0], x2 = currentSignal[0];
      let y1 = currentSignal[0], y2 = currentSignal[0];

      for (let n = 0; n < sampleCount; n++) {
        const x0 = currentSignal[n];
        const y0 = biquad.b0 * x0 + biquad.b1 * x1 + biquad.b2 * x2 - biquad.a1 * y1 - biquad.a2 * y2;
        stageOut[n] = y0;
        x2 = x1;
        x1 = x0;
        y2 = y1;
        y1 = y0;
      }
      currentSignal = stageOut;
    });

    for (let n = 0; n < sampleCount; n++) {
      filteredSignal[n] = currentSignal[n];
    }
  }

  // 3. Compute Real-Time Telemetry & Metrics
  let rawMin = Infinity, rawMax = -Infinity, rawSumSq = 0;
  let filtMin = Infinity, filtMax = -Infinity, filtSumSq = 0;

  for (let n = 0; n < sampleCount; n++) {
    const r = rawSignal[n];
    const f = filteredSignal[n];

    if (r < rawMin) rawMin = r;
    if (r > rawMax) rawMax = r;
    rawSumSq += r * r;

    if (f < filtMin) filtMin = f;
    if (f > filtMax) filtMax = f;
    filtSumSq += f * f;
  }

  const rawVpp = rawMax - rawMin;
  const rawVrms = Math.sqrt(rawSumSq / sampleCount);
  const filtVpp = filtMax - filtMin;
  const filtVrms = Math.sqrt(filtSumSq / sampleCount);

  // Estimated Signal to Noise Ratio
  const snrDb = signalParams.noiseLevel === 0 
    ? 45.0 
    : Math.max(3.0, 20 * Math.log10(A / Math.max(0.01, noiseAmp)));

  const attenuationDb = filterParams.type === 'bypass'
    ? 0.0
    : Math.min(48.0, Math.max(0, 20 * Math.log10((rawVpp + 0.001) / (filtVpp + 0.001))));

  const poles = computePoles(filterParams);
  const maxRadius = Math.max(...poles.map(p => Math.sqrt(p.re * p.re + p.im * p.im)), 0);
  const isStable = maxRadius < 0.999;

  return {
    timeArray,
    rawSignal,
    filteredSignal,
    telemetry: {
      snrDb: Number(snrDb.toFixed(1)),
      inputVpp: Number(rawVpp.toFixed(2)),
      inputVrms: Number(rawVrms.toFixed(2)),
      outputVpp: Number(filtVpp.toFixed(2)),
      outputVrms: Number(filtVrms.toFixed(2)),
      attenuationDb: Number(attenuationDb.toFixed(1)),
      fundamentalFreq: f0,
      isStable,
      poleRadiusMax: Number(maxRadius.toFixed(3)),
      nyquistFreq: samplingRate / 2,
    },
  };
}

/**
 * Compute FIR Windowed Sinc Kernel
 */
function computeFirKernel(
  normCutoff: number,
  size: number,
  windowType: 'rectangular' | 'hamming' | 'hanning',
  filterClass: 'lowpass' | 'highpass'
): number[] {
  const h: number[] = new Array(size);
  const M = size - 1;
  const mid = M / 2;
  const fc = Math.max(0.01, Math.min(0.48, normCutoff));

  let sum = 0;
  for (let n = 0; n < size; n++) {
    const k = n - mid;
    // Sinc function
    let val = k === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * k) / (Math.PI * k);

    // Apply Window
    let w = 1.0;
    if (windowType === 'hamming') {
      w = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / M);
    } else if (windowType === 'hanning') {
      w = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / M);
    }

    h[n] = val * w;
    sum += h[n];
  }

  // Normalize lowpass for unity DC gain
  for (let n = 0; n < size; n++) {
    h[n] /= sum;
  }

  // Spectral inversion for highpass
  if (filterClass === 'highpass') {
    for (let n = 0; n < size; n++) {
      h[n] = -h[n];
    }
    h[Math.floor(mid)] += 1.0;
  }

  return h;
}

interface BiquadCoeffs {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
}

/**
 * Compute IIR Butterworth Biquad section coefficients
 */
function computeIirCoefficients(
  normCutoff: number,
  order: number,
  filterClass: 'lowpass' | 'highpass',
  damping: number
): BiquadCoeffs[] {
  const sections: BiquadCoeffs[] = [];
  const numBiquads = Math.max(1, Math.floor(order / 2));
  const fc = Math.max(0.01, Math.min(0.45, normCutoff));

  // Bilinear transform pre-warping
  const omega = Math.tan(Math.PI * fc);
  const omega2 = omega * omega;

  for (let i = 0; i < numBiquads; i++) {
    const angle = (Math.PI / (2 * order)) * (2 * i + 1);
    const Q = 1.0 / (2.0 * Math.cos(angle) * Math.max(0.2, damping));
    const alpha = omega / (2.0 * Q);

    const norm = 1.0 / (1.0 + 2.0 * alpha + omega2);

    if (filterClass === 'lowpass') {
      sections.push({
        b0: omega2 * norm,
        b1: 2.0 * omega2 * norm,
        b2: omega2 * norm,
        a1: 2.0 * (omega2 - 1.0) * norm,
        a2: (1.0 - 2.0 * alpha + omega2) * norm,
      });
    } else {
      // Highpass
      sections.push({
        b0: norm,
        b1: -2.0 * norm,
        b2: norm,
        a1: 2.0 * (omega2 - 1.0) * norm,
        a2: (1.0 - 2.0 * alpha + omega2) * norm,
      });
    }
  }

  return sections;
}

/**
 * Compute Poles and Zeros in complex Z-plane for stability analysis
 */
export function computePoles(filterParams: DspFilterParams): ComplexNumber[] {
  if (filterParams.type === 'fir') {
    // FIR filters only have poles at the origin z = 0 (all stable)
    return Array.from({ length: filterParams.order }, () => ({ re: 0, im: 0 }));
  }

  if (filterParams.type === 'bypass') {
    return [];
  }

  // IIR Butterworth poles mapped into Z-plane
  const poles: ComplexNumber[] = [];
  const N = filterParams.order;
  const fc = Math.min(45, Math.max(2, filterParams.cutoffFreq)) / 100;
  const radius = Math.min(0.96, 0.4 + fc * 0.8) * Math.min(1.05, filterParams.damping * 1.3);

  for (let k = 0; k < N; k++) {
    const theta = Math.PI * (0.5 + (2 * k + 1) / (2 * N));
    const re = radius * Math.cos(theta);
    const im = radius * Math.sin(theta);
    poles.push({ re, im });
  }

  return poles;
}

export function computeZeros(filterParams: DspFilterParams): ComplexNumber[] {
  if (filterParams.type === 'bypass') return [];

  const zeros: ComplexNumber[] = [];
  const N = filterParams.order;

  if (filterParams.type === 'fir') {
    // Zeros clustered in stopband notches
    for (let k = 0; k < N; k++) {
      const angle = (2 * Math.PI * (k + 1)) / (N + 1);
      zeros.push({ re: Math.cos(angle), im: Math.sin(angle) });
    }
    return zeros;
  }

  // IIR Lowpass has zeros at z = -1 (Nyquist frequency)
  if (filterParams.filterClass === 'lowpass') {
    for (let k = 0; k < N; k++) {
      zeros.push({ re: -1.0, im: 0 });
    }
  } else {
    // Highpass has zeros at z = +1 (DC frequency)
    for (let k = 0; k < N; k++) {
      zeros.push({ re: 1.0, im: 0 });
    }
  }

  return zeros;
}

/**
 * Compute Magnitude Response Points for Bode Plot
 */
export function computeFrequencyResponse(
  filterParams: DspFilterParams,
  pointsCount: number = 64,
  maxFreq: number = 50
): { freq: number; magnitudeDb: number; linearGain: number }[] {
  const result: { freq: number; magnitudeDb: number; linearGain: number }[] = [];
  const fc = filterParams.cutoffFreq;
  const N = filterParams.order;

  for (let i = 0; i < pointsCount; i++) {
    const f = (i / (pointsCount - 1)) * maxFreq + 0.5;

    if (filterParams.type === 'bypass') {
      result.push({ freq: f, magnitudeDb: 0, linearGain: 1.0 });
      continue;
    }

    let gain = 1.0;
    if (filterParams.filterClass === 'lowpass') {
      const ratio = f / fc;
      gain = 1.0 / Math.sqrt(1.0 + Math.pow(ratio, 2 * N));
    } else {
      const ratio = fc / f;
      gain = 1.0 / Math.sqrt(1.0 + Math.pow(ratio, 2 * N));
    }

    // Convert to dB
    const magDb = Math.max(-60, 20 * Math.log10(Math.max(0.001, gain)));
    result.push({
      freq: Number(f.toFixed(1)),
      magnitudeDb: Number(magDb.toFixed(1)),
      linearGain: Number(gain.toFixed(3)),
    });
  }

  return result;
}

/**
 * Compute Discrete FFT Spectrum Bars for Spectrum Analyzer
 */
export function computeFftSpectrum(
  timeSignal: number[],
  numBins: number = 24,
  maxFreq: number = 50
): { binFreq: number; magnitude: number; db: number }[] {
  const N = timeSignal.length;
  const bins: { binFreq: number; magnitude: number; db: number }[] = [];

  for (let k = 0; k < numBins; k++) {
    const binFreq = ((k + 1) / numBins) * maxFreq;
    let real = 0;
    let imag = 0;

    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      real += timeSignal[n] * Math.cos(angle);
      imag -= timeSignal[n] * Math.sin(angle);
    }

    const mag = (2 * Math.sqrt(real * real + imag * imag)) / N;
    const db = Math.max(-50, 20 * Math.log10(Math.max(0.005, mag)));

    bins.push({
      binFreq: Number(binFreq.toFixed(1)),
      magnitude: Number(Math.min(1.5, mag).toFixed(3)),
      db: Number(db.toFixed(1)),
    });
  }

  return bins;
}

/**
 * Generate human-readable difference equation for HUD display
 */
export function formatDifferenceEquation(filterParams: DspFilterParams): string {
  if (filterParams.type === 'bypass') {
    return 'y[n] = x[n]  (Direct Pass-Through)';
  }

  if (filterParams.type === 'fir') {
    const M = filterParams.order * 2;
    return `y[n] = ∑ (k=0 to ${M}) h[k] · x[n - k]  [FIR ${filterParams.window.toUpperCase()} WINDOW]`;
  }

  // IIR
  if (filterParams.order === 1) {
    const alpha = (filterParams.cutoffFreq / 50).toFixed(2);
    return `y[n] = ${alpha}·x[n] + ${(1 - Number(alpha)).toFixed(2)}·y[n-1]`;
  }

  return `y[n] = b₀·x[n] + b₁·x[n-1] + b₂·x[n-2] - a₁·y[n-1] - a₂·y[n-2]  [N=${filterParams.order} BUTTERWORTH]`;
}
