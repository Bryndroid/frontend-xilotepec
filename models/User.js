import { cookieHandler } from "../helpers/getCookie.js";
export const UsuariosModel = {
    obtenerUsuarios: async () => {
        const token = cookieHandler.getCookie('jwt_token');
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch('http://localhost:8000/api/usuarios', { headers });
        const usuarios = await peticion.json();
        return peticion.ok ? usuarios : { status: false, message: usuarios.message || 'Error al obtener usuarios', data: usuarios };
    },
    crearUsuario: async (user) => {
        const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch('http://localhost:8000/api/usuarios', {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });
        const nuevoUsuario = await peticion.json();
        return peticion.ok ? nuevoUsuario : { status: false, message: nuevoUsuario.message || 'Error al crear usuario', data: nuevoUsuario };
    },
    modificarUsuario: async (user) => {
        const token = cookieHandler.getCookie('jwt_token');
        const idUser = user.id;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(`http://localhost:8000/api/usuarios/${idUser}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(user)
        });
        const nuevoUsuario = await peticion.json();
        return peticion.ok ? nuevoUsuario : { status: false, message: nuevoUsuario.message || 'Error al modificar usuario', data: nuevoUsuario };
    },
    eliminarUsuario: async (id) => {
        const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(`http://localhost:8000/api/usuarios/${id}`, {
            method: 'DELETE',
            headers
        });
        const resultado = await peticion.json();
        return peticion.ok ? resultado : { status: false, message: resultado.message || 'Error al eliminar usuario', data: resultado };
    },
    deslogearUsuario: async () => {
        const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const peticion = await fetch('http://localhost:8000/api/logout', {
            method: 'GET',
            headers
        });

        const resultado = await peticion.json();

        return peticion.ok
            ? resultado
            : {
                status: false,
                message: resultado.message || 'Error al deslogeo. Posible token inválido',
                data: resultado
            };
    }
};