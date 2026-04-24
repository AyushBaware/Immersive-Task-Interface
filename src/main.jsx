import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Properly suppress THREE.Clock warnings without breaking other console functionality
const originalWarn = console.warn
console.warn = (...args) => {
  const message = args[0]?.toString?.() || ''
  if (!message.includes('THREE.Clock')) {
    originalWarn(...args)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
  