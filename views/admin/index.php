<?php


?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Panel Principal</title>
    <!--LInks de boostrap y fontawesome-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link rel="stylesheet" href="../../public/css/style.css" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div class="app-wrapper">
      <div class="sidebar-overlay">
        <aside id="sidebar" role="navigation">
          <div class="sidebar-profile d-flex align-items-center gap-3 p-4 border-bottom">
            <div class="sidebar-avatar d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              <div class="fw-bold">Usuario nombre</div>
              <div class="text-muted" style="font-size: 12px">
                Administrador
              </div>
            </div>
          </div> 
            <nav class="sidebar-nav p-3 flex-grow-1">
                <a class="nav-item-link active d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="index.php">
                    <i class="fa-solid fa-house" style="width:18px;"></i> Panel principal
                </a>
                <a class="nav-item-link  d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="menu.php ">
                    <i class="fa-solid fa-book-open" style="width:18px;"></i> Menú
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="promociones.php ">
                    <i class="fa-solid fa-gift" style="width:18px;"></i> Promociones
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="pedidos.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Pedidos
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="usuarios.php ">
                    <i class="fa-solid fa-bag-shopping" style="width:18px;"></i> Usuarios
                </a>
            </nav>    
        </aside>
      </div>
      <div id="main-content" class="flex-grow-1">
        <header id="topbar" class="bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top">
          <div class="d-flex align-items-center gap-3">
            <button id="btn-sidebar-toggle" class="btn border-0 text-success">
              <i class="fa-solid fa-bars-staggered"></i>
            </button>
            <span class="topbar-title">Dashboard</span>
          </div>
        </header>

        <section id="welcome-banner" class="mx-4 mt-3 p-4 rounded-3 text-white">
          <h1 class="mb-1">Bienvenido, usuario Administrador</h1>
          <p class="mb-0" id="today-date">...</p>
        </section>

        <main class="p-4">
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Ventas de hoy</div>
                <div id = 'today-revenue-container'class="h2 mb-0">...</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Pedidos de hoy</div>
                <div id = 'today-order-container' class="h2 mb-0">...</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Ordenes Activas</div>
                <div id = 'today-order-active'class="h2 mb-0">...</div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-12">
              <div class="bg white border rounede-3 p-3">
                <h5 class="mb-3">Historico de Ventas</h5>
                <div class="chart-placeholder d-flex align-items-center justify-content-between text-muted rounded-3" style="height: 250px;background-color: #fff; border: 1px dashed #ccc;">
                  <canvas id="miChart" style = 'height: 200px; width: 400px;'></canvas>
                  <canvas id="miChart" style = 'height: 200px; width: 400px;'></canvas>
                </div>
              </div>
            </div>
          </div>

        <div class="row g-3">
                    <div class="col-12 col-lg-5">
                        <div class="bg-white border rounded-3 h-100">
                            <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Promociones Activas</h5>
                            </div>
                            <div id="dashboard-promos-list" class="p-2">
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-7">
                        <div class="bg-white border rounded-3">
                            <div class="p-3 border-bottom">
                                <h5 class="mb-0">Pedidos Recientes</h5>
                            </div>
                            <div class="table-responsive">
                                <table class="table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th class="p-3">#</th>
                                            <th>Cliente</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="orders-table-body">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
      integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
      crossorigin="anonymous"
    ></script>
  <script type="module" src="../../controllers/admin/dashboardcontroller.js"></script>  
</body>
</html>
