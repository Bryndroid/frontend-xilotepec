import { MenuModel } from "../../models/Product.js";
import { CategoriasModel } from "../../models/Categories.js";
import { MainController } from "./maincontroller.js";

// ====== CAPA DE DATOS ======
// Accede a los modelos y gestiona la lógica de datos
const CartDataService = {
  async cargarProductos() {
    try {
      const productos = await MenuModel.obtenerProductosActivos();
      return Array.isArray(productos) ? productos : [];
    } catch (error) {
      console.error("Error al cargar productos:", error);
      throw error;
    }
  },
};

// ====== CAPA DE NEGOCIO ======
// Gestiona la lógica del carrito (agregar, eliminar, modificar cantidad)
const CartService = {
  carrito: JSON.parse(localStorage.getItem("xilotepec_cart")) || [],

  obtenerMaximoProducto(producto) {
    const maximo = Number(
      producto.max_quantity ??
        producto.cantidad ??
        producto.stock ??
        producto.quantity_available ??
        producto.available_quantity ??
        0,
    );

    return Number.isFinite(maximo) ? maximo : 0;
  },

  agregarItem(producto) {
    const maxQuantity = this.obtenerMaximoProducto(producto);

    if (maxQuantity <= 0) {
      return {
        ok: false,
        mensaje: `El producto ${producto.name || "seleccionado"} no tiene existencias disponibles.`,
      };
    }

    const item = this.carrito.find((i) => String(i.id) === String(producto.id));

    if (item) {
      item.maxQuantity = maxQuantity;

      if (Number(item.quantity) >= maxQuantity) {
        return {
          ok: false,
          mensaje: `No puedes agregar más de ${maxQuantity} unidad(es) de ${item.name}.`,
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
      maxQuantity,
    };

    this.carrito.push(nuevoItem);
    this.guardar();
    return { ok: true, item: nuevoItem };
  },

  modificarCantidad(id, delta) {
    const item = this.carrito.find((i) => String(i.id) === String(id));
    if (!item) {
      return {
        ok: false,
        mensaje: "No se encontró el producto en el carrito.",
      };
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
        mensaje: `No puedes agregar más de ${maxQuantity} unidad(es) de ${item.name}.`,
      };
    }

    item.quantity = nuevaCantidad;
    this.guardar();
    return { ok: true, item };
  },

  eliminarItem(id) {
    this.carrito = this.carrito.filter((i) => String(i.id) !== String(id));
    this.guardar();
  },

  limpiar() {
    this.carrito = [];
    this.guardar();
  },

  obtenerTotal() {
    return this.carrito.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
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
    localStorage.setItem("xilotepec_cart", JSON.stringify(this.carrito));
  },

  obtenerImagenProducto(producto) {
    const img =
      producto.url_image || producto.image_url || producto.imagen || "";
    if (img) return img;

    const categoriaLower =
      `${producto.category?.name || producto.categoria || producto.category_name || ""}`.toLowerCase();
    if (["caliente", "hot"].some((t) => categoriaLower.includes(t)))
      return "../../public/img/bebidacaliente.jpg";
    if (
      ["fría", "fria", "cold", "helada"].some((t) => categoriaLower.includes(t))
    )
      return "../../public/img/bebidafria.jpg";
    return "../../public/img/postre.jpg";
  },
};

// ====== CAPA DE PRESENTACIÓN ======
// Renderiza los elementos en el DOM
const CartUIRenderer = {
  getCategoriaImagen(nombre) {
    const nombreLower = String(nombre || "").toLowerCase();
    if (["caliente", "hot"].some((t) => nombreLower.includes(t)))
      return "../../public/img/bebidacaliente.jpg";
    if (["fría", "fria", "cold", "helada"].some((t) => nombreLower.includes(t)))
      return "../../public/img/bebidafria.jpg";
    return "../../public/img/postre.jpg";
  },

  getContainerIds(categorias) {
    if (Array.isArray(categorias) && categorias.length) {
      return categorias.map(
        (categoria) =>
          `categoriaContainer-${
            categoria.id ??
            String(categoria.name || "")
              .toLowerCase()
              .replace(/\s+/g, "-")
          }`,
      );
    }

    return ["calientesContainer", "friasContainer", "postresContainer"];
  },

  renderCategorias(categorias) {
    const menu = document.getElementById("categorias-menu");
    const modalsContainer = document.getElementById("categoriaModalsContainer");
    if (!menu || !modalsContainer) return;

    const categoriasList =
      Array.isArray(categorias) && categorias.length
        ? categorias
        : [
            {
              id: "calientes",
              name: "Bebidas Calientes",
              image: "../../public/img/bebidacaliente.jpg",
            },
            {
              id: "frias",
              name: "Bebidas Frías",
              image: "../../public/img/bebidafria.jpg",
            },
            {
              id: "postres",
              name: "Postres",
              image: "../../public/img/postre.jpg",
            },
          ];

    menu.innerHTML = categoriasList
      .map((categoria) => {
        const modalId = `categoriaModal-${
          categoria.id ??
          String(categoria.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
        }`;
        return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
          <button type="button" class="btn btn-link p-0 w-100 h-100 category-card open-custom-modal text-start" data-target="${modalId}">
            <img src="${categoria.url_image || this.getCategoriaImagen(categoria.name)}" alt="${categoria.name || "Categoría"}" class="card-img" />
            <div class="card-img-overlay d-flex align-items-center justify-content-center p-0">
              <div class="category-card-text text-center px-3 py-2">
                <h5 class="card-title mb-0">${categoria.name || "Categoría"}</h5>
              </div>
            </div>
          </button>
        </div>`;
      })
      .join("");

    modalsContainer.innerHTML = categoriasList
      .map((categoria) => {
        const modalId = `categoriaModal-${
          categoria.id ??
          String(categoria.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
        }`;
        const containerId = `categoriaContainer-${
          categoria.id ??
          String(categoria.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
        }`;
        return `
        <div id="${modalId}" class="custom-modal">
          <div class="custom-modal-header">
            <h3>${categoria.name || "Categoría"}</h3>
            <button class="close-modal">&times;</button>
          </div>
          <div class="custom-modal-body">
            <div class="products-grid" id="${containerId}"></div>
          </div>
        </div>`;
      })
      .join("");
  },

  renderPlaceholders(categorias) {
    this.getContainerIds(categorias).forEach((id) => {
      MainController.renderPlaceholderCards(document.getElementById(id), 3);
    });
  },

  renderError(categorias) {
    this.getContainerIds(categorias).forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;
      container.innerHTML = `
        <div class="alert alert-warning mb-0" role="alert">
          <i class="bi bi-wifi-off me-2"></i>
          No se pudo cargar esta sección del menú. Intenta nuevamente más tarde.
        </div>`;
    });
  },

  renderProductos(productos, categorias) {
    const containerIds = this.getContainerIds(categorias);
    const grupos = this.agruparProductosPorCategoria(productos, categorias);

    containerIds.forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;

      const items = grupos[id] || [];
      if (items.length === 0) {
        container.innerHTML =
          '<div class="empty-state">No hay productos disponibles en esta categoría.</div>';
      } else {
        container.innerHTML = items.map((p) => this.productCard(p)).join("");
      }
    });

    this.registrarEventosProductos();
  },

  agruparProductosPorCategoria(productos, categorias) {
    const grupos = {};
    const containerIds = this.getContainerIds(categorias);
    containerIds.forEach((id) => {
      grupos[id] = [];
    });

    if (Array.isArray(categorias) && categorias.length) {
      const categoriasNormalizadas = categorias.map((cat) => ({
        id: cat.id || "",
        name: cat.name || "",
        raw: cat,
      }));

      productos.forEach((producto) => {
        const productCatId =
          producto.category?.id ??
          producto.category_id ??
          producto.categoryId ??
          "";
        const productCatName =
          producto.category?.name ??
          producto.category_name ??
          producto.categoria ??
          "";

        const matched = categoriasNormalizadas.find(
          (cat) =>
            (cat.id && cat.id == productCatId) ||
            (cat.name && cat.name == productCatName) ||
            (cat.name && productCatName.includes(cat.name)) ||
            (cat.name && cat.name.includes(productCatName)),
        );

        if (matched) {
          grupos[
            `categoriaContainer-${matched.raw.id ?? matched.raw.name.toLowerCase().replace(/\s+/g, "-")}`
          ]?.push(producto);
          return;
        }

        const fallback = this.obtenerContenedorFallback(producto, categorias);
        if (fallback) grupos[fallback].push(producto);
      });

      return grupos;
    }

    grupos.calientesContainer = productos.filter((p) =>
      this.esCategoria(p, ["caliente", "hot"]),
    );
    grupos.friasContainer = productos.filter((p) =>
      this.esCategoria(p, ["fría", "fria", "cold", "helada"]),
    );
    grupos.postresContainer = productos.filter((p) =>
      this.esCategoria(p, ["postre", "dessert"]),
    );

    const yaAgrupados = new Set(
      [
        ...grupos.calientesContainer,
        ...grupos.friasContainer,
        ...grupos.postresContainer,
      ].map((p) => p.id),
    );

    const sinGrupo = productos.filter((p) => !yaAgrupados.has(p.id));
    grupos.postresContainer = [...grupos.postresContainer, ...sinGrupo];

    return grupos;
  },

  obtenerContenedorFallback(producto, categorias) {
    const categoria = String(
      producto.category?.name ??
        producto.category_name ??
        producto.categoria ??
        "",
    ).toLowerCase();
    const ids = this.getContainerIds(categorias);
    if (!ids.length) return null;

    if (["caliente", "hot"].some((t) => categoria.includes(t))) return ids[0];
    if (["fría", "fria", "cold", "helada"].some((t) => categoria.includes(t)))
      return ids[1] || ids[0];
    if (["postre", "dessert"].some((t) => categoria.includes(t)))
      return ids[2] || ids[0];
    return ids[0];
  },

  esCategoria(producto, terminos) {
    const categoria =
      `${producto.category?.name || producto.categoria || producto.category_name || ""}`.toLowerCase();
    return terminos.some((t) => categoria.includes(t));
  },

  productCard(producto) {
    const maxQuantity = CartService.obtenerMaximoProducto(producto);
    const sinStock = maxQuantity <= 0;

    return `
      <article class="product-card">
        <img class="product-img" src="${CartService.obtenerImagenProducto(producto)}" alt="${producto.name || "Producto"}" />
        <div class="product-info">
          <h4>${producto.name || "Producto sin nombre"}</h4>
          <p>${producto.description || "Producto disponible en Xilotepec Coffee Shop."}</p>
          <span class="product-price">$${Number(producto.price || 0).toFixed(2)}</span>
          <small class="text-muted">Disponibles: ${maxQuantity}</small>
          <button class="add-cart-btn" data-id="${producto.id}" ${sinStock ? "disabled" : ""}>
            ${sinStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </article>`;
  },

  renderCarrito() {
    const lista = document.getElementById("carritoItems");
    const totalSpan = document.getElementById("cartTotal");
    const badge = document.getElementById("cartBadge");

    if (!lista || !totalSpan) return;

    const carrito = CartService.obtenerCarrito();

    if (carrito.length === 0) {
      lista.innerHTML = '<li class="empty-state">Tu carrito está vacío.</li>';
    } else {
      lista.innerHTML = carrito.map((item) => this.cartItemHTML(item)).join("");
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
          <small class="text-muted">Máximo disponible: ${item.maxQuantity || "N/D"}</small>
          <div class="qty-controls">
            <button onclick="CartController.cambiarCantidad('${item.id}', -1)">−</button>
            <strong>${item.quantity}</strong>
            <button onclick="CartController.cambiarCantidad('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="CartController.eliminarItem('${item.id}')"><i class="bi bi-trash"></i></button>
      </li>`;
  },

  registrarEventosProductos() {
    document.querySelectorAll(".add-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        CartController.agregarAlCarrito(btn.dataset.id),
      );
    });
  },
};

// ====== CONTROLADOR ======
// Orquesta la interacción entre servicios, datos y vistas
const CartController = {
  productos: [],
  categorias: [],

  async init() {
    await this.cargarCategorias();
    CartUIRenderer.renderPlaceholders(this.categorias);
    CartUIRenderer.renderCarrito();
    this.registrarEventosUI();

    try {
      this.productos = await CartDataService.cargarProductos();
      CartUIRenderer.renderProductos(this.productos, this.categorias);
    } catch (error) {
      console.error(error);
      CartUIRenderer.renderError(this.categorias);
      MainController.mostrarAlerta(
        "No se pudieron cargar los productos desde la API. Verifica que el servidor Laravel esté activo.",
        "danger",
        "menu-alert-container",
      );
    }
  },

  async cargarCategorias() {
    try {
      const categoriasResp = await CategoriasModel.obtenerCategorias();
      this.categorias = Array.isArray(categoriasResp)
        ? categoriasResp
        : (categoriasResp.data ?? []);
    } catch (error) {
      console.warn("No se pudieron cargar las categorías:", error);
      this.categorias = [];
    }

    CartUIRenderer.renderCategorias(this.categorias);
  },

  registrarEventosUI() {
    const overlay = document.getElementById("general-overlay");

    document
      .getElementById("cartToggleBtn")
      ?.addEventListener("click", () => this.abrirCarrito());
    document
      .getElementById("cerrarCarrito")
      ?.addEventListener("click", () => this.cerrarTodo());
    document
      .getElementById("limpiarBtn")
      ?.addEventListener("click", () => this.limpiarCarrito());
    document
      .getElementById("finalizarCompraBtn")
      ?.addEventListener("click", () => this.finalizarCompra());

    document.querySelectorAll(".open-custom-modal").forEach((btn) => {
      btn.addEventListener("click", () => this.abrirModal(btn.dataset.target));
    });

    document.querySelectorAll(".close-modal").forEach((btn) => {
      btn.addEventListener("click", () => this.cerrarTodo());
    });

    overlay?.addEventListener("click", () => this.cerrarTodo());
  },

  abrirModal(id) {
    this.cerrarTodo(false);
    document.getElementById("general-overlay")?.classList.add("active");
    document.getElementById(id)?.classList.add("active");
  },

  abrirCarrito() {
    document.getElementById("general-overlay")?.classList.add("active");
    document.getElementById("shopping-cart")?.classList.add("active");
  },

  cerrarTodo(overlay = true) {
    document
      .querySelectorAll(".custom-modal")
      .forEach((m) => m.classList.remove("active"));
    document.getElementById("shopping-cart")?.classList.remove("active");
    if (overlay)
      document.getElementById("general-overlay")?.classList.remove("active");
  },

  agregarAlCarrito(id) {
    const producto = this.productos.find((p) => String(p.id) === String(id));
    if (!producto) {
      MainController.mostrarAlerta(
        "No se encontró el producto seleccionado.",
        "warning",
        "menu-alert-container",
      );
      return;
    }

    const button = document.querySelector(`.add-cart-btn[data-id="${id}"]`);
    MainController.setButtonLoading(button, true, "Agregando...");

    const resultado = CartService.agregarItem(producto);
    CartUIRenderer.renderCarrito();
    MainController.setButtonLoading(button, false);

    if (!resultado.ok) {
      MainController.mostrarAlerta(
        resultado.mensaje,
        "warning",
        "menu-alert-container",
      );
      return;
    }

    MainController.mostrarAlerta(
      `<strong>${producto.name || "Producto"}</strong> fue agregado al carrito.`,
      "success",
      "menu-alert-container",
    );
  },

  cambiarCantidad(id, delta) {
    const resultado = CartService.modificarCantidad(id, delta);
    CartUIRenderer.renderCarrito();

    if (resultado && !resultado.ok) {
      MainController.mostrarAlerta(
        resultado.mensaje,
        "warning",
        "menu-alert-container",
      );
      return;
    }

    if (resultado?.eliminado) {
      MainController.mostrarAlerta(
        "Producto eliminado del carrito.",
        "info",
        "menu-alert-container",
      );
    }
  },

  eliminarItem(id) {
    CartService.eliminarItem(id);
    CartUIRenderer.renderCarrito();
    MainController.mostrarAlerta(
      "Producto eliminado del carrito.",
      "info",
      "menu-alert-container",
    );
  },

  limpiarCarrito() {
    if (CartService.estaVacio()) {
      MainController.mostrarAlerta(
        "El carrito ya está vacío.",
        "info",
        "menu-alert-container",
      );
      return;
    }

    CartService.limpiar();
    CartUIRenderer.renderCarrito();
    MainController.mostrarAlerta(
      "El carrito fue limpiado correctamente.",
      "success",
      "menu-alert-container",
    );
  },

  finalizarCompra() {
    if (CartService.estaVacio()) {
      MainController.mostrarAlerta(
        "Agrega productos antes de finalizar la compra.",
        "warning",
        "menu-alert-container",
      );
      return;
    }
    window.location.href = "total.php";
  },
};

window.CartController = CartController;
document.addEventListener("DOMContentLoaded", () => {
  MainController.init();
  CartController.init();
});
