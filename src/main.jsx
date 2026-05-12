import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Register PWA Service Worker
registerSW({ immediate: true })

// Silence specific Three.js warnings for a clean console
const originalWarn = console.warn
console.warn = (...args) => {
  const message = args[0]?.toString?.() || ''
  if (!message.includes('THREE.Clock')) {
    originalWarn(...args)
  }
}

const loader = document.getElementById('neural-loader')

const initApp = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  // Force loader to stay for 1.8 seconds for a professional transition
  setTimeout(() => {
    if (loader) {
      loader.classList.add('fade-out')
      // Completely remove from DOM after the 0.6s CSS transition
      setTimeout(() => loader.remove(), 600)
    }
  }, 2500) 
}

initApp()