import { CategoriasModel } from '../../models/Categories.js';
import { MenuModel } from '../../models/Product.js';
import { MainController } from './maincontroller.js';
const MenuController = {
    productos: [],
    categorias: [],
    init: async () => {
        try{
            await MenuController.cargarDatos();
            document.getElementById('input-search-menu')?.addEventListener('input', MenuController.render);
            document.getElementById('filter-category')?.addEventListener('change', MenuController.render);
            document.getElementById('btn-nuevo-producto')?.addEventListener('click', MenuController.abrirNuevo);
            document.getElementById('btn-upload-prod')?.addEventListener('click', () => {
                document.getElementById('input_prod_file').click();
            });
            document.getElementById('input_prod_file')?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        document.getElementById('modal_prod_img').src = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
            document.getElementById('form-producto').addEventListener('submit', MenuController.guardarProducto);
        }catch(error){
            MenuController.mostrarAlerta('Hubo un error inesperado con la respuesta del servidor', 'danger', false);
            document.querySelector('#table-head-status').innerHTML = ``
            console.error(error);
        }
        
    },

    render: (productos) => {
        const query = document.getElementById('input-search-menu').value.toLowerCase();
        const cat = document.getElementById('filter-category').value;
        const tbody = document.getElementById('menu-table-body');

        const filtrados = MenuController.productos.filter(p => {
            const coincide = p.name.toLowerCase().includes(query) || p.id.toString().includes(query);
            const coincideCat = cat === 'todas' || p.category.id == cat;

            return coincide && coincideCat;
        });
        //TODO: Agregar el sistema CRUD con las funciones puestas ahi
        tbody.innerHTML = filtrados.map(p => `
            <tr>
                <td class="fw-bold p-3">${p.id}</td>
                <td><img src="${p.url_image}" class="rounded border" style="width: 60px; height: 45px; object-fit: cover;"></td>
                <td class="text-start fw-bold">${p.name}</td>
                <td><span class="badge bg-light text-dark border">${p.category.name}</span></td>
                <td class="fw-bold text-success">$${parseInt(p.price).toFixed(2)}</td>
                <td><span class="badge ${p.is_active ? 'bg-success' : 'bg-danger'} rounded-pill px-3 py-2">${p.is_active ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-dark me-1" onclick="MenuController.abrirEditar('${p.id}')" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="MenuController.eliminarProducto('${p.id}')" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    },
    cargarDatos: async () => {
        const productosResp = await MenuModel.obtenerProductos();
        if (productosResp.status === false) {
            throw new Error('Error al cargar productos');
        }

        const categoriasResp = await CategoriasModel.obtenerCategorias();
        if (categoriasResp.status === false) {
            throw new Error('Error al cargar categorias');
        }

        MenuController.productos = productosResp.data ?? productosResp;
        MenuController.categorias = categoriasResp.data ?? categoriasResp;

        let categoriasHTML = `<option value='todas' selected>Todas</option>`;
        MenuController.categorias.forEach(t => {
            categoriasHTML += `<option value="${t.id}">${t.name}</option>`;
        });
        document.getElementById('filter-category').innerHTML = categoriasHTML;
        MenuController.render(MenuController.productos);
    },
    abrirEditar: (id) => {
        const p = MenuController.productos.find(x => x.id == id);
        if (!p) return;
        MenuController.cargarOpcionesSelect();
        document.getElementById('modal_prod_id').value = p.id;
        document.getElementById('modal_prod_nombre').value = p.name;
        document.getElementById('modal_prod_desc').value = p.description ?? '';
        document.getElementById('select-categoria-product').value = p.category.id;
        document.getElementById('modal_prod_precio').value = p.price;
        document.getElementById('modal_prod_img').src = p.img;
        document.getElementById('modal_prod_cantidad').value = p.max_quantity;
        
        //para los botones de estado
        if (p.is_active) document.getElementById('prod_estado_disponible').checked = true;
        else document.getElementById('prod_estado_agotado').checked = true;

        new bootstrap.Modal(document.getElementById('modalProducto')).show();
    },
    cargarOpcionesSelect: () => {
        const select = document.querySelector('#select-categoria-product');
        select.innerHTML = MenuController.categorias.map(t => 
            `<option value="${t.id}">${t.name}</option>`
        ).join('');
    },
    abrirNuevo: () => {
        document.getElementById('form-producto').reset();
        document.getElementById('modal_prod_img').src = '#';
        MenuController.cargarOpcionesSelect();
        new bootstrap.Modal(document.getElementById('modalProducto')).show();
    },
    guardarProducto: async (e)=>{
        e.preventDefault();
        const actualHTMLModal = document.querySelector('.modal-footer').innerHTML;
        const cargandoHTMLModal = `<div class="spinner-border text-success m-4" role="status">
                <span class="visually-hidden">Loading...</span>
        </div>`;
        const producto = {
            id: document.getElementById('modal_prod_id').value,
            name: document.getElementById('modal_prod_nombre').value,
            description: document.getElementById('modal_prod_desc').value,
            category_id: document.getElementById('select-categoria-product').value,
            price: document.getElementById('modal_prod_precio').value,
            max_quantity: document.getElementById('modal_prod_cantidad').value,
            is_active: document.getElementById('prod_estado_disponible').checked,
            url_image: document.getElementById('modal_prod_img').src
        };
        document.querySelector('.modal-footer').innerHTML = cargandoHTMLModal;
        try {
            if (MenuController.productos.find(x => x.id == producto.id)) {
                await MenuController.modificarProducto(producto);
            } else {
                await MenuController.crearNuevoProducto(producto);
            }
            await MenuController.cargarDatos();
        } catch (error) {
            MenuController.mostrarModalError(error.message || 'Error al guardar producto');
        } finally {
            document.querySelector('.modal-footer').innerHTML = actualHTMLModal;
        }
    },
    mostrarAlerta: (msj, tipo) => {
        const container = document.getElementById('alert-container');
        container.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                <i class="fa-solid ${tipo === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2"></i>
                ${msj}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
        setTimeout(() => container.innerHTML = '', 4000);
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
    modificarProducto: async (producto) => {
        if (!producto.id) {
            MenuController.mostrarModalError('Id de producto inválido');
            return false;
        }
        const resultado = await MenuModel.modificarProducto(producto);
        if (resultado.status === false) {
            MenuController.mostrarModalError(resultado.message || 'Error al modificar producto');
            return false;
        }
        bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
        MenuController.mostrarAlerta('Producto guardado con éxito.', 'success');
        return true;
    },
    crearNuevoProducto: async (producto) => {
        if (!producto.name || !producto.price) {
            MenuController.mostrarModalError('Nombre y precio son obligatorios');
            return false;
        }
        const resultado = await MenuModel.crearProducto(producto);
        if (resultado.status === false) {
            MenuController.mostrarModalError(resultado.message || 'Error al crear producto');
            return false;
        }
        bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
        MenuController.mostrarAlerta('Producto creado con éxito.', 'success');
        return true;
    },
    eliminarProducto: async (id) =>{
        if (!confirm(`¿Está seguro de que desea eliminar esta producto? Id: ${id}`)) {
            return;
        }
        try {
            const resultado = await MenuModel.eliminarProducto(id);
            if (resultado.status === false) {
                MenuController.mostrarModalError(resultado.message || 'Error al eliminar producto');
                return;
            }
            MenuController.mostrarAlerta('Producto eliminado con éxito.', 'success');
            MenuController.cargarDatos();
        } catch (error) {
            MenuController.mostrarModalError(error.message || 'Error al eliminar producto');
        }
    }
    
};
window.MenuController = MenuController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();
    MenuController.init();
});