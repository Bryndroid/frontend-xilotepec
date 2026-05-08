
import { cookieHandler } from "../helpers/getCookie.js";

export const PromocionesModel ={
    obtenerPromocionesActivas: async () =>{
       const peticion = await fetch('http://localhost:8000/api/promociones-active');
       const promociones = await peticion.json();
       return peticion.ok ? promociones : { status: false, message: promociones.message || 'Error al obtener promociones activas', data: promociones };
    },
    obtenerPromociones: async ()=>{
        const peticion = await fetch('http://localhost:8000/api/promociones');
        const promociones = await peticion.json();
        return peticion.ok ? promociones : { status: false, message: promociones.message || 'Error al obtener promociones', data: promociones };
    },
    crearPromociones: async (promocion)=>{
        const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch('http://localhost:8000/api/promociones',{
            method: 'POST',
            headers,
            body: JSON.stringify(promocion)
        });
        const estado = await peticion.json();
        return peticion.ok ? estado : { status: false, message: estado.message || 'Error al crear promoción', data: estado };
    },
    modificarPromocion: async (promocion) => {
        const token = cookieHandler.getCookie('jwt_token');
        const idPromocion = promocion.id;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(`http://localhost:8000/api/promociones/${idPromocion}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(promocion)
        });
        const respuesta = await peticion.json();
        return peticion.ok ? respuesta : { status: false, message: respuesta.message || 'Error al modificar promoción', data: respuesta };
    },
    eliminarPromocion: async (id) => {
        const token = cookieHandler.getCookie('jwt_token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(`http://localhost:8000/api/promociones/${id}`, {
            method: 'DELETE',
            headers
        });
        const resultado = await peticion.json();
        return peticion.ok ? resultado : { status: false, message: resultado.message || 'Error al eliminar promoción', data: resultado };
    }
}
