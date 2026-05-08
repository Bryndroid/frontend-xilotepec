import { cookieHandler } from "../helpers/getCookie.js";

export const PedidosModel = {
    obtenerPedidos: async (limit = '') => {
        const URl = isNaN(limit)
            ? 'http://localhost:8000/api/ordenes'
            : `http://localhost:8000/api/ordenes?limit=${limit}`;
        const token = cookieHandler.getCookie('jwt_token');
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const peticion = await fetch(URl, { headers });
        const orders = await peticion.json();
        return peticion.ok ? orders : { status: false, message: orders.message || 'Error al obtener pedidos', data: orders };
    }
};