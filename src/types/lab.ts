export type StationId = 
  | 'embedded' 
  | 'sensor' 
  | 'rf' 
  | 'dsp' 
  | 'iot' 
  | 'ai-mobile' 
  | 'power';

export interface LabObject {
  id: string;
  name: string;
  category: string;
  technology: string;
  application: string;
  verifiedNotes: string;
  position: [number, number, number];
  inspectionCameraOffset?: [number, number, number];
  relatedProjectSlug?: string;
}

export interface LabStation {
  id: StationId;
  stationNumber: string;
  name: string;
  domainTitle: string;
  category: string;
  position: [number, number, number];
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  description: string;
  projectSlug?: string;
  objects: LabObject[];
  telemetrySignalType: 'electrical' | 'sensor_pulse' | 'rf_wave' | 'dsp_stream' | 'uart_packet' | 'neural_stream' | 'solar_current';
}

export type LabCameraMode = 'LAB_OVERVIEW' | 'STATION_VIEW' | 'INSPECT_VIEW';
