import { PedidosModel } from '../../models/Order.js';
import { MainController } from './maincontroller.js';
const PedidosController = {
    datosPedidos: [],

    init: async () => {
        try {
            const pedidosResp = await PedidosModel.obtenerPedidos();
            if (pedidosResp.status === false) {
                return PedidosController.mostrarModalError(pedidosResp.message || 'Error al cargar pedidos');
            }
            PedidosController.datosPedidos = pedidosResp;
            PedidosController.renderizarTabla();
            document.getElementById('input-search-pedidos')?.addEventListener('input', PedidosController.renderizarTabla);
            document.getElementById('filter-pedido-status')?.addEventListener('change', PedidosController.renderizarTabla);
        } catch (error) {
            PedidosController.mostrarAlerta('Hubo un error inesperado con la respuesta del servidor', 'danger', false);
            document.querySelector('#table-head-status').innerHTML = ``
            console.error(error);
        }
    },

    renderizarTabla: () => {
        const tbody = document.getElementById('pedidos-table-body');
        if (!tbody) return;

        const busqueda = document.getElementById('input-search-pedidos').value.toLowerCase();
        const filtroEstado = document.getElementById('filter-pedido-status').value;
        //TODO: Validar el filtro de busqueda
        const filtrados = PedidosController.datosPedidos.data.filter(p => {
            const coincideTexto = p.user.name.toLowerCase().includes(busqueda) || p.id.toString().includes(busqueda);
            const coincideEstado = filtroEstado === 'Todos' || p.status.toLowerCase() === filtroEstado;
            return coincideTexto && coincideEstado;
        });
        
        
        tbody.innerHTML = filtrados.map(p => {
            let colorBadge = 'bg-secondary';
            if (p.status.toLowerCase() == 'pendiente') colorBadge = 'bg-info text-dark';
            else if (p.status.toLowerCase() == 'completada') colorBadge = 'bg-success ';

            const fecha = new Date(p.date);
            const formateada = fecha.toLocaleString('es-SV', {
                dateStyle: 'full',
                timeStyle: 'short'
            });

            let products = '';
            p.details.forEach(t=>{
                products = `<li>${t.product_name}</li>` + products;
            })
            return `
                <tr>
                    <td class="fw-bold p-3">${p.id}</td>
                    <td class="text-start fw-bold">${p.user.name}</td>
                    <td class="text-start text-muted" style="max-width: 200px;">
                        <ul>
                            ${products}
                        </ul>
                    </td>
                    <td>${formateada}</td>
                    <td><span class="badge ${colorBadge} rounded-pill px-3 py-2">${p.status}</span></td>
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
        const p = PedidosController.datosPedidos.data.find(x => x.id == id);
        if (!p) return;

        document.getElementById('modal_ped_id').value = p.id;
        document.getElementById('modal_ped_id_display').value = p.id;
        document.getElementById('modal_ped_cliente').value = p.user.name;
        const fecha = new Date(p.date);
        const formateada = fecha.toLocaleString('es-SV', {
            dateStyle: 'full',
            timeStyle: 'short'
        });

        document.getElementById('modal_ped_fecha').value = formateada;

        // estado en radio buttons
        const radioMap = {
            'Nuevo': 'ped_estado_nuevo',
            'pendiente': 'ped_estado_prep',
            'completado': 'ped_estado_listo',
            'Entregado': 'ped_estado_entregado'
        };
        const radioId = radioMap[p.status];
        if (radioId) document.getElementById(radioId).checked = true;

        //ESTO NO IMPORTA, CREO JAJAJA
        const IVA = 0.13;
        const subtotal = parseFloat(p.total);
        const total = subtotal + (subtotal * IVA);

        document.getElementById('modal_ped_subtotal').value = '$' + parseFloat(subtotal).toFixed(2);
        document.getElementById('modal_ped_total').value = '$' + total.toFixed(2);

        document.getElementById('modal_ped_items').innerHTML = p.details.map(item => `
            <div class="bg-white p-3 rounded-3 border d-flex align-items-center gap-3">
                <img src="${item.product.url_image}" class="rounded border" style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                    <p class="fw-bold small mb-0">${item.product_name}</p>
                    <p class="small mb-0">Cantidad: <b>${item.quantity}</b> &nbsp;|&nbsp; Precio: <b>$${parseInt(item.unit_price).toFixed(2)}</b> &nbsp;|&nbsp; Subtotal: <b>$${item.subtotal}</b></p>
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
    },
    mostrarModalError: (mensaje) => {
        let modal = document.getElementById('errorModal');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', `
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-danger">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="errorModalLabel">Error</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
            `);
            modal = document.getElementById('errorModal');
        }
        modal.querySelector('.modal-body').textContent = mensaje;
        new bootstrap.Modal(modal).show();
    }
};

window.PedidosController = PedidosController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();
    PedidosController.init();
});