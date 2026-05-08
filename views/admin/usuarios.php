<?php
require __DIR__.'/../../helpers/AuthMiddleware.php';

if(!isUserAdmin() || !validate_jwt()){
  header('Location: /admin/errors/401.php');
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pedidos</title>
    <!--LInks de boostrap y fontawesome-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
     <link rel="stylesheet" href="../../public/css/style.css" />
</head>
<body>
    <div class="app-wrapper">
        <div id="sidebar-overlay"></div>
        <!--el sidebar-->
        <aside id="sidebar" role="navigation">
            <div class="sidebar-profile d-flex align-items-center gap-3 p-4 border-bottom">
                <div class="sidebar-avatar d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div>
                    <div class="fw-bold"><?= $_SESSION['user']['name'] ?></div>
                    <div class="text-muted" style="font-size: 12px;">Administrador, tiempo restante: <span id="countdown"></span></div>
                </div>
            </div>
            <nav class="sidebar-nav p-3 flex-grow-1">
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="index.php ">
                    <i class="fa-solid fa-house" style="width:18px;"></i> Panel principal
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="menu.php ">
                    <i class="fa-solid fa-book-open" style="width:18px;"></i> Menú
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="promociones.php ">
                    <i class="fa-solid fa-gift" style="width:18px;"></i> Promociones
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="pedidos.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Pedidos
                </a>
                <a class="nav-item-link active d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="usuarios.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Usuarios
                </a>
            </nav>
        </aside>

        <div id="main-content" class="flex-grow-1">
            <!--topbar-->
            <header id="topbar" class="bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top">
                <div class="d-flex align-items-center gap-3">
                    <button id="btn-sidebar-toggle" class="btn border-0 text-success p-2">
                        <i class="fa-solid fa-bars-staggered"></i>
                    </button>
                    <span class="topbar-title">Usuarios</span>
                </div>
            </header>
            <!--el contenido-->
            <main class="p-4">
                <div class="bg-white border rounded-3 p-4">
                    <!--contenedor de alertar-->
                    <div id="alert-container"></div> 
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                        <div class="position-relative" style="width: 300px;">
                            <i class="fa-solid fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input type="text" id="input-search-usuarios" class="form-control ps-5 rounded-pill" placeholder="Buscar por Id o nombre">
                        </div>
                        <div class="d-flex gap-3">
                            <select id="filter-rol" class="form-select rounded-pill bg-light border-0" style="width: 160px;">
                                <option value="Todos">Todos</option>
                                <option value="cliente">Cliente</option>
                                <!--si van a borrar los perfiles nuevos solo borren esto-->
                                <option value="admin">Admin</option>
                                <!--hasta aca-->
                            </select>
                            <button id="btn-nuevo-usuario" class="btn btn-success rounded-pill px-3">
                                <i class="fa-solid fa-plus me-1"></i> Nuevo
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered table-striped table-hover align-middle text-center mb-0" style="font-size: 12px;">
                            <thead class="bg-light fw-bold">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody id="usuarios-table-body">
                               <tr>
                                    <td id='table-head-status' colspan="100%" class="text-center">
                                        <div class="spinner-border text-success m-4" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>               
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!--modales-->
    <div class="modal fade" id="modalUsuario" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                <form id="form-usuario">
                    <!--TODO: Mostrar esto de una manera chida -->
                    <input type="hidden" id="modal_usr_id" value = '0'>
                    <div class="modal-body p-4 p-md-5" style="background: #e1dada;">
                        <div class="row g-4">

                            <!--col de datos generales-->
                            <div class="col-12 col-lg-6">
                                <h5 class="fw-bold mb-3 text-dark">Datos del usuario</h5>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Nombre completo:</label>
                                    <input type="text" id="modal_usr_nombre" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Correo electrónico:</label>
                                    <input type="email" id="modal_usr_correo" class="form-control" required>
                                </div>
                            </div>

                        <!--col de roles -->
                            <div class="col-12 col-lg-6">
                                <h5 class="fw-bold mb-3 text-dark">Rol y Contraseña</h5>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Rol asignado:</label>
                                    <select id="modal_usr_rol" class="form-select">
                                        <option value="cliente">Cliente</option>
                                        <!--si van a borrar los perfiles nuevos solo borren esto-->
                                        <option value="admin">Administrador</option>
                                        <!--hasta aca-->
                                    </select>
                                </div>
                                <div class="mb-3" id ='container-contra' >
                                    <div class = 'input-group'>
                                        <label class="form-label fw-bold small label-contra">Contraseña:</label>
                                        <button class="btn btn-outline-secondary" type="button" id="button-addon1">Mostrar</button>
                                        <input type='password' id = 'modal_usr_contra' class="form-control" minlength="8" >
                                    </div>
                                </div>
                                <div class="bg-white p-3 rounded-3 border">
                                    <p class="fw-bold small mb-2">Permisos del rol</p>
                                    <!--si van a borrar los perfiles nuevos solo borren esto-->
                                    <div id="permisos-roles-adicionales">
                                        <p class="text-muted small mb-1"><b>Administrador:</b>Acceso total a todas las fuciones y a vista de Dashboard</p>
                                        <p class="text-muted small mb-1"><b>Cliente:</b>Usuario con acceso a productos y creacion de ordenes</p>
                                    </div>
                                    <!--hasta aca-->
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center border-0" style="background: #fff;">
                        <button type="button" class="btn btn-secondary px-4 py-2" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-success px-4 py-2">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="../../controllers/admin/UsuariosController.js"></script>
    <script>
      function updateCountdown() {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = <?= $_SESSION['expires_at'] ?>;
        const remaining = expiresAt - now;
        if (remaining <= 0) {
          document.getElementById('countdown').textContent = 'Expirado';
          return;
        }
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        document.getElementById('countdown').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      setInterval(updateCountdown, 1000);
      updateCountdown();
    </script>
</body>
</html>