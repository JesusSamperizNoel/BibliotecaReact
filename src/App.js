import './App.css';
import { useState } from 'react';
//components:
import IniciarSesion from './components/iniciarSesion';
import SesionIniciada from './components/sesionIniciada';

function App() {

  const [sesIni, setSesIni] = useState(false)

  if (sesIni) {
    return (
      <SesionIniciada />
    )
  } else {
    return(
      <IniciarSesion sesIni={sesIni} setSesIni={setSesIni} />
    )
  }
}

export default App
