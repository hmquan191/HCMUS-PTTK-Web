import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <CssBaseline/>
      <AuthProvider>
        <App />
      </AuthProvider>  
    </CssVarsProvider>
  // </React.StrictMode>
)
