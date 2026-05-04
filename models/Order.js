export const PedidosModel = {
    obtenerPedidos: async () => {
        try{
            const peticion = await fetch('http://localhost:8000/api/ordenes');
            const orders = await peticion.json();
            return orders;
        }catch(error){
            console.log(error);
            return null;
        }
        
    }
};