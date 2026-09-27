export type ECEDomain = 
  | 'SIGNAL' 
  | 'CIRCUIT' 
  | 'HARDWARE' 
  | 'EMBEDDED' 
  | 'SOFTWARE' 
  | 'AI' 
  | 'REAL_WORLD';

export interface PipelineStep {
  stepNumber: number;
  label: string;
  sublabel?: string;
  type: 'sensor' | 'signal' | 'processing' | 'logic' | 'cloud' | 'actuator' | 'ui';
  description: string;
}

export interface ProjectComponent {
  name: string;
  role: string;
  specs?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  domain: ECEDomain;
  category: string;
  status: 'Deployed' | 'Completed' | 'Hardware Prototype' | 'Academic Simulation';
  featured: boolean;
  order: number;
  problem: string;
  solution: string;
  technicalHighlights: string[];
  pipeline: PipelineStep[];
  techStack: string[];
  hardwareComponents?: ProjectComponent[];
  links: {
    github?: string;
    live?: string;
    reportPdf?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  modelType: 'phone' | 'satellite' | 'solar' | 'blindstick' | 'relay' | 'rf' | 'ldr' | 'dsp';
}

export interface SkillItem {
  name: string;
  level: 'Demonstrated' | 'Proficient' | 'Coursework' | 'Advanced';
  tags: string[];
  subsystem?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  systemCode: string;
  icon: string;
  description: string;
  items: SkillItem[];
}

export interface HackathonMission {
  id: string;
  missionCode: string;
  event: string;
  organizer: string;
  year: number;
  dateStr?: string;
  role: string;
  project?: string;
  outcome: string;
  verified: boolean;
  status: 'Completed' | 'Upcoming' | 'Milestone';
  description: string;
  tags: string[];
}

export interface Certification {
  id: string;
  code: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  verificationStatus: 'Verified' | 'Completed' | 'Academic Record';
  category: 'Embedded' | 'Electronics' | 'DSP' | 'AI & Data' | 'Networking' | 'Tools & Design';
  skillsLearned: string[];
}

export interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  stream: string;
  score: {
    type: 'CGPA' | 'Percentage';
    value: string;
    scale?: string;
  };
  status: 'In Progress' | 'Completed';
  registerNumber?: string;
  coursework?: string[];
  highlights?: string[];
}

export interface SystemProfile {
  name: string;
  title: string;
  designation: string;
  institution: string;
  department: string;
  yearSpan: string;
  currentStatus: string;
  currentCGPA: string;
  dob: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  lifemateRepo: string;
  lifemateLive: string;
  systemSummary: string;
}
