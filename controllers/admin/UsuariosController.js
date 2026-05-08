import { UsuariosModel } from '../../models/User.js';
import { MainController } from './maincontroller.js';

const UsuariosController = {
    datosUsuarios: [],
    init: async () => {
        const btnMostrar = document.getElementById('button-addon1');
        const inputContra = document.getElementById('modal_usr_contra');
        const input = document.getElementById('modal_usr_contra');
        try{
            UsuariosController.datosUsuarios = await UsuariosModel.obtenerUsuarios();
            UsuariosController.renderizarTabla();
            document.getElementById('input-search-usuarios')?.addEventListener('input', UsuariosController.renderizarTabla);
            document.getElementById('filter-rol')?.addEventListener('change', UsuariosController.renderizarTabla);
            document.getElementById('btn-nuevo-usuario')?.addEventListener('click', UsuariosController.prepararCrear);
            document.getElementById('form-usuario')?.addEventListener('submit', UsuariosController.guardarUsuario);
            input.addEventListener('input', () => {
                if (input.value.length < 8) {
                    input.classList.add('is-invalid'); 
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid'); 
                }
            });
            btnMostrar.addEventListener('click', () => {
                const esPassword = inputContra.type === 'password';
                inputContra.type = esPassword ? 'text' : 'password';
                btnMostrar.textContent = esPassword ? 'Ocultar' : 'Mostrar';
            });
        }catch(error){
            UsuariosController.mostrarAlerta('Hubo un error inesperado con la respuesta del servidor', 'danger', false);
            document.querySelector('#table-head-status').innerHTML = ``
            console.error(error);
        }
    },

    renderizarTabla: () => {
        const tbody = document.getElementById('usuarios-table-body');
        if (!tbody) return;

        const busqueda = document.getElementById('input-search-usuarios').value.toLowerCase();
        const filtroRol = document.getElementById('filter-rol').value;

        const filtrados = UsuariosController.datosUsuarios.data.filter(u => {
            const coincideTexto = u.name.toLowerCase().includes(busqueda) || u.id.toString().includes(busqueda);
            const coincideRol = filtroRol === 'Todos' || u.role === filtroRol;
            return coincideTexto && coincideRol;
        });

        tbody.innerHTML = filtrados.map(u => {
            let colorRol = 'bg-secondary';
            if (u.role == 'cliente') colorRol = 'bg-success';
            else if (u.role == 'admin') colorRol = 'bg-warning text-dark';


            return `
                <tr>
                    <td class="fw-bold p-3">${u.id}</td>
                    <td class="text-start fw-bold">${u.name}</td>
                    <td class="text-start text-muted">${u.email}</td>
                    <td><span class="badge ${colorRol} rounded-pill px-3 py-2">${u.role}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-dark me-1" onclick="UsuariosController.editar('${u.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="UsuariosController.eliminar('${u.id}')" title="Eliminar">
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
        document.querySelector('.label-contra').innerHTML = 'Contraseña: ';
        new bootstrap.Modal(document.getElementById('modalUsuario')).show();
    },

    editar: (id) => {
        const u = UsuariosController.datosUsuarios.data.find(x => x.id == id);
        if (!u) return;
  
        document.getElementById('modal_usr_id').value = u.id;
        document.getElementById('modal_usr_nombre').value = u.name;
        document.getElementById('modal_usr_correo').value = u.email;
        document.getElementById('modal_usr_rol').value = u.role;
        document.querySelector('.label-contra').innerHTML = 'Nueva contraseña: ';

        new bootstrap.Modal(document.getElementById('modalUsuario')).show();
    },
    //TODO: Verificar si puedo traer los datos mejor del form!
    guardarUsuario: async (e) => {
        e.preventDefault();
        const id = document.getElementById('modal_usr_id').value;
        const nombre = document.getElementById('modal_usr_nombre').value;
        const correo = document.getElementById('modal_usr_correo').value;
        const rol = document.getElementById('modal_usr_rol').value;
        const contra = document.querySelector('#modal_usr_contra');
        let changePassword = false;
        if(contra.value){
            changePassword = confirm(`Desea cambiar la contraseña del usuario ${nombre}?`);
        }

        const actualHTMLModal = document.querySelector('.modal-footer').innerHTML;
        const cargandoHTMLModal = `<div class="spinner-border text-success m-4" role="status">
                <span class="visually-hidden">Loading...</span>
        </div>`
        const usuario = {
            id: id,
            name: nombre,
            email: correo,
            role: rol,
            ...(changePassword && { password: contra.value })
        }

        try {
            document.querySelector('.modal-footer').innerHTML = cargandoHTMLModal;
           
            if(UsuariosController.datosUsuarios.data.find(x => x.id == id)){
               await UsuariosController.modificarUsuario(usuario);
            }else{
                await UsuariosController.crearNuevoUsuario(usuario);
            }
            document.querySelector('.modal-footer').innerHTML = actualHTMLModal;

            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            UsuariosController.mostrarAlerta('Error al guardar el usuario.', 'danger');
            document.querySelector('.modal-footer').innerHTML = actualHTMLModal;
        } finally{
            document.querySelector('.modal-footer').innerHTML = actualHTMLModal;
        }
    },

    eliminar: async (id) => {
        if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
            return;
        }

        try {
            const resultado = await UsuariosModel.eliminarUsuario(id);
            UsuariosController.mostrarAlerta('Usuario eliminado con éxito.', 'success');

            // Recargar datos y tabla
            UsuariosController.datosUsuarios = await UsuariosModel.obtenerUsuarios();
            UsuariosController.renderizarTabla();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            UsuariosController.mostrarAlerta('Error al eliminar el usuario.', 'success');
        }
    },

    mostrarAlerta: (mensaje, tipo, timeOut = true) => {
        const contenedor = document.getElementById('alert-container');
        contenedor.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                <i class="fa-solid ${tipo === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        if(timeOut){
            setTimeout(() => { contenedor.innerHTML = ''; }, 4000);
        }
    },
    modificarUsuario: async (usuario)=>{
        let resultado;
        if (usuario.email && usuario.id) {
            resultado = await UsuariosModel.modificarUsuario(usuario);
            //TODO: Aca va las validaciones por errores!
            UsuariosController.mostrarAlerta('Usuario guardado con éxito.', 'success');
            UsuariosController.init();
        } else {
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
            UsuariosController.mostrarAlerta('Sin credenciales validas', 'danger');
            return;
        }
    },
    crearNuevoUsuario: async (usuario)=>{
        let resultado;

        if (usuario.email && usuario.password) {
            resultado = await UsuariosModel.crearUsuario(usuario);
            //TODO: Aca va las validaciones por errores!
            UsuariosController.mostrarAlerta('Usuario creado con éxito.', 'success');
            UsuariosController.init();
        } else {
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
            UsuariosController.mostrarAlerta('Sin credenciales validas', 'danger');
            return;
        }
    }
};

window.UsuariosController = UsuariosController;
document.addEventListener('DOMContentLoaded', () => {
    MainController.init();
    UsuariosController.init();
});