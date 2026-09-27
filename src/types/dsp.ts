// ==============================================================================
// HEMASHREE // ECE SYSTEM - DSP & SIGNAL LAB TYPES
// Candidate: Hemashree B M (B.Tech ECE, Alliance University, 2024-2028)
// Verified Coursework: Signals and Systems, Digital Signal Processing
// ==============================================================================

export type SignalWaveform = 'sine' | 'square' | 'triangle';

export type FilterType = 'bypass' | 'fir' | 'iir';

export type FilterClass = 'lowpass' | 'highpass';

export type FilterOrder = 1 | 2 | 4 | 8;

export type WindowFunction = 'rectangular' | 'hamming' | 'hanning';

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface DspSignalParams {
  waveform: SignalWaveform;
  frequency: number; // Hz (1 - 50 Hz simulation scale)
  amplitude: number; // Volts (0.1 - 2.0 V)
  phase: number; // Degrees (0 - 360)
  noiseLevel: number; // 0.0 - 1.0 (0% - 100%)
  noiseType: 'white' | 'hum_harmonic' | 'gaussian';
}

export interface DspFilterParams {
  type: FilterType;
  filterClass: FilterClass;
  cutoffFreq: number; // Hz (2 - 45 Hz)
  order: FilterOrder;
  window: WindowFunction;
  damping: number; // 0.1 - 1.0 (Q factor / pole radius)
}

export interface ScopeDisplaySettings {
  timebase: number; // ms/div (1 to 50)
  voltsPerDiv: number; // V/div (0.1 to 1.0)
  showRawTrace: boolean;
  showFilteredTrace: boolean;
  triggerHold: boolean;
  persistence: boolean;
}

export interface DspTelemetry {
  snrDb: number;
  inputVpp: number;
  inputVrms: number;
  outputVpp: number;
  outputVrms: number;
  attenuationDb: number;
  fundamentalFreq: number;
  isStable: boolean;
  poleRadiusMax: number;
  nyquistFreq: number;
}

export interface DspPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  educationalNote: string;
  signal: DspSignalParams;
  filter: DspFilterParams;
}

export interface DspEducationalConcept {
  id: string;
  title: string;
  shortSummary: string;
  explanation: string;
  engineeringImpact: string;
  realWorldExample: string;
}
