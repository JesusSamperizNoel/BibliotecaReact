import { useState } from "react"
//Styles:
import './index.css'

export default function NewUSer(setUserName, setPassValue) {
    
    const URL = "http://localhost:3001"

    //inputs:
    const [nombreLector, setName] = useState("")
    const [apellidosLector, setLastName] = useState("")
    const [usuarioLector, setNewUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repetirPassword, setRepPassword] = useState("")
    const [id, setId] = useState("")
    
    function regUser() {
        //Saving id of sesion user from Local Storage:
        const sesUser = JSON.parse(localStorage.getItem('sesUser'))
        //check passwords:
        if(password !== repetirPassword){
            document.getElementById("repPassword").setCustomValidity("Las contraseñas no coinciden");
            document.getElementById("repPassword").reportValidity();
        }
        //Petition number of registed users to set new id:
        fetch(URL+"/usuarios")
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                console.error(response.statusText);
            }
        })
        .then(users => {
            users.forEach(user => {
                if (user.usuarioLector === sesUser[0].usuarioLector && user.password === sesUser[0].password) {
                    fetch(URL+"/usuarios/" + user.id, {
                        method: 'DELETE',
                    })
                }
            })
            setId(users.length+1) //set id of newUser value
        })

        //newUser:
        const newUser = {
            nombreLector,
            apellidosLector,
            usuarioLector,
            email,
            password,
            repetirPassword,
            id
        }

        //Petition to regist newUser
        const options={
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(newUser)
        }
        fetch(URL+"/usuarios", options)
        .then(response=>{
            if(response.ok){
                document.getElementById("usuario").value = newUser.usuarioLector
                document.getElementById("password").value = newUser.password
                document.getElementById("newUser").classList.toggle("oculto")
                //Set New User Name and Password:
                setUserName(usuarioLector)
                setPassValue(password)
                //Save sesion user in Local Storage:
                localStorage.removeItem('sesUser')
                localStorage.setItem('sesUser', JSON.stringify(newUser))
                alert("Su cuenta ha sido actualizada en la aplicacion, por favor inicie sesion")
            } else{
                console.error(response.statusText)
            }
        })
        .catch(error=>console.error(error))
    }

    return(
        <>
            <div id='newUser'>
                <label htmlFor="input">Nuevo Usuario</label>
                <div id="input">
                    <label htmlFor="nombre">Nombre Lector:</label>
                    <input id="nombre" type="text" onChange={(e) => {setName(e.target.value)}} required/>
                    <label htmlFor="apellidos">Apellidos Lector:</label>
                    <input id="apellidos" type="text" onChange={(e) => {setLastName(e.target.value)}} required/>
                    <label htmlFor="usuario">Usuario Lector:</label>
                    <input id="usuario" type="text" onChange={(e) => {setNewUserName(e.target.value)}} required/>
                    <label htmlFor="email">Email Lector:</label>
                    <input id="email" type="email" onChange={(e) => {setEmail(e.target.value)}}/>
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" type="password" onChange={(e) => {setPassword(e.target.value)}} required/>
                    <label htmlFor="repPassword">Repetir contraseña:</label>
                    <input id="repPassword" type="password" onChange={(e) => {setRepPassword(e.target.value)}} required/>
                    <button onClick={regUser}>Registrar datos</button>
                </div>
            </div>
        </>
    )
}