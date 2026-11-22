# Break the Rules, Discover the Science

An AI-powered universal science laboratory, interactive STEM smart-learning studio, and algorithm/machine-learning exploration platform designed for curious students, educators, and makers.

---

## Overview

**Break the Rules, Discover the Science** combines deterministic physics, chemistry, biology, astronomy, and computer science simulations with structured AI-assisted concept exploration, safety-guarded experiment design, real-time interactive visualizations, and downloadable educational MP4 video lessons.

Every interactive model uses verified deterministic equations and safety classification rules so the laboratory remains reliable, educational, and offline-resilient even when external AI quotas are unavailable.

---

## Key Features

- **Virtual Science Lab (`VirtualLabPage` & `VirtualLabRoom`)**
  - Interactive multi-department laboratory workbench (Physics, Chemistry, Biology, Astronomy, Engineering, Environmental Science)
  - Apparatus cabinet, chemical reagent drawer, live thermal & reaction engine (`chemistryReactions.ts`), dynamic glassware SVG states (liquid coloring, gas evolution bubbles, precipitate formation), trial logging, and prediction challenges
  - Dedicated **Boiling vs. Altitude & Atmospheric Pressure Lab** (`BoilingAltitudeLab`)
  - Interactive graphing workspace (`ExperimentGraphWorkspace`) powered by Recharts and CSV/PDF export (`exportUtils.ts`)

- **AI Smart Learning Studio (`SmartLearningPage`)**
  - Structured multi-section STEM concept studio supporting **English** and **Kannada (ಕನ್ನಡ)**
  - Real-time **HTML5 Canvas 2D** concept animations (`smartCanvasRenderer.ts` & `ConceptVideoPlayer.tsx`) with interactive parameter sliders, synchronized `.srt` subtitle tracks, procedure-first practical breakdowns (`ProcedureFirstExperimentView.tsx`), and 5-question interactive quizzes
  - Optional Gemini TTS narration (`gemini-3.8-flash-lite-tts`) and server-side **FFmpeg MP4 compilation** (`/api/smart-learning/render/*`)

- **Universal Science Explorer (`ScienceExplorerPage`)**
  - Ask any STEM question, get structured scientific principles, variables, formulas, limitations, safety classification, matched Virtual Lab models, and Wikimedia/NASA educational video search (`videoSearch.ts`)

- **AI Experiment Creator (`ExperimentCreatorPage`)**
  - Describe a hypothesis or "what-if" idea to generate a structured experiment protocol with validated calculation templates and safety checks

- **Algorithm & ML Explorer (`AlgorithmExplorerPage`)**
  - Step-by-step deterministic execution & visual animations for sorting, searching, graph traversal, and dynamic programming algorithms (`algorithmExecutor.ts`)
  - Side-by-side complexity comparison (`AlgorithmComparisonPanel.tsx`)
  - Live **UCI Machine Learning Repository** dataset search/loader (`uciDatasets.ts`) and interactive **ML Playground** (`mlEngine.ts`)

- **Safety Guardian, Science Detective & Community Modes**
  - Rule-based **Safety Guardian** (`safetyEngine.ts`) that flags unsafe prompts (`GREEN` / `YELLOW` / `RED`) before AI or simulation execution
  - **Science Detective** Socratic tutor (`ScienceDetectivePage`)
  - **What-If Studio**, **Challenges**, **World Discoveries**, **Innovation Hub**, **Teacher Mode**, **Dashboard**, **My Learning**, **Achievements**, **Trust Centre**, and **Settings**

---

## Technologies Used

### Frontend
- **React 19** (`react`, `react-dom`)
- **TypeScript 7**
- **Vite 8** (`@vitejs/plugin-react`)
- **Tailwind CSS v4** (`@tailwindcss/vite`, `tailwindcss`)
- **Lucide React** (`lucide-react`) for icons
- **Recharts** (`recharts`) for scientific data plotting
- **Motion** (`motion`) for UI transitions
- **jsPDF** (`jspdf`) for lab report PDF export

### Backend & Tooling
- **Node.js (v22+ ESM)** & **Express 4** (`express`)
- **Google GenAI SDK** (`@google/genai`) — server-side only via `/api/*`
- **dotenv** (`dotenv`) for environment variables
- **tsx** (`tsx`) for TypeScript development execution
- **FFmpeg** *(optional system binary)* for server-side MP4 lesson compilation

---

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── README.md
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── server/
│   ├── aiService.ts
│   └── smartLearningService.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── assets/images/          # Static hero & category JPEG assets
    ├── components/
    │   ├── algorithms/         # Algorithm visualizer, comparison, ML playground & UCI explorer
    │   ├── explorer/           # Video stage & scientific SVG fallbacks
    │   ├── lab/                # Virtual lab workbench, equipment, graphs & trials
    │   ├── layout/             # TopHeader & Sidebar navigation
    │   ├── smart/              # Smart Learning video player & practical procedure view
    │   └── ui/                 # Accordion, DrawingCanvas, Modal
    ├── context/                # Global LabContext state & localStorage persistence
    ├── data/                   # Experiments, chemicals, reactions, equipment, UCI & algorithms
    ├── engine/                 # Deterministic math/physics/ML/lesson/safety/i18n engines
    ├── pages/                  # All 18 application pages
    ├── types/                  # TypeScript definitions
    └── utils/                  # Export utilities (CSV / PDF / JSON)
```

---

## Dependencies

### Runtime Dependencies (`package.json`)
- `@google/genai`
- `@tailwindcss/vite`
- `@vitejs/plugin-react`
- `dotenv`
- `express`
- `jspdf`
- `lucide-react`
- `motion`
- `react`
- `react-dom`
- `recharts`
- `vite`

### Development Dependencies (`package.json`)
- `@types/express`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `autoprefixer`
- `esbuild`
- `tailwindcss`
- `tsx`
- `typescript`

### Optional System Dependencies
- **FFmpeg & FFprobe** (only needed if you want to export MP4 videos from **AI Smart Learning**; the rest of the app and browser Canvas player work without FFmpeg).

---

## Installation Instructions

1. **Prerequisites**
   - Install **Node.js v22 or newer** (required for running `node server.ts` directly in production via native TypeScript type stripping).
   - *(Optional)* Install **FFmpeg** (`sudo apt install ffmpeg` on Ubuntu/Debian, `brew install ffmpeg` on macOS) for server-side MP4 video exports.

2. **Install npm packages**
   ```bash
   npm install
   ```

---

## Environment Variable Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set your secrets (never commit `.env` to GitHub):
   ```dotenv
   # Optional for live Gemini AI explanations & TTS narration.
   # If omitted, all deterministic Virtual Labs, Smart Learning lessons,
   # Canvas animations, and Algorithm Explorers still work via verified fallbacks.
   GEMINI_API_KEY="your-actual-gemini-api-key"

   # Optional public URL of your deployed app
   APP_URL="http://localhost:3000"

   # Optional server port (defaults to 3000)
   PORT=3000
   ```

---

## How to Run Locally

Start the combined Express API + Vite dev server on port `3000`:

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

To run TypeScript type-checking:

```bash
npm run lint
```

---

## Build Instructions (Production)

1. Build the Vite frontend into `dist/` (and copy `src/assets` into `dist/src/assets`):
   ```bash
   npm run build
   ```
2. Start the production Express server (serves both `/api/*` endpoints and static `dist/`):
   ```bash
   NODE_ENV=production npm start
   ```
   *(On Windows PowerShell: `$env:NODE_ENV="production"; npm start`)*

---

## Deployment Instructions

This is a full-stack Node.js + Vite application (`server.ts` serves both the Express API and the built `dist/` SPA on `process.env.PORT || 3000`).

### Option 1: Cloud Run / Docker / VPS / Render / Railway
1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `NODE_ENV=production npm start` (runs `node server.ts`)
3. **Runtime**: Node.js `>= 22.x`
4. **Environment Variables**:
   - `NODE_ENV=production`
   - `GEMINI_API_KEY` *(optional secret for live Gemini features)*
   - `APP_URL` *(your public deployment URL)*
   - `PORT` *(automatically provided by Cloud Run / Render / Railway, defaults to `3000`)*

### Option 2: Uploading to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Break the Rules, Discover the Science"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
`.gitignore` automatically excludes `node_modules/`, `dist/`, `.env*`, and archive `.zip` files so no secrets or build artifacts are pushed.
