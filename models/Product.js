export const MenuModel = {
    obtenerProductos: () => {
        return [
            {
                id: '1',
                nombre: 'Caramelo King',
                descripcion: 'Café helado con caramelo y crema batida.',
                categoria: 'Ice coffees',
                precio: 4.99,
                estado: 'Disponible',
                img: 'link de claudinary (despues veo eso)'
            },
            {
                id: '52',
                nombre: 'Expresso Doble',
                descripcion: 'Doble shot de espresso puro.',
                categoria: 'Calientes',
                precio: 2.50,
                estado: 'Disponible',
                img: 'link de claudinary (despues veo eso)'
            },
            {
                id: '43',
                nombre: 'Croissant Jamon',
                descripcion: 'Croissant relleno de jamón y queso.',
                categoria: 'Postres',
                precio: 3.00,
                estado: 'Agotado',
                img: 'link de claudinary (despues veo eso)'
            }
        ];
    }
};