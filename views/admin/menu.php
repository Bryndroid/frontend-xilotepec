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
    <title>Menú</title>
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
                <a class="nav-item-link active d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="menu.php ">
                    <i class="fa-solid fa-book-open" style="width:18px;"></i> Menú
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="promociones.php ">
                    <i class="fa-solid fa-gift" style="width:18px;"></i> Promociones
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="pedidos.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Pedidos
                </a>
                <a class="nav-item-link  d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="usuarios.php ">
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
                    <span class="topbar-title">Menú</span>
                </div>
            </header>
            <!--el contenido-->
            <main class="p-4">
                <div class="bg-white border rounded-3 p-4">
                    <!--contenedor de alertar-->
                    <div id="alert-container"></div>
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                        <!--el buscador-->
                        <div class="position-relative" style="width: 300px;">
                            <i class="fa-solid fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input type="text" id="input-search-menu" class="form-control ps-5 rounded-pill" placeholder="Buscar por Id o nombre">
                        </div>
                        <!--los fiiltros-->
                        <div class="d-flex gap-3">
                            <!--TODO: Cargar dinamico estas categorias -->
                            <select id="filter-category" class="form-select rounded-pill bg-light border-0" style="width: 150px;">
                                <option value="Todas"><div class="spinner-border text-success m-4" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div></option>
                            </select>
                            <button id="btn-nuevo-producto" class="btn btn-success rounded-pill px-3">
                                <i class="fa-solid fa-plus me-1"></i> Nuevo 
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered table-striped table-hover align-middle text-center mb-0" style="font-size: 12px;">
                            <thead class="bg-light fw-bold ">
                                <tr>
                                    <th >ID</th>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="menu-table-body">
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
    <div class="modal fade" id="modalProducto" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                <form id="form-producto">
                    <input type="hidden" id="modal_prod_id" value = '0'>
                    <div class="modal-body p-4 p-md-5" style="background: #e1dada;">
                        <div class="row g-4">

                            <div class="col-12 col-lg-4 text-center">
                                <div class="bg-white p-4 rounded-3 d-flex flex-column align-items-center justify-content-center h-100">
                                    <img src="#" alt="Imagen producto" id="modal_prod_img" class="img-fluid rounded mb-4" style="object-fit: cover; width: 250px; height: 250px;">
                                    <input type="file" id="input_prod_file" class="d-none">
                                    <button type="button" class="btn btn-success w-100 fw-bold" id="btn-upload-prod">
                                        <i class="fa-solid fa-upload"></i>
                                        Actualizar Imagen
                                    </button>
                                </div>
                            </div>

                            <div class="col-12 col-lg-4">
                                <h5 class="fw-bold mb-3 text-dark">Detalles principales</h5>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Nombre del producto:</label>
                                    <input type="text" id="modal_prod_nombre" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small mb-1 d-block">Estado:</label>
                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" name="prod_estado" id="prod_estado_disponible" class="btn-check" value="Disponible" checked>
                                        <label for="prod_estado_disponible" class="btn btn-outline-success btn-sm">Disponible</label>
                                        <input type="radio" name="prod_estado" id="prod_estado_agotado" class="btn-check" value="Agotado">
                                        <label for="prod_estado_agotado" class="btn btn-outline-success btn-sm">Agotado</label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Descripción:</label>
                                    <textarea id="modal_prod_desc" class="form-control" rows="2" placeholder="Describe el producto..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Categoría:</label>
                                    <select id ='select-categoria-product' class="form-select" >
                                        
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small">Precio en $:</label>
                                    <input type="number" id="modal_prod_precio" class="form-control" step="0.01" required>
                                </div>
                            </div>

                            <!--Acaa es porque no se que van a dejar del menu en si por si se agrega algo mas aca queda
                            esto no lo borres-->
                            <div class="col-12 col-lg-4">
                               
                                <div class=" mt-5">
                                    <p class="fw-bold small mb-2">Cantidad máxima por persona: </p>
                                    <input type="number" id="modal_prod_cantidad" class="form-control" step="1" required>
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
    <script type="module" src="../../controllers/admin/MenuController.js"></script>
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