import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

registerSW({ immediate: true })

console.warn = () => {};

const root = document.getElementById('root');
const loader = document.getElementById('neural-loader');

const initSystem = () => {
  const loaderStartTime = performance.now();
  const MIN_LOADER_DURATION = 3000;
  let sceneReady = false;
  let hideLoaderCalled = false;

  const hideLoader = () => {
    if (hideLoaderCalled || !loader) return;
    hideLoaderCalled = true;

    loader.classList.add('fade-out');
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.remove();
      }
    }, 700);
  };

  const checkAndHideLoader = () => {
    if (!sceneReady) return;
    const elapsed = performance.now() - loaderStartTime;
    if (elapsed >= MIN_LOADER_DURATION) {
      hideLoader();
    } else {
      setTimeout(checkAndHideLoader, 50);
    }
  };

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  const handleSceneReady = () => {
    sceneReady = true;
    checkAndHideLoader();
  };

  window.addEventListener('scene-ready', handleSceneReady);

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!sceneReady) {
        sceneReady = true;
        checkAndHideLoader();
      }
    }, 800);
  });

  setTimeout(() => {
    hideLoader();
  }, 18000);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSystem);
} else {
  initSystem();
}

