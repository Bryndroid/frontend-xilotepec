export const CategoriasModel ={
    obtenerCategorias: async ()=>{
        const peticion = await fetch('http://localhost:8000/api/categorias');
        const categorias = await peticion.json();
        return peticion.ok ? categorias : { status: false, message: categorias.message || 'Error al obtener categorías', data: categorias };
    }
}