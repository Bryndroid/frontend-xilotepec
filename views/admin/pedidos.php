<?php
// 1. Despertamos la sesión
require_once __DIR__.'/../../helpers/sessionHandler.php';
AppSessionHandler::iniciarSesionSegura();

// 2. Cargamos herramientas de validación
require_once __DIR__.'/../../helpers/AuthMiddleware.php';

// 3. Validamos
if (!isUserAdmin() || !validate_jwt()) {
    header('Location: ../../public/login.php'); 
    exit; 
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
                    <div class="text-muted" style="font-size: 12px;">Administrador, tiempo restante: <span
                            id="countdown"></span></div>
                </div>
            </div>
            <nav class="sidebar-nav p-3 flex-grow-1">
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none"
                    href="index.php ">
                    <i class="fa-solid fa-house" style="width:18px;"></i> Panel principal
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none"
                    href="menu.php ">
                    <i class="fa-solid fa-book-open" style="width:18px;"></i> Menú
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none"
                    href="promociones.php ">
                    <i class="fa-solid fa-gift" style="width:18px;"></i> Promociones
                </a>
                <a class="nav-item-link active d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none"
                    href="pedidos.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Pedidos
                </a>
                <a class="nav-item-link  d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none"
                    href="usuarios.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Usuarios
                </a>
            </nav>
        </aside>

        <div id="main-content" class="flex-grow-1">
            <!--topbar-->
            <header id="topbar"
                class="bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top">
                <div class="d-flex align-items-center gap-3">
                    <button id="btn-sidebar-toggle" class="btn border-0 text-success p-2">
                        <i class="fa-solid fa-bars-staggered"></i>
                    </button>
                    <span class="topbar-title">Pedidos</span>
                </div>
            </header>
            <!--el contenido-->
            <main class="p-4">
                <div class="bg-white border rounded-3 p-4">
                    <!--contenedor de alertar-->
                    <div id="alert-container"></div>
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                        <!--el buscador-->
                        <div class="position-relative" style="width: 325px;">
                            <i
                                class="fa-solid fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input type="text" id="input-search-pedidos" class="form-control ps-5 rounded-pill"
                                placeholder="Buscar por Id o nombre de Cliente">
                        </div>
                        <!--los fiiltros-->
                        <div class="d-flex gap-3">
                            <select id="filter-pedido-status" class="form-select rounded-pill bg-light border-0"
                                style="width: 160px;">
                                <option value="Todos">Todos</option>
                                <option value="cancelada">Cancelados</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="completada">Completados</option>
                            </select>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered table-striped table-hover align-middle text-center mb-0"
                            style="font-size: 12px;">
                            <thead class="bg-light fw-bold">
                                <tr>
                                    <th>ID</th>
                                    <th>Clientes</th>
                                    <th>Pedidos</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="pedidos-table-body">
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
    <div class="modal fade" id="modalPedido" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                <form action="#" id="form-pedido">
                    <input type="hidden" id="modal_ped_id">
                    <div class="modal-body p-4 p-md-5" style="background: #e1dada;">
                        <div class="row g-4">
                            <div class="col-12 col-lg-4">
                                <h5 class="fw-bold mb-3">Información de pedidos</h5>
                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small">Cliente:</label>
                                    <input type="text" id="modal_ped_cliente" class="form-control" readonly>
                                </div>

                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small">Fecha:</label>
                                    <input type="text" id="modal_ped_fecha" class="form-control" readonly>
                                </div>

                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small">ID del pedido:</label>
                                    <input type="text" id="modal_ped_id_display" class="form-control" readonly>
                                </div>

                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small mb-1 d-block">Estado:</label>
                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" name="ped_estado" id="ped_estado_nuevo" class="btn-check"
                                            value="Nuevo">
                                        <label for="ped_estado_nuevo"
                                            class="btn btn-outline-success btn-sm">Nuevo</label>
                                    </div>

                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" name="ped_estado" id="ped_estado_prep" class="btn-check"
                                            value="En preparación">
                                        <label for="ped_estado_prep" class="btn btn-outline-success btn-sm">En
                                            preparación</label>
                                    </div>

                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" name="ped_estado" id="ped_estado_listo" class="btn-check"
                                            value="Listo">
                                        <label for="ped_estado_listo"
                                            class="btn btn-outline-success btn-sm">Listo</label>
                                    </div>

                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" name="ped_estado" id="ped_estado_entregado"
                                            class="btn-check" value="Entregado">
                                        <label for="ped_estado_entregado"
                                            class="btn btn-outline-success btn-sm">Entregado</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-lg-4">
                                <h5 class="fw-bold mb-3 text-dark">Items del pedido</h5>
                                <div id="modal_ped_items" class="d-flex flex-column gap-3">
                                    <!--jalados desde el controlador-->
                                </div>
                            </div>
                            <div class="col-12 col-lg-4">
                                <h5 class="fw-bold mb-3 text-dark">Resumen del cobro:</h5>
                                <div class="bg-white p-3 rounded-3 border">
                                    <div class="mb-3">
                                        <label for="#" class="form-label fw-bold small">Subtotal:</label>
                                        <input type="text" id="modal_ped_subtotal" class="form-control" readonly>
                                    </div>
                                    <div class="mb-3"><label for="#" class="form-label fw-bold small">Total +
                                            Iva(13%):</label>
                                        <input type="text" id="modal_ped_total" class="form-control" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center border-0" style="background: #fff;">
                        <button type="button" class="btn btn-secondary px-4 py-2"
                            data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-success px-4 py-2"
                            onclick="PedidosController.imprimirPedido()"><i
                                class="fa-solid fa-print me-1"></i>Imprimir</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="../../controllers/admin/PedidosController.js"></script>
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
        document.getElementById('countdown').textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
    </script>
</body>

</html>