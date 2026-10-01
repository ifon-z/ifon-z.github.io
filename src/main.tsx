import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts, imported here rather than via a CSS @import so the
// stylesheet is never blocked on a third-party request. Latin subsets only:
// CJK is served from the system stack (PingFang SC / Noto Sans SC / YaHei),
// because a subsetted CJK webfont would outweigh the entire rest of the page.
import '@fontsource-variable/manrope/index.css'
import '@fontsource/playfair-display/latin-600-italic.css'

import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
