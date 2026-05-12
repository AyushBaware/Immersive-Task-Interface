import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Service Worker for Offline Mobile PWA use
registerSW({ immediate: true })

// Optimization: Silence warnings for cleaner production logs
console.warn = () => {};

const root = document.getElementById('root');
const loader = document.getElementById('neural-loader');

const initSystem = () => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Use 'load' event to ensure 3D textures/fonts are in memory
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
        // Clean removal after animation finishes
        setTimeout(() => loader.remove(), 600);
      }
    }, 1500); // 1.5s forced minimum for professional "Intro" feel
  });
};

initSystem();