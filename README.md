# HEMASHREE // ECE SYSTEM
### Autonomous 3D Portfolio & Interactive Engineering Operating System

> **Candidate**: Hemashree B M  
> **Degree**: B.Tech Electronics & Communication Engineering (2024–2028)  
> **Institution**: Alliance College of Engineering and Design, Alliance University, Bengaluru  
> **Cumulative CGPA**: 7.50  
> **Core Engineering Vector**: `Signal → Circuit → Hardware → Embedded → Software → AI → Real World`

---

## 🛰️ Overview

**HEMASHREE // ECE SYSTEM** is a futuristic, interactive 3D portfolio and digital engineering laboratory. Rather than presenting a static resume, the system functions as a high-fidelity cyber-physical engineering workstation that visualizes circuit designs, firmware logic, signal processing pipelines, and applied machine learning architectures in real time.

---

## ⚡ Architecture & Section Breakdown

The system comprises 8 integrated navigation and spatial zones:

1. **`01 HERO` // ECE Core Online**:
   - 8-12s cinematic power-on boot sequence with electrical pulses, PCB trace illumination, biometric facial lock scan, and ECE Core initialization.
   - Interactive 3D oscilloscope, rotating holographic identity plane, and quick-navigation HUD.

2. **`02 PROFILE` // Academic Source of Truth**:
   - Official credentials from Alliance University: Register number (`2024BTUCE011`), Semester III CGPA (`7.50`), and verified domain capabilities.
   - **Nano Banana 6-Slot Portrait Switcher**: Interactive switcher presenting 6 photographic concepts (Hero, Electronics Workbench, Holographic Schematic, Academic Dossier, HUD Profile, and AI Hybrid).
   - Biometric lock verification, direct resume PDF preview and download.

3. **`03 ECE LAB` // Active Hardware Workstations**:
   - Real-time 3D engineering arena with 8 inspectable hardware stations:
     - Microcontroller Workstation (ATmega328P / Arduino)
     - Wireless / IoT Station (ESP32 & BLE)
     - RF Signal Sniffer Station (Passive LC tank & envelope detector)
     - Digital Signal Processing Bench (FIR/IIR filter synthesis)
     - Sensor Interfacing Bench (Ultrasonic HC-SR04 & LDR)
     - Power Electronics & Relay Switching Station
     - Mobile & Applied AI Terminal (Flutter, Gemini AI, SQLite)
     - Renewable Power & Dewatering Bench (Solar PV & PWM controller)
   - Dynamic signal flow particle streams interconnecting active stations.

4. **`04 PROJECTS` // 8 Interactive Engineering Experiences**:
   - Interactive simulations depicting: `Input → Sensor Conditioning → Microcontroller Processing → Actuator Output → Real-World Effect`:
     - **Lifemate**: AI voice-first everyday life companion (v2.0.1, Android 14/15, SQLite offline-first).
     - **Bhoomi Mitra**: AI agricultural intelligence with vernacular Kannada/English NLP.
     - **Solar-Powered Dewatering**: Autonomous pit evacuation with inductive startup dimensioning.
     - **Smart Ultrasonic Blind Stick**: Obstacle range detection with PWM audio feedback.
     - **Bluetooth Device Controller**: HC-05 SPP UART serial transceiver and relay switching.
     - **Cell Phone Signal Sniffer**: Passive RF absorption and LM358 op-amp comparator.
     - **Light Sensing Smart Streetlight**: Autonomous day/night photoresistor switching.
     - **DSP Noise Filtering**: Multi-stage audio denoising and Butterworth filtering.
   - Contextual **Veo Cinematic B-Roll** triggers for each engineering domain.

5. **`05 SIGNALS` // DSP Interactive Environment**:
   - Browser-based DSP laboratory combining virtual oscilloscope, spectrum analyzer, and noise injection bench.
   - Real-time signal generation: 1 kHz audio tone, multi-tone voice synthesis, and industrial telemetry pulse.
   - Configurable noise injection: Gaussian white noise, 50 Hz AC mains hum, and high-frequency RF spikes.
   - Filter synthesis engine: 64-tap FIR Low-Pass (Blackman window), 4th-order IIR Butterworth Low-Pass, and 50 Hz Notch filter.
   - Live oscilloscope display with persistence mode, trigger freeze, timebase adjustments, and simulated SNR/Vpp telemetry.

6. **`06 MISSIONS` // Hackathons & Repositories**:
   - Documented hackathon and challenge track records:
     - Smart India Hackathon (SIH) 2024 (ISRO Space Telemetry track)
     - Alliance University 6-Hour Rapid Hackathon (Agritech Vernacular AI)
     - Tech Ideation Challenge 2024
   - Direct links to verified GitHub repositories and release builds.

7. **`07 ARCHIVE` // Credentials & Academic Records**:
   - Verified certifications: C for Beginners (Simplilearn), Python for Data Science (Cognitive Class), AI Mastery (LinkedIn Learning).
   - Rigorous semester-by-semester engineering coursework (Analog Electronics, Digital Design, Network Analysis, Signals & Systems, VHDL, Control Systems).

8. **`08 TRANSMISSION` // Recruiter Contact Console**:
   - Recruiter-focused inquiry terminal with pre-filled engineering intent buttons (Interview Request, Technical Inquiries, Project Collaboration).
   - Candidate direct contact coordinates (Alliance University, LinkedIn, GitHub, Phone, Email).

---

## 🎬 Cinematic Asset Pipeline

The portfolio integrates two creative asset pipelines:

- **Nano Banana Photographic Portraits** (`public/assets/portraits/`):
  - High-resolution (1024×1024) WebP assets preserving candidate facial anatomy, eye shape, and skin tone:
    - `hero.webp`
    - `engineering_lab.webp`
    - `hologram.webp`
    - `profile.webp`
    - `side_profile.webp`
    - `ai_circuit.webp`
    - `Ph.jpeg` (Candidate original verified identity anchor)

- **Veo Cinematic Video Interstitials** (`public/assets/video/`):
  - 7 Web-optimized H.264 MP4 clips (30 fps, 640×360, lightweight ~90–400 KB) with matching WebP posters:
    - `boot.mp4` / `boot.webp`
    - `pcb_flight.mp4` / `pcb_flight.webp`
    - `portrait_transform.mp4` / `portrait_transform.webp`
    - `rf_wave.mp4` / `rf_wave.webp`
    - `solar_energy.mp4` / `solar_energy.webp`
    - `ai_transition.mp4` / `ai_transition.webp`
    - `final_sequence.mp4` / `final_sequence.webp`

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Core** | React 18, TypeScript, Vite 5 |
| **3D & Canvas** | Three.js, React Three Fiber (R3F), React Three Drei |
| **Motion & Directing** | GSAP, Canvas 2D API |
| **Styling & HUD** | Tailwind CSS, Lucide React, Glassmorphism & Cyber-Physical HUD overlays |
| **Audio & Media** | Web Audio API procedural synthesizer, HTML5 Video with IntersectionObserver |
| **Deployment Target** | Cloudflare Pages (Static Edge Distribution) |

---

## 🚀 Local Development & Build

### Prerequisites
- Node.js `v18.0.0` or higher (`v20+` or `v24+` recommended)
- npm `v9.0.0` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/Hemashreebm/hemashree-ece-system.git

# Navigate to project directory
cd hemashree-ece-system

# Install dependencies
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Run Production Build
```bash
npm run build
```
Generates a zero-error, optimized production bundle inside `dist/`.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally at **[http://localhost:4173](http://localhost:4173)**.

---

## ☁️ Cloudflare Pages Deployment

This portfolio is configured as a purely static single-page application and does not require server-side functions or edge workers.

### Step-by-Step Setup:
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub repository: **`rithwikkr0/hemashree-ece-system`**.
4. Configure Build settings:
   - **Project name**: `hemashree-portfolio`
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave blank)
   - **Node version**: `20.18.0` (automatically read from `.node-version`)
   - **Environment variables**: *None required* (100% self-contained static build).
5. Click **Save and Deploy**.
6. Cloudflare Pages will build and deploy the application globally at **`https://hemashree-portfolio.pages.dev`**.

---

## 🔒 Security & Data Integrity

- Zero private API keys, secrets, or passwords committed.
- All non-factual visual demonstrations are strictly labeled `[SIMULATION]` or `[ILLUSTRATIVE VISUALIZATION]`.
- All academic qualifications and projects conform strictly to verified candidate records.

---

## 📄 License
Created for **Hemashree B M** — B.Tech Electronics & Communication Engineering, Alliance University (2024–2028). All rights reserved.
