export const MenuModel = {
    obtenerProductos: async () => {
        try{
            const peticion = await fetch('http://localhost:8000/api/productos');
            const productos = await peticion.json();
            return productos;
        }catch(error){
            console.log(error);
            return null;
        }
       
    }
};