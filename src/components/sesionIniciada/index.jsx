import { useEffect, useState } from "react"
//Styles:
import './index.css'

export default function SesionIniciada({userName}) {
    
    const URL = "http://localhost:3001"

//terminar el tipo de objeto de las variables de estado
    const [librosDis, setLibrosDis] = useState([])
    const [librosAdq, setLibrosAdq] = useState([])
    const [updLibro, setUpdLibro] = useState()

    function modData() {
        
    }

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
            console.log(librosResponse)
            setLibrosDis(librosResponse)
            console.log(librosDis)
        })
        .catch(error=>console.error(error))
    }

    function saveLibrosAdq() {
        //Saving id of sesion user from Local Storage:
        let idSesUser = JSON.parse(localStorage.getItem('sesUser')).id
        //Petition to Libros adquiridos to set librosAdq:
        fetch(URL+"/libros?id_prestamo="+idSesUser)
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

    function adqLibro(e) {
        const idLibro = e.target.parentElement.id
        console.log(idLibro)
        let idSesUser = JSON.parse(localStorage.getItem('sesUser')).id
        //Get libro
        fetch(URL+"/libros?id="+idLibro)
        .then(response => {
            if(response.ok){
                return response.json()
            } else{
                console.error(response.statusText)
            }
        })
        .then(libro => {
            libro.id_prestamo = JSON.parse(localStorage.getItem("sesUser")).id
            setUpdLibro(libro)
        })
        .catch(error=>console.error(error))
        //Set libro
        const libroWithoutId = {
            titulo: updLibro.titulo,
            autor: updLibro.autor,
            id_prestamo: idSesUser,
            fecha_devolucion: updLibro.fecha_devolucion
        }
        const options={
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(libroWithoutId)
        }
        fetch(URL+"/libros", options)
        .then(response=>{
            if(response.ok){
                return response.json()
            }else{
                console.error(response.statusText)
            }
        })
        .then(libro => {
            setLibrosAdq(librosAdq.push(libro))
            setLibrosDis(librosDis.pop(libro))
        })
        .catch(error=>console.error(error))
        //Delete libro
        fetch(URL+"/libros?id="+idLibro,{method:"DELETE"})
        .then(response => {
            if(response.ok){
            } else{
                console.error(response.statusText)
            }
        })
        .catch(error=>console.error(error))
    }

    function debLibro(e) {
        const idLibro = e.target.parentElement.id
        let idSesUser = JSON.parse(localStorage.getItem('sesUser')).id
        //Get libro
        fetch(URL+"/libros?id="+idLibro)
        .then(response => {
            if(response.ok){
                return response.json()
            } else{
                console.error(response.statusText)
            }
        })
        .then(libro => {
            libro.id_prestamo = 0
            setUpdLibro(libro)
        })
        .catch(error=>console.error(error))
        //Set libro
        const libroWithoutId = {
            titulo: updLibro.titulo,
            autor: updLibro.autor,
            id_prestamo: idSesUser,
            fecha_devolucion: updLibro.fecha_devolucion
        }
        const options={
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(libroWithoutId)
        }
        fetch(URL+"/libros", options)
        .then(response=>{
            if(response.ok){
                return response.json()
            }else{
                console.error(response.statusText)
            }
        })
        .then(libro => {
            setLibrosAdq(librosAdq.pop(libro))
            setLibrosDis(librosDis.push(libro))
        })
        .catch(error=>console.error(error))
        //Delete libro
        fetch(URL+"/libros?id="+idLibro,{method:"DELETE"})
        .then(response => {
            if(response.ok){
            } else{
                console.error(response.statusText)
            }
        })
        .catch(error=>console.error(error))
    }
    
    useEffect((saveLibrosDis),[librosDis])//descargamos los libros disponibles en la aplicacion
    useEffect((saveLibrosAdq),[librosAdq])//descargamos los libros adquiridos por el usuario en la aplicacion
            
    return(
        <>
            <div id="libreria">
                <h2>Bienvenido {userName}</h2>
                <button onClick={modData}>Modificar mi cuenta</button>
                <h4>Libreria</h4>
                <div id="disponibles">
                    <label htmlFor="librosDis">Libros disponibles:</label>
                    <ul id="librosDisponibles">
                        {   
                            librosDis.map((l, index) => {
                                return(
                                    <li key={index}>
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
                        librosAdq.map((l, index) => {
                            return(
                                <li key={index}>
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