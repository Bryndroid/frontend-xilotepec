export const CategoriasModel ={
    obtenerCategorias: async ()=>{
        try{
            const peticion = await fetch('http://localhost:8000/api/categorias');
            const categorias = await peticion.json();
            return categorias;
        }catch(error){
            console.error(error);
            return null;
        }
    }
},