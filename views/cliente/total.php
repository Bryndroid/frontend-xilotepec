<?php
$pageTitle = 'Xilotepec Coffee Shop - Mi pedido';
$assetBase = '../../';
require __DIR__ . '/partials/head.php';
?>
<body class="d-flex flex-column min-vh-100">
<?php require __DIR__ . '/partials/navbar.php'; ?>
<main class="contenedor flex-grow-1">
  <div class="alert alert-light rounded-4 shadow-sm mb-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
      <div>
        <h2 class="mb-1">Hola, <?= htmlspecialchars($_SESSION['user']['name'] ?? 'Cliente') ?></h2>
        <p class="mb-0 text-muted">Revisa tu pedido antes de enviarlo y confirma tu información de pago.</p>
      </div>
      <span class="badge bg-success text-uppercase py-2 px-3">Sesión iniciada</span>
    </div>
  </div>
  <h2>Resumen de tu pedido</h2>
  <div id="checkout-alert-container"></div>
  <div class="checkout-grid">
    <section class="receipt-card" id="tabla">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 class="mb-1 fw-bold" style="color: var(--primary-dark)">Xilotepec Coffee Shop</h3>
          <p class="text-muted mb-0">Detalle de compra</p>
        </div>
        <img src="<?= $assetBase ?>public/img/Logo xilo color.jpg" alt="Xilotepec" style="width:82px;border-radius:16px" />
      </div>
      <div id="tablaContainer"></div>
    </section>

    <aside class="checkout-panel">
      <h3 class="fw-bold mb-3" style="color: var(--primary-dark)">Finalizar orden</h3>
      <form id="formCheckout">
        <div class="mb-3">
          <label for="paymentMethod" class="form-label fw-bold">Método de pago</label>
          <select class="form-select" id="paymentMethod" required>
            <option value="">Cargando métodos de pago...</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="floatingTextarea2" class="form-label fw-bold">Dirección de entrega</label>
          <textarea class="form-control" id="floatingTextarea2" placeholder="Escribe tu dirección si pides a domicilio" style="min-height: 8rem"></textarea>
        </div>
        <button type="submit" class="btn btn-xilo w-100 mb-2">Enviar pedido</button>
        <button type="button" class="btn btn-outline-secondary w-100" id="btnPDF">Descargar recibo</button>
      </form>
    </aside>
  </div>

  <section class="checkout-panel">
    <div id="ultimoPedidoContainer"></div>
  </section>


  <section class="checkout-panel">
    <div id="comments-alert-container"></div>
    <form id="formComentarios">
      <h3 class="fw-bold" style="color: var(--primary-dark)">¡Queremos saber tu opinión!</h3>
      <p class="text-muted">Gracias a ti en Xilotepec podemos mejorar continuamente.</p>
      <textarea class="form-control mb-3" id="floatingTextarea" placeholder="Déjanos un comentario" style="min-height: 8rem"></textarea>
      <button type="submit" class="btn btn-xilo" id="btnComentarios">Enviar comentarios</button>
    </form>
  </section>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script type="module" src="../../controllers/cliente/totalcontroller.js"></script>
</body>
</html>
