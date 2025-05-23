import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

/*
Model JSX auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 model.glb --transform --simplify --resolution=2048
Author: Omar Faruq Tawsif (https://sketchfab.com/omarfaruqtawsif32)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
*/

function Root() {
  return (
    <>
      <App />
      <div style={{ position: 'absolute', pointerEvents: 'none', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <a style={{ position: 'absolute', top: 40, left: 40, fontSize: '18px', color: 'pink' }} href="#">
          scroll up/down ...
        </a>
      </div>{' '}
    </>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
