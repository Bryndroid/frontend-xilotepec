<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!--LInks de boostrap y fontawesome-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../../public/css/style.css" />
  </head>
  <body>
    <div class="app-wrapper">
      
      <!--sidebar-->
      <div class="sidebar-overlay">
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
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="../index.html">
                    <i class="fa-solid fa-house" style="width:18px;"></i> Panel principal
                </a>
                <a class="nav-item-link active d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="menu.html">
                    <i class="fa-solid fa-book-open" style="width:18px;"></i> Menú
                </a>
                <a class="nav-item-link d-flex align-items-center gap-3 p-2 rounded-3 mb-1 text-decoration-none" href="promociones.html">
                    <i class="fa-solid fa-gift" style="width:18px;"></i> Promociones
                </a>
            </nav>
        </aside>
      </div>

      <div id="main-content" class="flex-grow-1">
        
        <!--topbar-->
        <header id="topbar" class="bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top">
          <div class="d-flex align-items-center gap-3">
            <button id="btn-sidebar-toggle" class="btn border-0 text-success">
              <i class="fa-solid fa-bars-staggered"></i>
            </button>
            <span class="topbar-title">[Título de la Sección]</span>
          </div>
        </header>

        <!--el contenido-->
        <main class="p-4">
          <!--aqui va el contenido especifico de la pagina -->
          <div class="container-fluid">
             <h2>Contenidoo</h2>
             <p>Tablas</p>
          </div>
        </main>

      </div>
    </div>

    <!--scripts generales-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script type = 'module' src="js/controllers/maincontroller.js"></script>
    
</body>
</html>