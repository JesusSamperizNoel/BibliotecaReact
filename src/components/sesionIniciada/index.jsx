import { useEffect, useState } from "react"
//Styles:
import './index.css'

export default function SesionIniciada({userName}) {
    
    const URL = "http://localhost:3001"

//terminar el tipo de objeto de las variables de estado
    const [librosDis, setLibrosDis] = useState([])
    const [librosAdq, setLibrosAdq] = useState([])
    const [recargarLibros,setRecargarLibros]=useState(false);

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
        const sesUser = JSON.parse(localStorage.getItem('sesUser'))
        let idLibro = e.target.parentElement.id
        
        let libro = await fetch(URL+"/libros/"+idLibro).then((response)=>response.json())


       
        libro.id_prestamo = sesUser[0].id
        console.log(libro);/* 
        setLibrosAdq(setLibrosAdq(librosAdq.push(libro)))
        setLibrosDis(setLibrosDis(librosDis.pop(libro))) */
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
               setRecargarLibros(true); 
            }else{
                console.error(response.statusText)
            }
        })
        .catch(error=>console.error(error))
    }

    function debLibro(e) {
/*  
        const idLibro = e.target.parentElement.id
        const sesUser = JSON.parse(localStorage.getItem('sesUser'))
        //Get libro
        fetch(URL+"/libros?id="+sesUser[0].id)
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
            id_prestamo: sesUser[0].id,
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
*/
    }


    useEffect(()=>{
        saveLibrosDis()
        saveLibrosAdq()
        setRecargarLibros(false);
    },[recargarLibros])//descargamos los libros adquiridos por el usuario en la aplicacion
            
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