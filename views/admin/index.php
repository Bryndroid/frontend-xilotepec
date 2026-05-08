<?php
require __DIR__.'/../../helpers/AuthMiddleware.php';

if(!isUserAdmin() || !validate_jwt()){
  header('Location: /admin/errors/401.php');
}
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
              <div class="fw-bold"><?=  $_SESSION['user']['name'] ?></div>
              <div class="text-muted" style="font-size: 12px">
                Administrador, tiempo restante: <span id="countdown"></span>
              </div>
              <button class = 'btn-primary' id = 'btn-close-session'>
                  Cerrar sesión.
              </button>
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
          <h1 class="mb-1">Bienvenido, usuario <?=  $_SESSION['user']['name'] ?></h1>
          <p class="mb-0" id="today-date">...</p>
        </section>

        <main class="p-4">
          <div class="row g-3 mb-4 border p-3 rounded-3">
            <!--TODO:Definir que fecha es hoy xdd-->
            <h3 class = ''>Resumen de hoy</h3>
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Ventas</div>
                <div id="today-revenue-container" class="h2 mb-0">
                  <div class="placeholder-glow">
                      <span 
                          class="placeholder col-4 d-inline-block bg-info"
                          style="height: 28px;"
                      ></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Total Pedidos</div>
                <div id = 'today-order-container' class="h2 mb-0">
                  <div class="placeholder-glow">
                      <span 
                          class="placeholder col-4 d-inline-block bg-info"
                          style="height: 28px;"
                      ></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Pedidos Completados</div>
                <div id = 'today-order-active'class="h2 mb-0">
                  <div class="placeholder-glow">
                      <span 
                          class="placeholder col-4 d-inline-block bg-info"
                          style="height: 28px;"
                      ></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="bg-white p-3 border rounded-3 h-100">
                <div class="text-muted mb-2">Pedidos Pendientes</div>
                <div id = 'today-order-inactive'class="h2 mb-0"><div class="placeholder-glow">
                      <span 
                          class="placeholder col-4 d-inline-block bg-info"
                          style="height: 28px;"
                      ></span>
                  </div></div>
              </div>
            </div>
          </div>

          <!-- Contenedor principal con posición relativa para que el overlay se ajuste a él -->
        <div id="container-to-blur" class="position-relative">
          
          
          <div id="loading-overlay" class="loading-overlay d-none">
            <div class="text-center">
              <div class="spinner-border text-primary" role="status" >
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-12 col-lg-6">
              <div class="bg-white border rounded-3 h-100">
                <div class="p-3 border-bottom d-flex justify-content-between">
                  <h4 class="mb-0">Histórico de Ventas</h4>
                  <select id='select-date-orders' class="form-select form-select-sm w-auto">
                    <option selected value='today'>Hoy</option>
                    <option value='last_week'>Ultima semana</option>
                    <option value='last_month'>Este mes</option>
                    <option value='year'>Este año</option>
                  </select>
                </div>
                <div class="p-3 d-flex align-items-center justify-content-center">
                  <canvas id="miChart" style="min-height: 280px;"></canvas>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-6">
              <div class="bg-white border rounded-3 h-100">
                <div class="p-3 border-bottom d-flex justify-content-between">
                  <h4 class="mb-0">
                    <select id = 'select-type-barchart'class="form-select-sm border-0 bg-transparent fw-bold">
                      <option selected value='categorias'>Categorias</option>
                      <option value ='productos'>Productos</option>
                    </select>
                    más vendidas/os
                  </h4>
                  <select id='select-date-combined' class="form-select form-select-sm w-auto">
                    <option selected value='hoy'>Hoy</option>
                    <option value='semana anterior'>Ultima semana</option>
                    <option value='mes anterior'>Ultimos 30 dias</option>
                    <option value='año'>Este año</option>
                  </select>
                </div>
                <div class="p-3 d-flex align-items-center justify-content-center">
                  <canvas id="miChart2" style="min-height: 280px; "></canvas>
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

    </div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
      integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
      crossorigin="anonymous"
    ></script>
  <script type="module" src="../../controllers/admin/DashboardController.js"></script>  
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
