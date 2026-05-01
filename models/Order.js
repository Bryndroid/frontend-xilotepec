export const PedidosModel = {
    obtenerPedidos: () => {
        return [
            {
                id: '1',
                cliente: 'Andrés Martínez',
                fecha: '23/04/2026',
                estado: 'Nuevo',
                instrucciones: 'link de claudinary (despues veo eso)',
                resumen: '2 x Americano, 1 x Sándwich',
                items: [
                    { nombre: 'Americano', descripcion: 'Café negro doble', cantidad: 2, precioUnitario: 2.50, img: 'link de claudinary (despues veo eso)' },
                    { nombre: 'Sándwich', descripcion: 'Jamón y queso', cantidad: 1, precioUnitario: 3.00, img: 'link de claudinary (despues veo eso)' }
                ]
            },
            {
                id: '25',
                cliente: 'María López',
                fecha: '24/04/2026',
                estado: 'En preparación',
                instrucciones: '',
                resumen: '1 x Caramelo King, 2 x Croissant',
                items: [
                    { nombre: 'Caramelo King', descripcion: 'Café helado con caramelo', cantidad: 1, precioUnitario: 4.99, img: 'link de claudinary (despues veo eso)' },
                    { nombre: 'Croissant Jamón', descripcion: 'Croissant relleno', cantidad: 2, precioUnitario: 3.00, img: 'link de claudinary (despues veo eso)' }
                ]
            },
        ];
    }
};