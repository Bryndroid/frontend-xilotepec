<?php
$pageTitle = 'Xilotepec Coffee Shop - Menú';
$assetBase = '../../';
require __DIR__ . '/partials/head.php';
?>

<body class="d-flex flex-column min-vh-100">

<?php require __DIR__ . '/partials/navbar.php'; ?>

<main class="container my-5 flex-grow-1">
  <div class="alert alert-primary rounded-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
    <div>
      <h2 class="section-title mb-1">Bienvenido, <?= htmlspecialchars($_SESSION['user']['name'] ?? 'Cliente') ?></h2>
      <p class="mb-0">Selecciona tus productos y prepara tu pedido.</p>
    </div>
    <span class="badge bg-success text-uppercase py-2 px-3">Sesión iniciada</span>
  </div>
  <h2 class="section-title">Nuestro menú</h2>

  <div class="contenedor py-0">
    <div class="bento-cart" id="categorias-menu">
      <button class="box menu open-custom-modal" data-target="calientesModal" style="grid-area: box-1">
        <img src="<?= $assetBase ?>img/bebidacaliente.jpg" alt="Bebidas Calientes" />
        <span>Bebidas Calientes</span>
      </button>

      <button class="box menu open-custom-modal" data-target="friasModal" style="grid-area: box-2">
        <img src="<?= $assetBase ?>img/bebidafria.jpg" alt="Bebidas Frías" />
        <span>Bebidas Frías</span>
      </button>

      <button class="box menu open-custom-modal" data-target="postresModal" style="grid-area: box-3">
        <img src="<?= $assetBase ?>img/postre.jpg" alt="Postres" />
        <span>Postres</span>
      </button>
    </div>
  </div>

  <h2 class="section-title mt-5">Promociones <small>(Solamente aplica en el local)</small></h2>
  <div id="home-alert-container"></div>
  <div id="promociones-dinamicas" class="promo-grid mb-4"></div>
  <div class="bento2" id="promociones-estaticas">
    <article class="box" style="grid-area: box-1"><img src="<?= $assetBase ?>img/6.jpg" alt="Promoción Xilotepec" /></article>
    <article class="box" style="grid-area: box-2"><img src="<?= $assetBase ?>img/7.jpg" alt="Promoción Xilotepec" /></article>
    <article class="box" style="grid-area: box-3"><img src="<?= $assetBase ?>img/8.jpg" alt="Promoción Xilotepec" /></article>
    <article class="box" style="grid-area: box-4"><img src="<?= $assetBase ?>img/9.jpg" alt="Promoción Xilotepec" /></article>
    <article class="box" style="grid-area: box-5"><img src="<?= $assetBase ?>img/10.jpg" alt="Promoción Xilotepec" /></article>
  </div>
</main>

<?php require __DIR__ . '/partials/footer.php'; ?>

<button class="cart-toggle" id="cartToggleBtn" aria-label="Abrir carrito">
  <i class="bi bi-cart-fill"></i>
  <span id="cartBadge" class="cart-badge">0</span>
</button>

<aside id="shopping-cart" class="cart-sidebar">
  <div class="cart-header">
    <h3>Tu carrito</h3>
    <button id="cerrarCarrito" class="close-btn" aria-label="Cerrar carrito">&times;</button>
  </div>

  <div class="carrito-items-container">
    <ul id="carritoItems" class="list-unstyled"></ul>
  </div>

  <div class="cart-footer">
    <div class="total">
      <span>Total:</span>
      <span class="total-price">$<span id="cartTotal">0.00</span></span>
    </div>

    <button id="finalizarCompraBtn" class="checkout-btn">Finalizar compra</button>
    <button id="limpiarBtn" class="clear-btn">Limpiar carrito</button>
  </div>
</aside>

<div id="general-overlay" class="overlay"></div>

<div 
  id="menu-alert-container" 
  class="position-fixed top-0 end-0 p-3" 
  style="z-index: 3000; width: min(420px, calc(100vw - 2rem));">
</div>

<div id="calientesModal" class="custom-modal">
  <div class="custom-modal-header">
    <h3>Bebidas Calientes</h3>
    <button class="close-modal">&times;</button>
  </div>

  <div class="custom-modal-body">
    <div class="products-grid" id="calientesContainer"></div>
  </div>
</div>

<div id="friasModal" class="custom-modal">
  <div class="custom-modal-header">
    <h3>Bebidas Frías</h3>
    <button class="close-modal">&times;</button>
  </div>

  <div class="custom-modal-body">
    <div class="products-grid" id="friasContainer"></div>
  </div>
</div>

<div id="postresModal" class="custom-modal">
  <div class="custom-modal-header">
    <h3>Postres</h3>
    <button class="close-modal">&times;</button>
  </div>

  <div class="custom-modal-body">
    <div class="products-grid" id="postresContainer"></div>
  </div>
</div>

<script type="module" src="../../controllers/cliente/cartcontroller.js"></script>
<script type="module" src="../../controllers/cliente/homecontroller.js"></script>

</body>
</html>