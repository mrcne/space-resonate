import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'

import App from './App.tsx'
import {SeismicSettingsProvider} from "./context/seismicSettings.tsx";

import './index.css'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <SeismicSettingsProvider>
        <App />
      </SeismicSettingsProvider>
    </ChakraProvider>
  </StrictMode>,
)
