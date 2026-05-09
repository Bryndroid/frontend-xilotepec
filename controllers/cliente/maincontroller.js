import { cookieHandler } from "../../helpers/getCookie.js";

export const MainController = {
  cookieName: 'jwt_token',
  apiUrl: 'http://localhost:8000/api',

  init: () => {
    MainController.actualizarMenuSesion();
    document.getElementById('btn-logout')?.addEventListener('click', MainController.logout);
  },

  obtenerToken: () => {
    const match = cookieHandler.getCookie(MainController.cookieName);
    return match;
  },

  guardarToken: (token) => {
    const maxAge = 60 * 60 * 8;
    document.cookie = `${MainController.cookieName}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },

  eliminarToken: () => {
    document.cookie = `${MainController.cookieName}=; path=/; max-age=0; SameSite=Lax`;
  },

  estaAutenticado: () => Boolean(MainController.obtenerToken()),

  authHeaders: () => {
    const token = MainController.obtenerToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  actualizarMenuSesion: () => {
    const loginLink = document.getElementById('nav-login-link');
    const logoutBtn = document.getElementById('btn-logout');
    const pedidoLink = document.getElementById('nav-pedido-link');

    if (MainController.estaAutenticado()) {
      loginLink?.classList.add('d-none');
      logoutBtn?.classList.remove('d-none');
      pedidoLink?.classList.remove('d-none');
    } else {
      loginLink?.classList.remove('d-none');
      logoutBtn?.classList.add('d-none');
      pedidoLink?.classList.add('d-none');
    }
  },

  logout: async (event) => {
    event?.preventDefault();
    const token = MainController.obtenerToken();

    try {
      if (token) {
        await fetch(`${MainController.apiUrl}/logout`, {
          method: 'GET',
          headers: MainController.authHeaders()
        });
      }
    } catch (error) {
      console.warn('No se pudo cerrar sesión en la API. Se limpiará la cookie local.', error);
    } finally {
      MainController.eliminarToken();
      localStorage.removeItem('xilotepec_cart');
      window.location.href = '../../public/login.php?logout=1';
    }
  },

  mostrarAlerta: (mensaje, tipo = 'success', contenedorId = 'global-alert-container') => {
    let contenedor = document.getElementById(contenedorId) || document.getElementById('global-alert-container');

    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = contenedorId;
      contenedor.className = 'container mt-3';
      document.body.prepend(contenedor);
    }

    contenedor.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
        <div class="d-flex align-items-start gap-2">
          <i class="bi ${MainController.iconoAlerta(tipo)} fs-5"></i>
          <div class="flex-grow-1">${mensaje}</div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
      </div>`;

    setTimeout(() => {
      contenedor.innerHTML = '';
    }, 4500);
  },

  iconoAlerta: (tipo) => {
    const iconos = {
      success: 'bi-check-circle-fill',
      danger: 'bi-exclamation-triangle-fill',
      warning: 'bi-exclamation-circle-fill',
      info: 'bi-info-circle-fill'
    };
    return iconos[tipo] || iconos.info;
  },

  setButtonLoading: (button, loading, loadingText = 'Cargando...') => {
    if (!button) return;

    if (loading) {
      button.dataset.originalHtml = button.innerHTML;
      button.disabled = true;
      button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>${loadingText}`;
      return;
    }

    button.disabled = false;
    if (button.dataset.originalHtml) button.innerHTML = button.dataset.originalHtml;
  },

  renderPlaceholderCards: (container, cantidad = 4) => {
    if (!container) return;

    container.innerHTML = Array.from({ length: cantidad }).map(() => `
      <article class="product-card placeholder-card" aria-hidden="true">
        <div class="placeholder-glow">
          <span class="placeholder placeholder-img col-12"></span>
        </div>
        <div class="product-info">
          <h4 class="placeholder-glow"><span class="placeholder col-8"></span></h4>
          <p class="placeholder-glow mb-0"><span class="placeholder col-12"></span></p>
          <p class="placeholder-glow mb-0"><span class="placeholder col-9"></span></p>
          <span class="placeholder-glow"><span class="placeholder col-4"></span></span>
          <span class="placeholder-glow"><span class="placeholder rounded-pill col-10 py-3"></span></span>
        </div>
      </article>`).join('');
  }
};

window.MainController = MainController;
document.addEventListener('DOMContentLoaded', MainController.init);
