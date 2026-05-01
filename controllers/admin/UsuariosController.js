import { UsuariosModel } from '../../models/User.js';
import { MainController } from './maincontroller.js';

const UsuariosController = {
    datosUsuarios: [],

    init: () => {
        UsuariosController.datosUsuarios = UsuariosModel.obtenerUsuarios();
        UsuariosController.renderizarTabla();

        document.getElementById('input-search-usuarios')?.addEventListener('input', UsuariosController.renderizarTabla);
        document.getElementById('filter-rol')?.addEventListener('change', UsuariosController.renderizarTabla);
        document.getElementById('btn-nuevo-usuario')?.addEventListener('click', UsuariosController.prepararCrear);
    },

    renderizarTabla: () => {
        const tbody = document.getElementById('usuarios-table-body');
        if (!tbody) return;

        const busqueda = document.getElementById('input-search-usuarios').value.toLowerCase();
        const filtroRol = document.getElementById('filter-rol').value;

        const filtrados = UsuariosController.datosUsuarios.filter(u => {
            const coincideTexto = u.nombre.toLowerCase().includes(busqueda) || u.id.includes(busqueda);
            const coincideRol = filtroRol === 'Todos' || u.rol === filtroRol;
            return coincideTexto && coincideRol;
        });

        tbody.innerHTML = filtrados.map(u => {
            let colorRol = 'bg-secondary';
            if (u.rol === 'Administrador') colorRol = 'bg-success';
            /*perfiles agregados los nuevos*/
            else if (u.rol === 'Publicista') colorRol = 'bg-primary';
            else if (u.rol === 'Gerente') colorRol = 'bg-warning text-dark';
            /*hastat aca*/

            const colorEstado = u.estado === 'Activo' ? 'bg-success' : 'bg-secondary';

            return `
                <tr>
                    <td class="fw-bold p-3">${u.id}</td>
                    <td class="text-start fw-bold">${u.nombre}</td>
                    <td class="text-start text-muted">${u.correo}</td>
                    <td><span class="badge ${colorRol} rounded-pill px-3 py-2">${u.rol}</span></td>
                    <td><span class="badge ${colorEstado} rounded-pill px-3 py-2">${u.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-dark me-1" onclick="UsuariosController.editar('${u.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="UsuariosController.mostrarAlerta('Usuario eliminado.', 'danger')" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    prepararCrear: () => {
        document.getElementById('form-usuario').reset();
        document.getElementById('modal_usr_id').value = '';
        new bootstrap.Modal(document.getElementById('modalUsuario')).show();
    },

    editar: (id) => {
        const u = UsuariosController.datosUsuarios.find(x => x.id === id);
        if (!u) return;

        document.getElementById('modal_usr_id').value = u.id;
        document.getElementById('modal_usr_nombre').value = u.nombre;
        document.getElementById('modal_usr_correo').value = u.correo;
        document.getElementById('modal_usr_rol').value = u.rol;

        if (u.estado === 'Activo') document.getElementById('usr_estado_activo').checked = true;
        else document.getElementById('usr_estado_inactivo').checked = true;

        new bootstrap.Modal(document.getElementById('modalUsuario')).show();
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

window.UsuariosController = UsuariosController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();
    UsuariosController.init();
});