//datos estaticos 
export const PromocionesModel ={
    obtenerPromocionesActivas: async () =>{
        /* return [
            {
                id:'1',
                nombre:'2x1 en Caramelo King',
                descripcion:'Promoción especial valida de lunes a miércoles',
                desde:'30/04/2026',
                hasta:'05/05/2026',
                estado:'Activa',
                img:'link de claudinary (despues veo eso)'
            },
            {
                id:'22',
                nombre:'Dia de las madres',
                descripcion:'Este dia de las madres',
                desde:'06/04/2026',
                hasta:'10/05/2026',
                estado:'Programada',
                img:'link de claudinary (despues veo eso)'
            }
        ] */
       const peticion = await fetch('http://localhost:8000/api/promociones/active');
       const promociones = await peticion.json();
       return promociones;
    },
    obtenerPromociones: async ()=>{
        const peticion = await fetch('http://localhost:8000/api/promociones');
        const promociones = peticion.json();
        return promociones;
    }
}
