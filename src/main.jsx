import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx';
import { SupabaseProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupabaseProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SupabaseProvider>
  </StrictMode>,
)
