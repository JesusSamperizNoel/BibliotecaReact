//Things of react:
import { useState } from 'react'
import NewUSer from '../newUser'
import SesionIniciada from '../sesionIniciada'
//Styles:
import './index.css'

export default function IniciarSesion({sesIni, setSesIni}) {

    const URL = "http://localhost:3001"

    //variables de estado:
    const [userName, setUserName] = useState("")
    const [passValue, setPassValue] = useState("")
    const [showNewUser, setShowNewUser] = useState(false)
        
    function checkUser () {
        //Petitions:
        fetch(URL+"/usuarios?usuarioLector="+userName)
        .then(response => {
            if(response.ok){
                return response.json()
            } else{
                console.error(response.statusText)
            }
        })
        .then(user => {
            if(user[0] && user[0].password === passValue){//comprueba si existe el usuario y coincide su contraseña
                alert("Sesion Iniciada")
                setSesIni(true)
            } else {
                setSesIni(false)
            }
        })
        .catch(error=>console.error(error))
    }

    function closeSesion () {
        setSesIni(false)
        setUserName("")
        setPassValue("")
        document.getElementById("usuario").value = ""
        document.getElementById("password").value = ""
    }

    return(
        <>
            <div id='iniciarSesion'>
                <label htmlFor="input">Iniciar Sesion</label>
                <div id="input">
                    <label htmlFor="usuario">Usuario</label>
                    <input id="usuario" type="text" onChange={(e) => setUserName(e.target.value)} value={JSON.parse(localStorage.getItem("sesUser")).usuarioLector}></input>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={(e) => setPassValue(e.target.value)} value={JSON.parse(localStorage.getItem("sesUser")).password}/>
                    <button onClick={checkUser}>Iniciar Sesion</button>
                    <button onClick={()=>{setShowNewUser(!showNewUser)}}>Usuario Nuevo</button>
                    <button onClick={closeSesion}>Cerrar Sesion</button>
                </div>
            </div>
            {showNewUser && <NewUSer setUserName={setUserName} setPassValue={setPassValue}/>}
            {sesIni && <SesionIniciada userName={userName}/>}
        </>
    )
}