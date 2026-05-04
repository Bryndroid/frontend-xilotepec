import { PromocionesModel } from '../../models/Promocion.js';
import { MainController } from './maincontroller.js';

const PromocionesController = {
    datosPromos: [],
    init:async ()=>{
        //le pide los datos al modelo
        PromocionesController.datosPromos = await PromocionesModel.obtenerPromociones();
        console.log(PromocionesController.datosPromos);
        //para renderizar la tabla
        PromocionesController.renderizarTabla();
        document.getElementById('input-search-promos')?.addEventListener('input', PromocionesController.renderizarTabla);
        document.getElementById('filter-promo-status')?.addEventListener('input', PromocionesController.renderizarTabla);

        //modal agregar uno
        document.getElementById('btn-nueva-promo')?.addEventListener('click', PromocionesController.prepararCrear);
        //subir la imagen
        document.getElementById('btn-upload-img')?.addEventListener('click', ()=>{
            document.getElementById('input_promo_file').click();
        });
    } ,

    renderizarTabla: () => {
        const tbody = document.getElementById('promos-table-body');
        if (!tbody) return;

        const busqueda = document.getElementById('input-search-promos').value.toLowerCase();
        const filtroEstado = document.getElementById('filter-promo-status').value;

        const filtradas = PromocionesController.datosPromos.filter(p => {
            const coincideTexto = p.name.toLowerCase().includes(busqueda) || p.id.includes(busqueda);
            const coincideEstado = filtroEstado === 'Todas' || p.is_active === filtroEstado;
            return coincideTexto && coincideEstado;
        });

        tbody.innerHTML = filtradas.map(p => {
            let colorBadge = p.is_active ? 'bg-success' : 'bg-secondary';

            return `
                <tr>
                    <td class="fw-bold p-3">${p.id}</td>
                    <td><img src="${p.image_url}" class="rounded border" style="width: 60px; height: 45px; object-fit: cover;"></td>
                    <td class="fw-bold text-start">${p.name}</td>
                    <td class="text-start text-muted" style="max-width: 200px;">${p.type}</td>
                    <td><small>Del <b>${p.start_date}</b><br>Al <b>${p.end_date}</b></small></td>
                    <td><span class="badge ${colorBadge} rounded-pill px-3 py-2">${p.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-dark me-1" onclick="PromocionesController.editar('${p.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="PromocionesController.mostrarAlerta('Promoción eliminada', 'danger')" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // modal cuando se va crear una nueva
    prepararCrear: () => {
        document.getElementById('form-gestion-promo').reset();
        document.getElementById('modal_promo_id').value = '';
        document.getElementById('modal_promo_img').src = '#';//aca tendria que ir la onda de claudinary (despues lo hago)
        
        new bootstrap.Modal(document.getElementById('modalPromocion')).show();
    },

    // se llena modal con los datos de la promoción seleccionada
    editar: (id) => {
        const p = PromocionesController.datosPromos.find(x => x.id === id);
        if (!p) return;

        document.getElementById('modal_promo_id').value = p.id;
        document.getElementById('modal_promo_nombre').value = p.name;
        document.getElementById('modal_promo_desc').value = p.type;
        document.getElementById('modal_promo_desde').value = p.start_date;
        document.getElementById('modal_promo_hasta').value = p.end_date;
        document.getElementById('modal_promo_img').src = p.image_url;

        // el estado 
        if(p.estado === 'Activa') document.getElementById('estado_activa').checked = true;
        else if(p.estado === 'Programada') document.getElementById('estado_prog').checked = true;
        else document.getElementById('estado_inact').checked = true;

        new bootstrap.Modal(document.getElementById('modalPromocion')).show();
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

        setTimeout(() => {
            contenedor.innerHTML = '';
        }, 4000);
    }
};
window.PromocionesController = PromocionesController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();        
    PromocionesController.init(); 
});