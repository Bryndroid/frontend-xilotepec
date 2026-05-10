import { PromocionesModel } from '../../models/Promocion.js';
import { MainController } from './maincontroller.js';

// ====== CAPA DE DATOS ======
const HomeDataService = {
  async cargarPromociones() {
    try {
      const respuesta = await PromocionesModel.obtenerPromocionesActivas();
      const promociones = Array.isArray(respuesta)
        ? respuesta
        : Array.isArray(respuesta.data)
          ? respuesta.data
          : [];

      return promociones.filter((promo) =>
        promo.is_active === true ||
        promo.is_active === 1 ||
        promo.is_active === 'true' ||
        promo.is_active === '1'
      );
    } catch (error) {
      console.error('Error al cargar promociones:', error);
      throw error;
    }
  }
};

// ====== CAPA DE PRESENTACIÓN ======
const HomeUIRenderer = {
  renderPromocionesPlaceholder() {
    const container = document.getElementById('promociones-dinamicas');
    const estaticas = document.getElementById('promociones-estaticas');
    if (!container) return;

    estaticas?.classList.add('d-none');
    container.innerHTML = Array.from({ length: 3 }).map(() => `
      <article class="promo-card placeholder-card" aria-hidden="true">
        <div class="placeholder-glow"><span class="placeholder placeholder-img col-12"></span></div>
        <div class="promo-card-body">
          <h3 class="placeholder-glow"><span class="placeholder col-8"></span></h3>
          <p class="placeholder-glow mb-2"><span class="placeholder col-12"></span></p>
          <p class="placeholder-glow mb-0"><span class="placeholder col-7"></span></p>
        </div>
      </article>`).join('');
  },

  restaurarPromocionesEstaticas() {
    const dinamicas = document.getElementById('promociones-dinamicas');
    if (dinamicas) dinamicas.innerHTML = '';
    document.getElementById('promociones-estaticas')?.classList.remove('d-none');
  },

  renderPromociones(promociones) {
    const container = document.getElementById('promociones-dinamicas');
    const estaticas = document.getElementById('promociones-estaticas');

    if (!container || !Array.isArray(promociones) || promociones.length === 0) {
      HomeUIRenderer.restaurarPromocionesEstaticas();
      return;
    }

    estaticas?.classList.add('d-none');
    container.innerHTML = promociones.map((promo) => `
      <article class="promo-card">
        <img src="${promo.image_url || promo.url_image || 'img/6.jpg'}" alt="${promo.name || 'Promoción'}" />
        <div class="promo-card-body">
          <h3>${promo.name || 'Promoción Xilotepec'}</h3>
          <p class="text-muted mb-2">${promo.description || promo.type || 'Promoción especial disponible en Xilotepec Coffee Shop.'}</p>
          <small class="text-muted">${promo.start_date ? `Del ${promo.start_date}` : ''} ${promo.end_date ? `al ${promo.end_date}` : ''}</small>
        </div>
      </article>`).join('');
  }
};

// ====== CONTROLADOR ======
const HomeController = {
  promociones: [],

  async init() {
    HomeUIRenderer.renderPromocionesPlaceholder();

    try {
      HomeController.promociones = await HomeDataService.cargarPromociones();
      HomeUIRenderer.renderPromociones(HomeController.promociones);
    } catch (error) {
      console.warn('No se pudieron cargar promociones dinámicas. Se mantienen las imágenes originales.', error);
      HomeUIRenderer.restaurarPromocionesEstaticas();
      MainController.mostrarAlerta(
        'No se pudieron cargar las promociones actualizadas. Se muestran las promociones locales.',
        'warning',
        'home-alert-container'
      );
    }
  }
};

window.HomeController = HomeController;
document.addEventListener('DOMContentLoaded', () => {
  MainController.init();
  HomeController.init();
});
