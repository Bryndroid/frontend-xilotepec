<?php 
require_once __DIR__.'/../../../helpers/sessionHandler.php';
AppSessionHandler::iniciarSesionSegura();
$userName = htmlspecialchars($_SESSION['user']['name'] ?? 'Usuario');
$assetBase = $assetBase ?? '../../'; ?>
<header class="custom-header">
  <a class="brand-logo" href="../../public/index.php">
    <img src="<?= $assetBase ?>public/images/Logo xilo color.jpg" alt="Logo Xilotepec" />
  </a>
  <nav>
    <ul class="nav-links">
      <li><a href="../../public/index.php#conocenos">Nuestra Historia</a></li>
      <li><a href="../../public/index.php#promociones">Promociones</a></li>
      <li><a href="menu.php">Menú</a></li>
      <li><a href="total.php">Mi pedido</a></li>
      <li><a href="#" id="btn-logout" class="btn-logout"><?=$userName?> - Cerrar Sesión</a></li>
    </ul>
  </nav>
</header>
