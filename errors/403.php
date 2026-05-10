<?php
$pageTitle = '403 - Acceso denegado';
$assetBase = '../';
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $pageTitle ?></title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="icon" href="<?= $assetBase ?>public/images/logo.png" type="image/png">
</head>
<body class="bg-light">

  <main class="container min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card border-0 shadow-sm text-center p-4 p-md-5" style="max-width: 520px;">
      <div class="card-body">

        <img 
          src="<?= $assetBase ?>public/images/logo.png" 
          alt="Logo Xilotepec" 
          class="img-fluid mb-3"
          style="width: 80px;"
        >

        <h1 class="display-1 fw-bold text-danger">403</h1>
        <h2 class="fw-bold mb-3">Acceso denegado</h2>

        <p class="text-muted mb-4">
          No tienes permisos para acceder a esta página.
        </p>

        <a href="<?= $assetBase ?>public/index.php" class="btn btn-primary">
          Regresar al inicio
        </a>

      </div>
    </div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>