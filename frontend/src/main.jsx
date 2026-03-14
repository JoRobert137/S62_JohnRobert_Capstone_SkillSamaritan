import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              border: '1px solid rgba(148, 163, 184, 0.25)',
            },
            success: {
              iconTheme: {
                primary: '#22d3ee',
                secondary: '#082f49',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#450a0a',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
