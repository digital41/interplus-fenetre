import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App.jsx'

// IMPORTANT: Remplacez cette clé par votre clé de site reCAPTCHA v3
// Obtenez votre clé sur : https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = '6Le7T2AsAAAAANMRJKV0xW7eshv7K7I-o03-EP9V'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      language="fr"
      scriptProps={{
        async: true,
        defer: true,
      }}
    >
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
)
