# Immersive Task Interface

A sophisticated task management application that bridges the gap between traditional CRUD functionality and immersive 3D environments. This project explores the intersection of **React state management** and **WebGL rendering** to create a high-fidelity user experience.

## ✨ Key Features
* **Integrated 3D Environment:** Utilizes `React-Three-Fiber` to render a real-time, responsive 3D background with physically-based lighting.
* **Interactive Ripple System:** A custom event-driven animation system where UI actions (adding/deleting) trigger synchronized 3D visual feedback (Shield/Object pulses).
* **Glassmorphism UI:** Advanced CSS backdrop-filter techniques combined with depth-of-field effects to create a seamless "Glass-on-3D" aesthetic.
* **Persistent State:** LocalStorage integration ensuring data continuity across sessions.

## 🛠️ Tech Stack
* **Frontend:** React 19, Tailwind CSS
* **3D Engine:** Three.js, React-Three-Fiber, React-Three-Drei
* **Post-Processing:** Bloom, Noise, and Vignette effects for cinematic fidelity.
* **Build Tool:** Vite

## 🚀 Getting Started
1. Clone the repository.
2. Run `npm install`.
3. Start the dev server with `npm run dev`.