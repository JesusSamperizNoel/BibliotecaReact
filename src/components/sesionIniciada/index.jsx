import { useEffect, useState } from "react"
//Styles:
import './index.css'
//Components:
import NewUSer from "../newUser"

export default function SesionIniciada({userName, setUserName, setPassValue}) {
    
    const URL = "http://localhost:3001"

    const sesUser = JSON.parse(localStorage.getItem('sesUser'))

    const [librosDis, setLibrosDis] = useState([])
    const [librosAdq, setLibrosAdq] = useState([])
    const [recargarLibros,setRecargarLibros]=useState(false)
    const [showNewUser, setShowNewUser] = useState(false)
    const [exp, setExp] = useState("")
    const [liDisExp , setLiDisExp] = useState([])

    function saveLibrosDis() {
        //Petition to Libros disponibles to set librosDis:
        fetch(URL+"/libros?id_prestamo=0")
        .then(response => {
            if(response.ok){
                return response.json()
            } else{
                console.error(response.statusText)
            }
        })
        .then(librosResponse => {
            setLibrosDis(librosResponse)
        })
        .catch(error=>console.error(error))
    }

    function saveLibrosAdq() {
        //Saving id of sesion user from Local Storage:
        const sesUser = JSON.parse(localStorage.getItem('sesUser'))
        //Petition to Libros adquiridos to set librosAdq:
        fetch(URL+"/libros?id_prestamo="+sesUser[0].id)
        .then(response => {
            if(response.ok){
                return response.json()
            } else{
                console.error(response.statusText)
            }
        })
        .then(librosResponse => {
            setLibrosAdq(librosResponse)
        })
        .catch(error=>console.error(error))
    }     

    async function adqLibro(e) {
        let idLibro = e.target.parentElement.id
        
        let libro = await fetch(URL+"/libros/"+idLibro).then((response)=>response.json())
        libro.id_prestamo = sesUser[0].id
        //PUT libro:
        const options={
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(libro)
        }
        await fetch(URL+"/libros/"+idLibro, options)
        .then(response=>{
            if(response.ok){
               setRecargarLibros(true)
            }else{
                console.error(response.statusText)
            }
        })
        .catch(error=>console.error(error))
    }

    async function debLibro(e) {
        let idLibro = e.target.parentElement.id

        let libro = await fetch(URL+"/libros/"+idLibro).then((response)=>response.json())
        libro.id_prestamo = 0
        //PUT libro:
        const options={
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(libro)
        }
        await fetch(URL+"/libros/"+idLibro, options)
        .then(response=>{
            if(response.ok){
            setRecargarLibros(true)
            }else{
                console.error(response.statusText)
            }
        })
        .catch(error=>console.error(error))
    }

    function filtrarLibros() {
        //Petition to Libros with a similar expression:
        fetch(URL+"/libros?titulo_like="+exp)
        .then(response => {
            if(response.ok){
                return response.json()
            } else{
                console.error(response.statusText)
            }
        })
        .then(librosResponse => {
            setLiDisExp(librosResponse)
        })
        .catch(error=>console.error(error))
    }

    useEffect(()=>{
        saveLibrosDis()
        saveLibrosAdq()
        setRecargarLibros(false);
    },[recargarLibros])//descargamos los libros adquiridos por el usuario en la aplicacion
            
    return(
        <>
            <div id="libreria">
                <h2>Bienvenido {sesUser[0].usuarioLector}</h2>
                <button onClick={()=>{setShowNewUser(!showNewUser)}}>Modificar mi cuenta</button>
                {showNewUser && <NewUSer setUserName={setUserName} setPassValue={setPassValue}/>}
                <h4>Libreria</h4>
                <div id="disponibles">
                    <label htmlFor="filter">Buscar libro:</label>
                    <input id="filter" type="text" onChange={(e) => setExp(e.target.value)}/>
                    <button onClick={filtrarLibros}>Buscar</button>
                    <ul id="librosFilter">
                        {   
                            liDisExp.map((l) => {
                                return(
                                    <li id={l.id} key={l.id}>
                                        {l.titulo}
                                        <button onClick={adqLibro}>Adquirir</button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <p></p>
                    <label htmlFor="librosDisponibles">Libros disponibles:</label>        
                    <ul id="librosDisponibles">
                        {   
                            librosDis.map((l) => {
                                return(
                                    <li id={l.id} key={l.id}>
                                        {l.titulo}
                                        <button onClick={adqLibro}>Adquirir</button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div id="adquiridos">
                    <label htmlFor="librosAdq">Libros adquiridos:</label>
                    <ul id="librosAdquiridos">
                    {   
                        librosAdq.map((l) => {
                            return(
                                <li id={l.id} key={l.id}>
                                    {l.titulo}
                                    <button onClick={debLibro}>Devolver</button>
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        </>
    )
}