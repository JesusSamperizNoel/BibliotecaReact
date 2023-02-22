import { useEffect, useState } from "react"
//Styles:
import './index.css'

export default function SesionIniciada({userName}) {
    
    const URL = "http://localhost:3001"

    const [librosDis, setLibrosDis] = useState([])
    const [librosAdq, setLibrosAdq] = useState([])
//terminar de ajustar el libro a actualizar!!!
    const [updLibro, setUpdLibro] = useState("")

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
        let idSesUSer = JSON.parse(localStorage.getItem('sesUser'))
        //Petition to Libros adquiridos to set librosAdq:
        fetch(URL+"/libros?id_prestamo="+idSesUSer)
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
        const idLibro = e.target.id
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
            setUpdLibro(libro)
        })
        .catch(error=>console.error(error))
        
    }

    function debLibro(e) {
        //falta desarrollar
    }
    
    useEffect((saveLibrosDis),[librosDis])//descargamos los libros disponibles en la aplicacion
    useEffect((saveLibrosAdq),[librosAdq])//descargamos los libros adquiridos por el usuario en la aplicacion
            
    return(
        <>
            <div id="libreria">
                <h2>Bienvenido {userName}</h2>
             
                <h4>Libreria</h4>
                <div id="disponibles">
                    <label htmlFor="librosDis">Libros disponibles:</label>
                    <ul id="librosDis">
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
                    <ul id="librosAdq">
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