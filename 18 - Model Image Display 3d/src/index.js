import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: '/images/5.jpg' },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: '/images/1.jpg' },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: '/images/2.jpg' },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: '/images/3.jpg' },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: '/images/4.jpg' },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: '/images/6.jpg' },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: '/images/7.jpg' },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: '/images/8.jpg' },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: '/images/9.jpg' }
]

createRoot(document.getElementById('root')).render(<App images={images} />)
