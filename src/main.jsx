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

/**
 * 🔷 LOADING SYNCHRONIZATION MECHANISM
 * 
 * Waits for React App to signal Scene readiness through a custom event.
 * The loader only fades after the 3D assets are fully initialized.
 * Implements fallback to prevent infinite loading screens.
 */
const initSystem = () => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Listen for Scene ready signal from App.jsx
  let hideLoaderCalled = false;

  const hideLoader = () => {
    if (hideLoaderCalled || !loader) return;
    hideLoaderCalled = true;

    // Fade out the loader
    loader.classList.add('fade-out');
    
    // Remove from DOM after transition completes
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.remove();
      }
    }, 600);
  };

  // Listen for custom event fired by App.jsx when Scene is ready
  window.addEventListener('scene-ready', () => {
    setTimeout(() => {
      hideLoader();
    }, 500); // Hold the loader briefly for stronger first impression
  });

  // Fallback: ensure loader disappears after window load + reasonable delay
  // This prevents infinite loading screens on mobile or if event is missed
  window.addEventListener('load', () => {
    setTimeout(() => {
      hideLoader();
    }, 2000); // 2s delay from window load event
  });

  // Ultimate fallback: if nothing happened after 10s, force hide the loader
  setTimeout(() => {
    hideLoader();
  }, 10000);
};

initSystem();