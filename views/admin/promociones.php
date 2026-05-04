<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Promociones</title>
    <!--LInks de boostrap y fontawesome-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
     <link rel="stylesheet" href="../../public/css/style.css" />
  </head>
  <body>
    <div class="app-wrapper">
      <div class="sidebar-overlay"></div>
      <!--el sidebar-->
        <aside id="sidebar" role="navigation">
          <div class="sidebar-profile d-flex align-items-center gap-3 p-4 border-bottom">
            <div class="sidebar-avatar d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              <div class="fw-bold">Usuario nombre</div>
              <div class="text-muted" style="font-size: 12px">Administrador</div>
            </div>
          </div>

            <nav class="sidebar-nav p-3 flex-grow-1">
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="index.php ">
                    <i class="fa-solid fa-house" style="width:18px;"></i> Panel principal
                </a>
                <a class="nav-item-link  d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="menu.php ">
                    <i class="fa-solid fa-book-open" style="width:18px;"></i> Menú
                </a>
                <a class="nav-item-link active d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="promociones.php ">
                    <i class="fa-solid fa-gift" style="width:18px;"></i> Promociones
                </a>
                <a class="nav-item-link  d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="pedidos.php ">
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
            <button id="btn-sidebar-toggle" class="btn border-0 text-success">
              <i class="fa-solid fa-bars-staggered"></i>
            </button>
            <span class="topbar-title">Promociones</span>
          </div>
        </header>

        <!--el contenido-->
        <main id="page-content" class="p-4">
            <div class="bg-white border rounded-3 p-4">
                <!--contenedor de alertar-->
                <div id="alert-container"></div>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                    <!--el buscador-->
                    <div class="position-relative" style="width: 300px;">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input type="text" id="input-search-promos" class="form-control ps-5 rounded-pill" placeholder="Buscar por Id o nombre">
                    </div>
                    <!--los fiiltros-->
                    <div class="d-flex align-items-center gap-3">
                        <select id="filter-promo-status" class="from-select rounded-pill bg-light border-0" style="width: 150px;">
                            <option value="Todas">Todas</option>
                            <option value="Activa">Activas</option>
                            <option value="Programada">Programadas</option>
                            <option value="Inactiva">Inactivas</option>
                        </select>
                        <button id="btn-nueva-promo" class="btn btn-success rounded-pill px-3">
                            <i class="fa-solid fa-plus"></i>
                            Nuevo
                        </button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped table-hover align-middle text-center mb-0" style="font-size: 12px;">
                        <thead class="bg-light fw-bold ">
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre promoción</th>
                            <th>Descripción</th>
                            <th>Periodo de validez</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody id="promos-table-body"></tbody>
                    </table>
                </div>
            </div>
        </main>
      </div>
    </div>

    <!--modales-->
    <div class="modal fade" id="modalPromocion" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                <form action="#" id="form-gestion-promo">
                    <input type="hidden" id="modal_promo_id">
                    <div class="modal-body p-4 p-md-5" style="background: #e1dada;">
                        <div class="row g-4">

                            <div class="col-12 col-lg-4 text-center">
                                <div class="bg-white p-4 rounded-3 d-flex flex-column align-items-center justify-content-center h-100">
                                    <img src="#" alt="##" id="modal_promo_img" class="img-fluid rounded mb-4" style="object-fit: cover; width: 250px; height: 250px;">
                                    <input type="file" id="input_promo_file" class="d-none">
                                    <button type="button" class="btn btn-success w-100 fw-bold" id="btn-upload-img">
                                        <i class="fa-solid fa-upload"></i>
                                        Actualizar Imagen
                                    </button>
                                </div>
                            </div>

                            <div class="col-12 col-lg-4">
                                <h5 class="fw-bold mb-3 text-dark">Detaalles principales</h5>
                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small">Nombre de la promoción:</label>
                                    <input type="text" id="modal_promo_nombre" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small mb-1 d-block">Estado: </label>
                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" name="promo_estado" id="estado_activa" class="btn-check" value="Activa" checked>
                                        <label for="estado_activa" class="btn btn-outline-success btn-sm">Activa</label>
                                        <input type="radio" name="promo_estado" id="estado_prog" value="Programada" class="btn-check">
                                        <label for="estado_prog" class="btn btn-outline-success btn-sm">Programada</label>
                                        <input type="radio" class="btn-check" name="promo_estado" id="estado_inact" value="Inactiva">
                                        <label for="estado_inact" class="btn btn-outline-success btn-sm">Inactiva</label>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="#" class="form-label fw-bold small">Descripción:</label>
                                    <textarea name="#" id="modal_promo_desc" class="form-control" rows="2"></textarea>
                                </div>
                                <label for="#" class="form-label fw-bold small mb-1">Periodo de validez:</label>
                                <div class="row g-2">

                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text bg-light fw-bold">Desde</span>
                                            <input type="date" id="modal_promo_desde" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text bg-light fw-bold">Hasta</span>
                                            <input type="date" id="modal_promo_hasta" class="form-control" required>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-lg-4">
                                <h5 class="fw-bold mb-3 text-dark">Regla de la oferta</h5>
                                <div class="bg-white p-3 rounded-3 mb-3 border">
                                    <p class="fw-bold small mb-2">Productos afectados</p>
                                    <input type="text" class="form-control form-control-sm mb-2" id="modal_promo_producto" value="Caramelo king">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center border-0" style="background: #fff;">
                        <button type="button" class="btn btn-secondary px-4 py-2" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-success px-4 py-2" data-bs-dismiss="modal" onclick="PromocionesController.mostrarAlerta('Promoción guardada con exito.','success')">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="../../controllers/admin/PromocionesController.js"></script>
</body>
</html>