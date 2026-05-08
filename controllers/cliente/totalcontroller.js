import { MainController } from './maincontroller.js';

// ====== CAPA DE DATOS ======
const TotalDataService = {
  async cargarMetodosPago() {
    try {
      const response = await fetch(`${MainController.apiUrl}/metodos-pago`);
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error('No se encontraron métodos de pago');
      return data;
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
      throw error;
    }
  },

  async enviarOrden(paymentMethodId, detalles) {
    try {
      const response = await fetch(`${MainController.apiUrl}/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...MainController.authHeaders()
        },
        body: JSON.stringify({ payment_method_id: paymentMethodId, detalles })
      });

      const data = await response.json();
      if (!response.ok) {
        const errores = data.errores ? Object.values(data.errores).flat().join('<br>') : data.error || data.mensaje;
        throw new Error(errores || 'No se pudo procesar la orden');
      }

      return data;
    } catch (error) {
      console.error('Error al enviar orden:', error);
      throw error;
    }
  },

  async cargarUltimoPedido() {
    try {
      const response = await fetch(`${MainController.apiUrl}/ordenes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...MainController.authHeaders()
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || data.error || 'No se pudo cargar el último pedido');
      }

      const ordenes = this.normalizarListaOrdenes(data);
      return this.obtenerOrdenMasReciente(ordenes);
    } catch (error) {
      console.error('Error al cargar último pedido:', error);
      throw error;
    }
  },

  normalizarListaOrdenes(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.ordenes)) return data.ordenes;
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },

  obtenerOrdenMasReciente(ordenes) {
    if (!Array.isArray(ordenes) || ordenes.length === 0) return null;

    return [...ordenes].sort((a, b) => {
      const fechaA = new Date(a.created_at || a.date || a.fecha || 0).getTime();
      const fechaB = new Date(b.created_at || b.date || b.fecha || 0).getTime();

      if (!Number.isNaN(fechaA) && !Number.isNaN(fechaB) && fechaA !== fechaB) {
        return fechaB - fechaA;
      }

      return Number(b.id || 0) - Number(a.id || 0);
    })[0];
  }
};

// ====== CAPA DE NEGOCIO ======
const TotalService = {
  carrito: JSON.parse(localStorage.getItem('xilotepec_cart')) || [],

  obtenerCarrito() {
    return this.carrito;
  },

  estaVacio() {
    return this.carrito.length === 0;
  },

  total() {
    return this.carrito.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
  },

  detallesOrden() {
    return this.carrito.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));
  },

  limpiarCarrito() {
    this.carrito = [];
    localStorage.removeItem('xilotepec_cart');
  },

  guardarUltimoPedido(orden) {
    if (!orden) return;
    localStorage.setItem('xilotepec_last_order', JSON.stringify(orden));
  },

  obtenerUltimoPedidoLocal() {
    try {
      return JSON.parse(localStorage.getItem('xilotepec_last_order')) || null;
    } catch (error) {
      return null;
    }
  }
};

// ====== CAPA DE PRESENTACIÓN ======
const TotalUIRenderer = {
  renderResumenPlaceholder() {
    const container = document.getElementById('tablaContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="placeholder-glow">
        <span class="placeholder col-12 mb-3" style="height: 42px"></span>
        <span class="placeholder col-12 mb-2" style="height: 34px"></span>
        <span class="placeholder col-10 mb-2" style="height: 34px"></span>
        <span class="placeholder col-8" style="height: 34px"></span>
      </div>`;
  },

  renderResumen() {
    const container = document.getElementById('tablaContainer');
    if (!container) return;

    const carrito = TotalService.obtenerCarrito();

    if (carrito.length === 0) {
      container.innerHTML = `<div class="empty-state">No hay productos en tu carrito. <a href="menu.php">Volver al menú</a></div>`;
      return;
    }

    const rows = carrito.map(item => `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-end">$${Number(item.price).toFixed(2)}</td>
        <td class="text-end">$${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
      </tr>`).join('');

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle table-xilo">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="text-center">Cantidad</th>
              <th class="text-end">Precio</th>
              <th class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <th colspan="3" class="text-end">Total</th>
              <th class="text-end">$${TotalService.total().toFixed(2)}</th>
            </tr>
          </tfoot>
        </table>
      </div>`;
  },

  renderUltimoPedidoPlaceholder() {
    const container = document.getElementById('ultimoPedidoContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="placeholder-glow">
        <span class="placeholder col-5 mb-3" style="height: 28px"></span>
        <span class="placeholder col-12 mb-2" style="height: 32px"></span>
        <span class="placeholder col-9 mb-2" style="height: 32px"></span>
        <span class="placeholder col-7" style="height: 32px"></span>
      </div>`;
  },

  renderUltimoPedido(orden) {
    const container = document.getElementById('ultimoPedidoContainer');
    if (!container) return;

    if (!orden) {
      container.innerHTML = '<div class="empty-state mb-0">Aún no tienes pedidos registrados.</div>';
      return;
    }

    const detalles = orden.details || orden.detalles || orden.order_details || [];
    const fecha = orden.date || orden.created_at || '';
    const metodoPago = orden.payment_method?.name || orden.paymentMethod?.name || orden.payment_method?.nombre || '';

    const detalleHTML = Array.isArray(detalles) && detalles.length > 0
      ? detalles.map(item => `
          <tr>
            <td>${item.product_name || item.name || `Producto #${item.product_id || ''}`}</td>
            <td class="text-center">${Number(item.quantity || 0)}</td>
            <td class="text-end">$${Number(item.unit_price || item.price || 0).toFixed(2)}</td>
            <td class="text-end">$${Number(item.subtotal || 0).toFixed(2)}</td>
          </tr>`).join('')
      : '<tr><td colspan="4" class="text-center text-muted">No hay detalle disponible.</td></tr>';

    container.innerHTML = `
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h3 class="fw-bold mb-1" style="color: var(--primary-dark)">Último pedido realizado</h3>
          <p class="text-muted mb-0">Pedido #${orden.id || 'N/D'} ${fecha ? `- ${fecha}` : ''}</p>
          ${metodoPago ? `<p class="text-muted mb-0">Método de pago: ${metodoPago}</p>` : ''}
        </div>
        <span class="badge bg-secondary text-uppercase">${orden.status || 'pendiente'}</span>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle table-xilo mb-2">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="text-center">Cantidad</th>
              <th class="text-end">Precio</th>
              <th class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>${detalleHTML}</tbody>
          <tfoot>
            <tr>
              <th colspan="3" class="text-end">Total</th>
              <th class="text-end">$${Number(orden.total || 0).toFixed(2)}</th>
            </tr>
          </tfoot>
        </table>
      </div>`;
  },

  renderUltimoPedidoError(mensaje) {
    const container = document.getElementById('ultimoPedidoContainer');
    if (!container) return;

    const local = TotalService.obtenerUltimoPedidoLocal();
    if (local) {
      this.renderUltimoPedido(local);
      return;
    }

    container.innerHTML = `
      <div class="alert alert-warning mb-0" role="alert">
        <i class="bi bi-exclamation-circle me-2"></i>
        ${mensaje || 'No se pudo cargar el último pedido.'}
      </div>`;
  },

  renderMetodosPago(metodos) {
    const select = document.getElementById('paymentMethod');
    if (!select) return;

    select.disabled = false;
    select.innerHTML = '<option value="">Selecciona un método</option>' + metodos.map(m => `
      <option value="${m.id}">${m.name || m.nombre || `Método ${m.id}`}</option>
    `).join('');
  },

  renderMetodoPagoFallback() {
    const select = document.getElementById('paymentMethod');
    if (!select) return;

    select.disabled = false;
    select.innerHTML = '<option value="1">Efectivo</option>';
  },

  setMetodosPagoLoading() {
    const select = document.getElementById('paymentMethod');
    if (!select) return;

    select.disabled = true;
    select.innerHTML = '<option value="">Cargando métodos de pago...</option>';
  }
};

// ====== CONTROLADOR ======
const TotalController = {
  async init() {
    TotalUIRenderer.renderResumenPlaceholder();
    setTimeout(TotalUIRenderer.renderResumen, 150);

    if (MainController.estaAutenticado()) {
      await this.cargarUltimoPedido();
    } else {
      TotalUIRenderer.renderUltimoPedido(null);
    }

    await this.cargarMetodosPago();

    document.getElementById('btnPDF')?.addEventListener('click', TotalController.descargarPDF);
    document.getElementById('formComentarios')?.addEventListener('submit', TotalController.enviarComentario);
    document.getElementById('formCheckout')?.addEventListener('submit', TotalController.enviarOrden);
  },

  async cargarUltimoPedido() {
    TotalUIRenderer.renderUltimoPedidoPlaceholder();

    try {
      const orden = await TotalDataService.cargarUltimoPedido();
      TotalUIRenderer.renderUltimoPedido(orden);
    } catch (error) {
      TotalUIRenderer.renderUltimoPedidoError(error.message);
    }
  },

  async cargarMetodosPago() {
    TotalUIRenderer.setMetodosPagoLoading();

    try {
      const metodos = await TotalDataService.cargarMetodosPago();
      TotalUIRenderer.renderMetodosPago(metodos);
    } catch (error) {
      TotalUIRenderer.renderMetodoPagoFallback();
      MainController.mostrarAlerta(
        'No se pudieron cargar los métodos de pago. Se dejó efectivo como opción temporal.',
        'warning',
        'checkout-alert-container'
      );
      console.warn(error);
    }
  },

  async enviarOrden(event) {
    event.preventDefault();
    const button = event.submitter || document.querySelector('#formCheckout button[type="submit"]');

    if (TotalService.estaVacio()) {
      MainController.mostrarAlerta('No hay productos para enviar.', 'warning', 'checkout-alert-container');
      return;
    }

    if (!MainController.estaAutenticado()) {
      MainController.mostrarAlerta('Debes iniciar sesión para enviar tu pedido. Redirigiendo al login...', 'warning', 'checkout-alert-container');
      setTimeout(() => window.location.href = '/admin/public/login.php', 1200);
      return;
    }

    const paymentMethodId = document.getElementById('paymentMethod')?.value;
    if (!paymentMethodId) {
      MainController.mostrarAlerta('Selecciona un método de pago.', 'warning', 'checkout-alert-container');
      return;
    }

    MainController.setButtonLoading(button, true, 'Enviando pedido...');

    try {
      const data = await TotalDataService.enviarOrden(paymentMethodId, TotalService.detallesOrden());
      let orden = data.orden || data.order || data.data || (data.id ? data : null);

      if (!orden) {
        orden = await TotalDataService.cargarUltimoPedido();
      }

      TotalService.guardarUltimoPedido(orden);
      TotalService.limpiarCarrito();
      TotalUIRenderer.renderResumen();
      TotalUIRenderer.renderUltimoPedido(orden);
      MainController.mostrarAlerta(data.mensaje || 'Tu orden fue procesada correctamente.', 'success', 'checkout-alert-container');
      MainController.setButtonLoading(button, false);
    } catch (error) {
      MainController.mostrarAlerta(error.message || 'No se pudo procesar la orden.', 'danger', 'checkout-alert-container');
      MainController.setButtonLoading(button, false);
    }
  },

  descargarPDF() {
    const element = document.getElementById('tabla');

    if (!element || TotalService.estaVacio()) {
      MainController.mostrarAlerta('No hay productos para generar el recibo.', 'warning', 'checkout-alert-container');
      return;
    }

    const opt = {
      margin: 0.5,
      filename: 'xilotepec-recibo.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  },

  enviarComentario(event) {
    event.preventDefault();
    const textArea = document.getElementById('floatingTextarea');
    const button = event.submitter || document.getElementById('btnComentarios');

    if (!textArea?.value.trim()) {
      MainController.mostrarAlerta('No puedes dejar el comentario vacío.', 'danger', 'comments-alert-container');
      return;
    }

    MainController.setButtonLoading(button, true, 'Enviando...');

    setTimeout(() => {
      MainController.mostrarAlerta('¡Comentario enviado! Muchas gracias, lo apreciamos mucho.', 'success', 'comments-alert-container');
      textArea.disabled = true;
      MainController.setButtonLoading(button, false);
      button.disabled = true;
    }, 500);
  }
};

window.TotalController = TotalController;
document.addEventListener('DOMContentLoaded', () => {
  MainController.init();
  TotalController.init();
});
