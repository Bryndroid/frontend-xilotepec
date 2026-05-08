import { MenuModel } from '../../models/Product.js';
import { MainController } from './maincontroller.js';

// ====== CAPA DE DATOS ======
// Accede a los modelos y gestiona la lógica de datos
const CartDataService = {
  async cargarProductos() {
    try {
      const productos = await MenuModel.obtenerProductosActivos();
      return Array.isArray(productos) ? productos : [];
    } catch (error) {
      console.error('Error al cargar productos:', error);
      throw error;
    }
  }
};

// ====== CAPA DE NEGOCIO ======
// Gestiona la lógica del carrito (agregar, eliminar, modificar cantidad)
const CartService = {
  carrito: JSON.parse(localStorage.getItem('xilotepec_cart')) || [],

  obtenerMaximoProducto(producto) {
    const maximo = Number(
      producto.max_quantity ??
      producto.cantidad ??
      producto.stock ??
      producto.quantity_available ??
      producto.available_quantity ??
      0
    );

    return Number.isFinite(maximo) ? maximo : 0;
  },

  agregarItem(producto) {
    const maxQuantity = this.obtenerMaximoProducto(producto);

    if (maxQuantity <= 0) {
      return {
        ok: false,
        mensaje: `El producto ${producto.name || 'seleccionado'} no tiene existencias disponibles.`
      };
    }

    const item = this.carrito.find(i => String(i.id) === String(producto.id));

    if (item) {
      item.maxQuantity = maxQuantity;

      if (Number(item.quantity) >= maxQuantity) {
        return {
          ok: false,
          mensaje: `No puedes agregar más de ${maxQuantity} unidad(es) de ${item.name}.`
        };
      }

      item.quantity += 1;
      this.guardar();
      return { ok: true, item };
    }

    const nuevoItem = {
      id: producto.id,
      name: producto.name,
      price: Number(producto.price || 0),
      image: CartService.obtenerImagenProducto(producto),
      quantity: 1,
      maxQuantity
    };

    this.carrito.push(nuevoItem);
    this.guardar();
    return { ok: true, item: nuevoItem };
  },

  modificarCantidad(id, delta) {
    const item = this.carrito.find(i => String(i.id) === String(id));
    if (!item) {
      return { ok: false, mensaje: 'No se encontró el producto en el carrito.' };
    }

    const nuevaCantidad = Number(item.quantity) + Number(delta);
    const maxQuantity = Number(item.maxQuantity || 0);

    if (nuevaCantidad <= 0) {
      this.eliminarItem(id);
      return { ok: true, eliminado: true };
    }

    if (maxQuantity > 0 && nuevaCantidad > maxQuantity) {
      return {
        ok: false,
        mensaje: `No puedes agregar más de ${maxQuantity} unidad(es) de ${item.name}.`
      };
    }

    item.quantity = nuevaCantidad;
    this.guardar();
    return { ok: true, item };
  },

  eliminarItem(id) {
    this.carrito = this.carrito.filter(i => String(i.id) !== String(id));
    this.guardar();
  },

  limpiar() {
    this.carrito = [];
    this.guardar();
  },

  obtenerTotal() {
    return this.carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  obtenerCantidadTotal() {
    return this.carrito.reduce((acc, item) => acc + item.quantity, 0);
  },

  obtenerCarrito() {
    return this.carrito;
  },

  estaVacio() {
    return this.carrito.length === 0;
  },

  guardar() {
    localStorage.setItem('xilotepec_cart', JSON.stringify(this.carrito));
  },

  obtenerImagenProducto(producto) {
    const img = producto.url_image || producto.image_url || producto.imagen || '';
    if (img) return img;

    const categoriaLower = `${producto.category?.name || producto.categoria || producto.category_name || ''}`.toLowerCase();
    if (['caliente', 'hot'].some(t => categoriaLower.includes(t))) return '../../public/img/bebidacaliente.jpg';
    if (['fría', 'fria', 'cold', 'helada'].some(t => categoriaLower.includes(t))) return '../../public/img/bebidafria.jpg';
    return '../../public/img/postre.jpg';
  }
};

// ====== CAPA DE PRESENTACIÓN ======
// Renderiza los elementos en el DOM
const CartUIRenderer = {
  renderProductos(productos) {
    const grupos = this.agruparProductosPorCategoria(productos);

    Object.entries(grupos).forEach(([containerId, items]) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (items.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay productos disponibles en esta categoría.</div>';
      } else {
        container.innerHTML = items.map(p => this.productCard(p)).join('');
      }
    });

    this.registrarEventosProductos();
  },

  agruparProductosPorCategoria(productos) {
    const grupos = {
      calientesContainer: productos.filter(p => this.esCategoria(p, ['caliente', 'hot'])),
      friasContainer: productos.filter(p => this.esCategoria(p, ['fría', 'fria', 'cold', 'helada'])),
      postresContainer: productos.filter(p => this.esCategoria(p, ['postre', 'dessert']))
    };

    const yaAgrupados = new Set(
      [...grupos.calientesContainer, ...grupos.friasContainer, ...grupos.postresContainer]
        .map(p => p.id)
    );
    const sinGrupo = productos.filter(p => !yaAgrupados.has(p.id));
    grupos.postresContainer = [...grupos.postresContainer, ...sinGrupo];

    return grupos;
  },

  esCategoria(producto, terminos) {
    const categoria = `${producto.category?.name || producto.categoria || producto.category_name || ''}`.toLowerCase();
    return terminos.some(t => categoria.includes(t));
  },

  productCard(producto) {
    const maxQuantity = CartService.obtenerMaximoProducto(producto);
    const sinStock = maxQuantity <= 0;

    return `
      <article class="product-card">
        <img class="product-img" src="${CartService.obtenerImagenProducto(producto)}" alt="${producto.name || 'Producto'}" />
        <div class="product-info">
          <h4>${producto.name || 'Producto sin nombre'}</h4>
          <p>${producto.description || 'Producto disponible en Xilotepec Coffee Shop.'}</p>
          <span class="product-price">$${Number(producto.price || 0).toFixed(2)}</span>
          <small class="text-muted">Disponibles: ${maxQuantity}</small>
          <button class="add-cart-btn" data-id="${producto.id}" ${sinStock ? 'disabled' : ''}>
            ${sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </article>`;
  },

  renderCarrito() {
    const lista = document.getElementById('carritoItems');
    const totalSpan = document.getElementById('cartTotal');
    const badge = document.getElementById('cartBadge');

    if (!lista || !totalSpan) return;

    const carrito = CartService.obtenerCarrito();

    if (carrito.length === 0) {
      lista.innerHTML = '<li class="empty-state">Tu carrito está vacío.</li>';
    } else {
      lista.innerHTML = carrito
        .map(item => this.cartItemHTML(item))
        .join('');
    }

    totalSpan.textContent = CartService.obtenerTotal().toFixed(2);
    if (badge) badge.textContent = CartService.obtenerCantidadTotal();
  },

  cartItemHTML(item) {
    return `
      <li class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p>$${Number(item.price).toFixed(2)} c/u</p>
          <small class="text-muted">Máximo disponible: ${item.maxQuantity || 'N/D'}</small>
          <div class="qty-controls">
            <button onclick="CartController.cambiarCantidad('${item.id}', -1)">−</button>
            <strong>${item.quantity}</strong>
            <button onclick="CartController.cambiarCantidad('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="CartController.eliminarItem('${item.id}')"><i class="bi bi-trash"></i></button>
      </li>`;
  },

  renderPlaceholders() {
    ['calientesContainer', 'friasContainer', 'postresContainer'].forEach(id => {
      MainController.renderPlaceholderCards(document.getElementById(id), 3);
    });
  },

  renderError() {
    ['calientesContainer', 'friasContainer', 'postresContainer'].forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      container.innerHTML = `
        <div class="alert alert-warning mb-0" role="alert">
          <i class="bi bi-wifi-off me-2"></i>
          No se pudo cargar esta sección del menú. Intenta nuevamente más tarde.
        </div>`;
    });
  },

  registrarEventosProductos() {
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => CartController.agregarAlCarrito(btn.dataset.id));
    });
  }
};

// ====== CONTROLADOR ======
// Orquesta la interacción entre servicios, datos y vistas
const CartController = {
  productos: [],

  async init() {
    this.registrarEventosUI();
    CartUIRenderer.renderPlaceholders();
    CartUIRenderer.renderCarrito();

    try {
      this.productos = await CartDataService.cargarProductos();
      CartUIRenderer.renderProductos(this.productos);
    } catch (error) {
      console.error(error);
      CartUIRenderer.renderError();
      MainController.mostrarAlerta(
        'No se pudieron cargar los productos desde la API. Verifica que el servidor Laravel esté activo.',
        'danger',
        'menu-alert-container'
      );
    }
  },

  registrarEventosUI() {
    const overlay = document.getElementById('general-overlay');

    document.getElementById('cartToggleBtn')?.addEventListener('click', () => this.abrirCarrito());
    document.getElementById('cerrarCarrito')?.addEventListener('click', () => this.cerrarTodo());
    document.getElementById('limpiarBtn')?.addEventListener('click', () => this.limpiarCarrito());
    document.getElementById('finalizarCompraBtn')?.addEventListener('click', () => this.finalizarCompra());

    document.querySelectorAll('.open-custom-modal').forEach(btn => {
      btn.addEventListener('click', () => this.abrirModal(btn.dataset.target));
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.cerrarTodo());
    });

    overlay?.addEventListener('click', () => this.cerrarTodo());
  },

  abrirModal(id) {
    this.cerrarTodo(false);
    document.getElementById('general-overlay')?.classList.add('active');
    document.getElementById(id)?.classList.add('active');
  },

  abrirCarrito() {
    document.getElementById('general-overlay')?.classList.add('active');
    document.getElementById('shopping-cart')?.classList.add('active');
  },

  cerrarTodo(overlay = true) {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('active'));
    document.getElementById('shopping-cart')?.classList.remove('active');
    if (overlay) document.getElementById('general-overlay')?.classList.remove('active');
  },

  agregarAlCarrito(id) {
    const producto = this.productos.find(p => String(p.id) === String(id));
    if (!producto) {
      MainController.mostrarAlerta('No se encontró el producto seleccionado.', 'warning', 'menu-alert-container');
      return;
    }

    const button = document.querySelector(`.add-cart-btn[data-id="${id}"]`);
    MainController.setButtonLoading(button, true, 'Agregando...');

    const resultado = CartService.agregarItem(producto);
    CartUIRenderer.renderCarrito();
    MainController.setButtonLoading(button, false);

    if (!resultado.ok) {
      MainController.mostrarAlerta(resultado.mensaje, 'warning', 'menu-alert-container');
      return;
    }

    MainController.mostrarAlerta(
      `<strong>${producto.name || 'Producto'}</strong> fue agregado al carrito.`,
      'success',
      'menu-alert-container'
    );
  },

  cambiarCantidad(id, delta) {
    const resultado = CartService.modificarCantidad(id, delta);
    CartUIRenderer.renderCarrito();

    if (resultado && !resultado.ok) {
      MainController.mostrarAlerta(resultado.mensaje, 'warning', 'menu-alert-container');
      return;
    }

    if (resultado?.eliminado) {
      MainController.mostrarAlerta('Producto eliminado del carrito.', 'info', 'menu-alert-container');
    }
  },

  eliminarItem(id) {
    CartService.eliminarItem(id);
    CartUIRenderer.renderCarrito();
    MainController.mostrarAlerta('Producto eliminado del carrito.', 'info', 'menu-alert-container');
  },

  limpiarCarrito() {
    if (CartService.estaVacio()) {
      MainController.mostrarAlerta('El carrito ya está vacío.', 'info', 'menu-alert-container');
      return;
    }

    CartService.limpiar();
    CartUIRenderer.renderCarrito();
    MainController.mostrarAlerta('El carrito fue limpiado correctamente.', 'success', 'menu-alert-container');
  },

  finalizarCompra() {
    if (CartService.estaVacio()) {
      MainController.mostrarAlerta('Agrega productos antes de finalizar la compra.', 'warning', 'menu-alert-container');
      return;
    }
    window.location.href = 'total.php';
  }
};

window.CartController = CartController;
document.addEventListener('DOMContentLoaded', () => {
  MainController.init();
  CartController.init();
});
