import { cookieHandler } from "../helpers/getCookie.js";

export const MenuModel = {
    obtenerProductos: async () => {
        const peticion = await fetch('http://localhost:8000/api/productos');
        const productos = await peticion.json();
        return peticion.ok ? productos : { status: false, message: productos.message || 'Error al obtener productos', data: productos };
    },
    obtenerProductosActivos: async () => {
        const peticion = await fetch('http://localhost:8000/api/productos?is_active=1');
        const productos = await peticion.json();
        return peticion.ok ? productos : { status: false, message: productos.message || 'Error al obtener productos', data: productos };
    },
    crearProducto: async (producto)=>{
        const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch('http://localhost:8000/api/productos',{
            method: 'POST',
            headers,
            body: JSON.stringify(producto)
        });
        const estado = await peticion.json();
        return peticion.ok ? estado : { status: false, message: estado.message || 'Error al crear producto', data: estado };
    },
    modificarProducto: async (producto) => {
        const token = cookieHandler.getCookie('jwt_token');
        const idproducto = producto.id;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(`http://localhost:8000/api/productos/${idproducto}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(producto)
        });
        const respuesta = await peticion.json();
        return peticion.ok ? respuesta : { status: false, message: respuesta.message || 'Error al modificar producto', data: respuesta };
    },
    eliminarProducto: async (id) => {
        const token = cookieHandler.getCookie('jwt_token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(`http://localhost:8000/api/productos/${id}`, {
            method: 'DELETE',
            headers
        });
        const resultado = await peticion.json();
        return peticion.ok ? resultado : { status: false, message: resultado.message || 'Error al eliminar producto', data: resultado };
    }
};