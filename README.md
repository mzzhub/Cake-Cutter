# 🎂 Cake Cutter AR

> **An AI-powered Augmented Reality Web Application that auto-detects food objects (cakes, pizzas, donuts, pies) and overlays precise equal portion lines in real-time.**

Built with **React**, **Vite**, **Tailwind CSS**, and **TensorFlow.js**. 100% client-side with **zero backend required** — ready for instant hosting on **GitHub Pages**.

---

## ✨ Features

- **🤖 In-Browser AI Detection**: Uses TensorFlow.js with the pre-trained `COCO-SSD` model to detect `cake`, `pizza`, `donut`, `apple`, `sandwich`, `bowl`, etc. directly in the browser.
- **🍕 Radial & Grid Slice Math**:
  - **Radial / Pie Slices**: Divides round objects into $N$ equal angle slices ($360^\circ / N$).
  - **Parallel Strips**: Divides rectangular cakes or brownies into vertical slices.
  - **Grid Matrix**: Divides sheet cakes into row $\times$ column matrix slices.
- **📱 Rear Camera Mobile Priority**: Automatically requests rear-facing `environment` camera on smartphones & tablets.
- **✨ Neon AR Overlay Styling**: Glowing cyan/pink dashed line vectors with high-DPI scaling and slice numbers ($1, 2, \dots, N$).
- **🔒 Position Lock & Manual Touch Target**: Tap the screen anytime to place a manual target circle or lock the AR overlay position while cutting.
- **📸 High-Res AR Photo Snapshot**: Save and download crisp photos of your cake with portion lines overlaid.
- **⚡ GitHub Pages Ready**: Pure static SPA bundled with Vite and configured for relative asset paths.

---

## 📁 Repository Structure

```text
Cake Cutter/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions automated deployment workflow
├── src/
│   ├── components/
│   │   ├── CameraView.jsx  # HTML5 Video container & placeholder state
│   │   ├── CanvasOverlay.jsx # HTML5 Canvas high-res AR rendering & drag touch
│   │   ├── Controls.jsx    # Piece counter, presets, cut styles, theme picker
│   │   ├── Header.jsx      # Top glass bar with AI model status badge
│   │   ├── StatusBanner.jsx# Live detection notifications & advice
│   │   └── HelpModal.jsx   # Interactive step-by-step user guide
│   ├── hooks/
│   │   ├── useCamera.js    # Camera stream, facingMode, torch, permissions
│   │   └── useObjectDetection.js # TF.js model loader & EMA bounding box smoother
│   ├── utils/
│   │   └── drawingUtils.js # Neon AR vector algorithms & geometry math
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Tailwind directives & glassmorphism theme
│   └── main.jsx            # React root mount
├── standalone.html          # Self-contained single-file version (no npm required)
├── index.html               # Vite HTML entry point
├── package.json             # NPM dependencies & scripts
├── vite.config.js           # Vite config with relative base path
├── tailwind.config.js       # Custom neon colors & glass shadows
└── README.md                # Documentation & GitHub Pages Guide
```

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- NPM or PNPM

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/cake-cutter.git
cd cake-cutter
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🚀 Deployment to GitHub Pages

### Option 1: Automated GitHub Actions (Recommended)

1. Push your repository to GitHub (`main` branch):
   ```bash
   git add .
   git commit -m "Deploy Cake Cutter AR"
   git push origin main
   ```
2. Go to your GitHub repository **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment**, set **Source** to `GitHub Actions`.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish your site!

### Option 2: Manual CLI Deployment

You can also deploy manually using the `gh-pages` package included in `package.json`:
```bash
npm run deploy
```

---

## 💡 Mobile Testing & HTTPS Note

Modern mobile browsers (iOS Safari & Android Chrome) require a **Secure Context (HTTPS)** to allow camera access via `navigator.mediaDevices.getUserMedia`. 

- **Hosted Site**: When deployed to GitHub Pages (`https://<username>.github.io/cake-cutter/`), camera access works out-of-the-box.
- **Local Testing on Mobile**: Use `localhost` on your computer or tunnel via `npx localtunnel --port 3000` or `ngrok http 3000` to get an `https://` link for your smartphone.

---

## 📄 License

MIT License — Free to use, modify, and distribute.
