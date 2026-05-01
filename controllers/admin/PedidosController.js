import { PedidosModel } from '../../models/Order.js';
import { MainController } from './maincontroller.js';
const PedidosController = {
    datosPedidos: [],

    init: () => {
        PedidosController.datosPedidos = PedidosModel.obtenerPedidos();
        PedidosController.renderizarTabla();

        document.getElementById('input-search-pedidos')?.addEventListener('input', PedidosController.renderizarTabla);
        document.getElementById('filter-pedido-status')?.addEventListener('change', PedidosController.renderizarTabla);
    },

    renderizarTabla: () => {
        const tbody = document.getElementById('pedidos-table-body');
        if (!tbody) return;

        const busqueda = document.getElementById('input-search-pedidos').value.toLowerCase();
        const filtroEstado = document.getElementById('filter-pedido-status').value;

        const filtrados = PedidosController.datosPedidos.filter(p => {
            const coincideTexto = p.cliente.toLowerCase().includes(busqueda) || p.id.includes(busqueda);
            const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
            return coincideTexto && coincideEstado;
        });

        tbody.innerHTML = filtrados.map(p => {
            let colorBadge = 'bg-secondary';
            if (p.estado === 'Nuevo') colorBadge = 'bg-primary';
            else if (p.estado === 'En preparación') colorBadge = 'bg-warning text-dark';
            else if (p.estado === 'Listo') colorBadge = 'bg-info text-dark';
            else if (p.estado === 'Entregado') colorBadge = 'bg-success';

            return `
                <tr>
                    <td class="fw-bold p-3">${p.id}</td>
                    <td class="text-start fw-bold">${p.cliente}</td>
                    <td class="text-start text-muted" style="max-width: 200px;">${p.resumen}</td>
                    <td>${p.fecha}</td>
                    <td><span class="badge ${colorBadge} rounded-pill px-3 py-2">${p.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-dark me-1" onclick="PedidosController.verDetalles('${p.id}')" title="Ver detalles">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="PedidosController.imprimirPedido()" title="Imprimir">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    verDetalles: (id) => {
        const p = PedidosController.datosPedidos.find(x => x.id === id);
        if (!p) return;

        document.getElementById('modal_ped_id').value = p.id;
        document.getElementById('modal_ped_id_display').value = p.id;
        document.getElementById('modal_ped_cliente').value = p.cliente;
        document.getElementById('modal_ped_fecha').value = p.fecha;
        document.getElementById('modal_ped_instrucciones').value = p.instrucciones;

        // estado en radio buttons
        const radioMap = {
            'Nuevo': 'ped_estado_nuevo',
            'En preparación': 'ped_estado_prep',
            'Listo': 'ped_estado_listo',
            'Entregado': 'ped_estado_entregado'
        };
        const radioId = radioMap[p.estado];
        if (radioId) document.getElementById(radioId).checked = true;

        // renderizar items
        const IVA = 0.13;
        const subtotal = p.items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
        const total = subtotal + (subtotal * IVA);

        document.getElementById('modal_ped_subtotal').value = '$' + subtotal.toFixed(2);
        document.getElementById('modal_ped_total').value = '$' + total.toFixed(2);

        document.getElementById('modal_ped_items').innerHTML = p.items.map(item => `
            <div class="bg-white p-3 rounded-3 border d-flex align-items-center gap-3">
                <img src="${item.img}" class="rounded border" style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                    <p class="fw-bold small mb-0">${item.nombre}</p>
                    <p class="text-muted small mb-1">${item.descripcion}</p>
                    <p class="small mb-0">Cantidad: <b>${item.cantidad}</b> &nbsp;|&nbsp; Precio: <b>$${item.precioUnitario.toFixed(2)}</b> &nbsp;|&nbsp; Subtotal: <b>$${(item.cantidad * item.precioUnitario).toFixed(2)}</b></p>
                </div>
            </div>
        `).join('');

        new bootstrap.Modal(document.getElementById('modalPedido')).show();
    },

    imprimirPedido: () => {
        window.print();
    },

    mostrarAlerta: (mensaje, tipo) => {
        const contenedor = document.getElementById('alert-container');
        contenedor.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                <i class="fa-solid ${tipo === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => { contenedor.innerHTML = ''; }, 4000);
    }
};

window.PedidosController = PedidosController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();
    PedidosController.init();
});