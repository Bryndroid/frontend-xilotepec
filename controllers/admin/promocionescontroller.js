import { MenuModel } from '../../models/Product.js';
import { PromocionesModel } from '../../models/Promocion.js';
import { MainController } from './maincontroller.js';

const PromocionesController = {
    datosPromos: [],
    productos: [],
    productosListados: [], 

    init: async () => {
        PromocionesController.productosListados = [];
        try{
            await PromocionesController.cargarDatos();
        
            document.getElementById('input-search-promos')?.addEventListener('input', PromocionesController.renderizarTabla);
            document.getElementById('filter-promo-status')?.addEventListener('input', PromocionesController.renderizarTabla);
            document.getElementById('btn-nueva-promo')?.addEventListener('click', PromocionesController.prepararCrear);
            
            document.getElementById('btn-upload-img')?.addEventListener('click', () => {
                document.getElementById('input_promo_file').click();
            });

            // Solución al Select: Escuchamos el clic directo en las opciones
            document.querySelector('#select-promo-product')?.addEventListener('click', (e) => {
                if (e.target.tagName === 'OPTION') {
                    const producto = PromocionesController.productos.find(p => p.id == e.target.value);
                    if (producto) {
                        PromocionesController.listarProducto(producto);
                    }

                    // Forzamos visualmente que el select mantenga sombreados los que están en la lista (evita que el click normal borre el resto visualmente)
                    Array.from(e.currentTarget.options).forEach(opt => {
                        opt.selected = PromocionesController.productosListados.some(p => p.id == opt.value);
                    });
                }
            });

            document.getElementById('form-gestion-promo')?.addEventListener('submit', PromocionesController.guardarPromocion);
        }catch(error){
            PromocionesController.mostrarAlerta('Hubo un error inesperado con la respuesta del servidor', 'danger', false);
            document.querySelector('#table-head-status').innerHTML = ``
            console.error(error);
        }
    },
    cargarDatos: async ()=>{
        const promosResp = await PromocionesModel.obtenerPromociones();
        if (promosResp.status === false) {
            return PromocionesController.mostrarModalError( 'Error al cargar promociones');
        }

        const productosResp = await MenuModel.obtenerProductos();
        if (productosResp.status === false) {
            return PromocionesController.mostrarModalError( 'Error al cargar productos');
        }

        PromocionesController.datosPromos = promosResp.data ?? promosResp;
        PromocionesController.productos = productosResp.data ?? productosResp;
        PromocionesController.renderizarTabla();
    },
    renderizarTabla: () => {
        const tbody = document.getElementById('promos-table-body');
        if (!tbody) return;

        const busqueda = document.getElementById('input-search-promos').value.toLowerCase();
        const filtroEstado = document.getElementById('filter-promo-status').value;
        
        const filtradas = PromocionesController.datosPromos.filter(p => {
            const coincideTexto = p.name.toLowerCase().includes(busqueda) || p.id.toString().includes(busqueda);
            const estado = p.is_active ? 'activas' : 'inactivas';
            const coincideEstado = filtroEstado === 'Todas' || estado === filtroEstado;
            return coincideTexto && coincideEstado; 
        });
        
        tbody.innerHTML = filtradas.map(p => {
            let colorBadge = p.is_active ? 'bg-success' : 'bg-secondary';

            return `
                <tr>
                    <td class="fw-bold p-3">${p.id}</td>
                    <td><img src="${p.image_url}" class="rounded border" style="width: 60px; height: 45px; object-fit: cover;"></td>
                    <td class="fw-bold text-start">${p.name}</td>
                    <td class="text-start text-muted" style="max-width: 200px;">${p.description}</td>
                    <td><small>Del <b>${(new Date(p.start_date)).toLocaleString('es-SV', { dateStyle: 'full', timeStyle: 'short' })}</b><br>Al <b>${(new Date(p.end_date)).toLocaleString('es-SV', { dateStyle: 'full', timeStyle: 'short' })}</b></small></td>
                    <td><span class="badge ${colorBadge} rounded-pill px-3 py-2">${p.is_active ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-dark me-1" onclick="PromocionesController.editar('${p.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="PromocionesController.eliminarPromo('${p.id}')" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    cargarOpcionesSelect: () => {
        const select = document.querySelector('#select-promo-product');
        select.innerHTML = PromocionesController.productos.map(t => 
            `<option value="${t.id}">${t.name} - $${t.price}</option>`
        ).join('');
    },

    listarProducto: (producto) => {
        // Tu lógica original restaurada y optimizada
        const index = PromocionesController.productosListados.findIndex(x => x.id == producto.id);
        
        if (index === -1) {
            // Si no está, lo agregamos
            PromocionesController.productosListados.push(producto);
        } else {
            // Si ya está, lo quitamos
            PromocionesController.productosListados.splice(index, 1);
        }

        // Renderizamos la lista <ul>
        let productosHTML = '';
        PromocionesController.productosListados.forEach((p) => {
            productosHTML += `<li>${p.name}</li>`;
        });
        document.querySelector('#product-selected-list ul').innerHTML = productosHTML;
    },

    prepararCrear: () => {
        document.getElementById('form-gestion-promo').reset();
        document.getElementById('modal_promo_id').value = '';
        document.getElementById('modal_promo_img').src = '#'; 
        
        PromocionesController.cargarOpcionesSelect();
        
        // Limpiamos los productos para una nueva promoción
        PromocionesController.productosListados = [];
        document.querySelector('#product-selected-list ul').innerHTML = '';

        new bootstrap.Modal(document.getElementById('modalPromocion')).show();
    },

    editar: (id) => {
        const p = PromocionesController.datosPromos.find(x => x.id == id);
        if (!p) return;
        
        document.getElementById('modal_promo_id').value = p.id;
        document.getElementById('modal_promo_nombre').value = p.name;
        document.getElementById('modal_promo_desc').value = p.description;
        document.getElementById('modal_promo_desde').value = p.start_date.slice(0, 16);
        document.getElementById('modal_promo_hasta').value = p.end_date.slice(0, 16);
        document.getElementById('modal_promo_img').src = p.image_url;
        document.getElementById('select-promo-type').value = p.type;
        document.getElementById('input-valor-promo').value = p.value;
        document.getElementById('estado_activa').checked = p.is_active;
        document.getElementById('estado_inact').checked = !p.is_active;

        PromocionesController.cargarOpcionesSelect();

        // 1. Cargamos los productos que ya existen en la promoción
        PromocionesController.productosListados = [...p.products];
        
        // 2. Renderizamos la lista <ul>
        let productosHTML = '';
        PromocionesController.productosListados.forEach((prod) => {
            productosHTML += `<li>${prod.name}</li>`;
        });
        document.querySelector('#product-selected-list ul').innerHTML = productosHTML;

        // 3. Dejamos marcados visualmente en el <select> los que ya vienen
        const select = document.querySelector('#select-promo-product');
        Array.from(select.options).forEach(opt => {
            opt.selected = PromocionesController.productosListados.some(prod => prod.id == opt.value);
        });

        new bootstrap.Modal(document.getElementById('modalPromocion')).show();
    },

    guardarPromocion: async (e) => {
        e.preventDefault();
        const actualHTMLModal = document.querySelector('.modal-footer').innerHTML;
        const cargandoHTMLModal = `<div class="spinner-border text-success m-4" role="status">
                <span class="visually-hidden">Loading...</span>
        </div>`;
        const promocion = {
            id: document.getElementById('modal_promo_id').value || null,
            name: document.getElementById('modal_promo_nombre').value,
            description: document.getElementById('modal_promo_desc').value,
            start_date: document.getElementById('modal_promo_desde').value,
            end_date: document.getElementById('modal_promo_hasta').value,
            type: document.getElementById('select-promo-type').value,
            value: document.getElementById('input-valor-promo').value,
            is_active: document.getElementById('estado_activa').checked,
            image_url: document.getElementById('modal_promo_img').src,
            products: [...PromocionesController.productosListados]
        };
        document.querySelector('.modal-footer').innerHTML = cargandoHTMLModal;
        try {
            if (PromocionesController.datosPromos.find(x => x.id == promocion.id)) {
                await PromocionesController.modificarPromocion(promocion);
            } else {
                await PromocionesController.crearNuevaPromocion(promocion);
            }
            await PromocionesController.cargarDatos();
        } catch (error) {
            PromocionesController.mostrarModalError(error.message || 'Error al guardar promoción');
        } finally {
            document.querySelector('.modal-footer').innerHTML = actualHTMLModal;
        }
    },

    mostrarAlerta: (mensaje, tipo) => {
        const contenedor = document.getElementById('alert-container');
        contenedor.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
                <i class="fa-solid ${tipo === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => contenedor.innerHTML = '', 4000);
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
    },

    modificarPromocion: async (promocion) => {
        if (!promocion.id) {
            PromocionesController.mostrarModalError('Id de promoción inválido');
            return false;
        }
        const resultado = await PromocionesModel.modificarPromocion(promocion);
        if (resultado.status === false) {
            PromocionesController.mostrarModalError(resultado.message || 'Error al modificar promoción');
            return false;
        }
        bootstrap.Modal.getInstance(document.getElementById('modalPromocion')).hide();
        PromocionesController.mostrarAlerta('Promoción guardada con éxito.', 'success');
        return true;
    },

    crearNuevaPromocion: async (promocion) => {
        if (!promocion.name || !promocion.type) {
            PromocionesController.mostrarModalError('Nombre y tipo de promoción son obligatorios');
            return false;
        }
        const resultado = await PromocionesModel.crearPromociones(promocion);
        if (resultado.status === false) {
            PromocionesController.mostrarModalError(resultado.message || 'Error al crear promoción');
            return false;
        }
        bootstrap.Modal.getInstance(document.getElementById('modalPromocion')).hide();
        PromocionesController.mostrarAlerta('Promoción creada con éxito.', 'success');
        return true;
    },
    eliminarPromo: async (id) =>{
        if (!confirm(`¿Está seguro de que desea eliminar esta promocion? Id: ${id}`)) {
            return;
        }
        try {
            const resultado = await PromocionesModel.eliminarPromocion(id);
            if (resultado.status === false) {
                PromocionesController.mostrarModalError(resultado.message || 'Error al eliminar promoción');
                return;
            }
            PromocionesController.mostrarAlerta('Promocion eliminada con éxito.', 'success');
            PromocionesController.cargarDatos();
        } catch (error) {
            PromocionesController.mostrarModalError(error.message || 'Error al eliminar promoción');
        }
    }
};

window.PromocionesController = PromocionesController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();        
    PromocionesController.init(); 
});