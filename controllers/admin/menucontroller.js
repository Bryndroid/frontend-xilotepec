import { MenuModel } from '../../models/Product.js';
import { MainController } from './maincontroller.js';
const MenuController = {
    productos: [],
    init: () => {
        MenuController.productos = MenuModel.obtenerProductos();
        MenuController.render();

        document.getElementById('input-search-menu')?.addEventListener('input', MenuController.render);
        document.getElementById('filter-category')?.addEventListener('change', MenuController.render);
        document.getElementById('btn-nuevo-producto')?.addEventListener('click', MenuController.abrirNuevo);

        // subir imagen
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

        // categorias
        document.getElementById('modal_prod_cat')?.addEventListener('change', (e) => {
            document.getElementById('modal_prod_cat_preview').textContent = e.target.value;
        });
    },

    render: () => {
        const query = document.getElementById('input-search-menu').value.toLowerCase();
        const cat = document.getElementById('filter-category').value;
        const tbody = document.getElementById('menu-table-body');

        const filtrados = MenuController.productos.filter(p => {
            const coincide = p.nombre.toLowerCase().includes(query) || p.id.includes(query);
            const coincideCat = cat === 'Todas' || p.categoria === cat;
            return coincide && coincideCat;
        });

        tbody.innerHTML = filtrados.map(p => `
            <tr>
                <td class="fw-bold p-3">${p.id}</td>
                <td><img src="${p.img}" class="rounded border" style="width: 60px; height: 45px; object-fit: cover;"></td>
                <td class="text-start fw-bold">${p.nombre}</td>
                <td><span class="badge bg-light text-dark border">${p.categoria}</span></td>
                <td class="fw-bold text-success">$${p.precio.toFixed(2)}</td>
                <td><span class="badge ${p.estado === 'Disponible' ? 'bg-success' : 'bg-danger'} rounded-pill px-3 py-2">${p.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-dark me-1" onclick="MenuController.abrirEditar('${p.id}')" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="MenuController.mostrarAlerta('Producto eliminado', 'danger')" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    abrirEditar: (id) => {
        const p = MenuController.productos.find(x => x.id === id);
        if (!p) return;

        document.getElementById('modal_prod_id').value = p.id;
        document.getElementById('modal_prod_nombre').value = p.nombre;
        document.getElementById('modal_prod_desc').value = p.descripcion ?? '';
        document.getElementById('modal_prod_cat').value = p.categoria;
        document.getElementById('modal_prod_precio').value = p.precio;
        document.getElementById('modal_prod_img').src = p.img;
        document.getElementById('modal_prod_cat_preview').textContent = p.categoria;

        //para los botones de estado
        if (p.estado === 'Disponible') document.getElementById('prod_estado_disponible').checked = true;
        else document.getElementById('prod_estado_agotado').checked = true;

        new bootstrap.Modal(document.getElementById('modalProducto')).show();
    },

    abrirNuevo: () => {
        document.getElementById('form-producto').reset();
        document.getElementById('modal_prod_img').src = '#';
        document.getElementById('modal_prod_cat_preview').textContent = '—';
        new bootstrap.Modal(document.getElementById('modalProducto')).show();
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
    }
    
};
window.MenuController = MenuController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();
    MenuController.init();
});