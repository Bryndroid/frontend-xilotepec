import { PedidosModel } from '../../models/Order.js';
import {MenuModel} from '../../models/Product.js'
import {PromocionesModel} from '../../models/Promocion.js';
import { UsuariosModel } from '../../models/User.js';
import { MainController } from './MainController.js';
import { cookieHandler } from '../../helpers/getCookie.js';
const DashboardController = {
    chartLine: null,
    chartCircle:null,
    init: async () => {
        //para tener la fecha
        const dateEl = document.getElementById('today-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString();
        }
        DashboardController.onLoading();
        try {
            const [
                dashboard,
                orders,
                promociones,
                fiveOrders
            ] = await Promise.all([
                DashboardController.getDashboard(),
                DashboardController.getOrders('today'),
                PromocionesModel.obtenerPromocionesActivas(),
                PedidosModel.obtenerPedidos(5)
            ]);

            if (dashboard.status === false) {
                throw new Error( 'Error al cargar métricas');
            }
            if (orders.status === false) {
                throw new Error('Error al cargar pedidos');
            }
            if (promociones.status === false) {
                throw new Error( 'Error al cargar promociones');
            }
            if (fiveOrders.status === false) {
                throw new Error( 'Error al cargar pedidos recientes');
            }

            DashboardController.loadSummary(dashboard.data.summary);
            DashboardController.initChartLine(orders.data);
            DashboardController.initChartRanking(dashboard.data.categories, 'hoy');
            DashboardController.loadPromotion(promociones.data);
            DashboardController.initTableOrders(fiveOrders.data);

            document.querySelector('#select-date-orders')?.addEventListener('change',async function (e){
                const data = await DashboardController.getOrders(this.value);
                if (data.status === false) {
                    return DashboardController.mostrarModalError(data.message || 'Error al cargar pedidos');
                }
                DashboardController.initChartLine(data.data ?? data);
            })

            document.querySelector('#select-type-barchart')?.addEventListener('change',async function (e){
                if(this.value == 'productos'){
                    DashboardController.initChartRanking(dashboard.data.products, document.querySelector('#select-date-combined').value);
                }else{
                    DashboardController.initChartRanking(dashboard.data.categories, document.querySelector('#select-date-combined').value);
                }
            })
            document.querySelector('#select-date-combined')?.addEventListener('change',async function (e){
                if(document.querySelector('#select-type-barchart').value == 'productos'){
                    DashboardController.initChartRanking(dashboard.data.products, this.value);
                }else{
                    DashboardController.initChartRanking(dashboard.data.categories, this.value);
                }
            })

            document.querySelector('#btn-close-session')?.addEventListener('click', ()=>{
                DashboardController.cerrarSesion();
            });
        } catch (error) {
            DashboardController.mostrarModalError( 'Error al cargar dashboard');
        } finally {
            DashboardController.onStart();
        }

        window.DashboardController = DashboardController;
    },
    initChartLine: (analitycs)=>{
       
        if(DashboardController.chartLine){
            DashboardController.chartLine.destroy();
        }
       
        const month = analitycs.map(l => l.label);
        const revenues = analitycs.map(d => d.revenue);
        const data = {
            labels: month,
            datasets: [
            {
                label: 'Ingresos ($)',
                data: revenues,
                backgroundColor: 'rgba(56, 224, 123, 0.6)',
                borderColor: '#38E07B',
                borderWidth: 2
            }
            ]
        };
        const ctx = document.getElementById('miChart');
        DashboardController.chartLine = new window.Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: 'Ingresos',
                font: {
                size: 18
                },
                color: "white",
            },
            legend: {
                position: 'bottom',
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
            },
            scales: {
            x: {
                title: {
                display: true,
                text: 'Meses'
                }
            },
            y: {
                title: {
                display: true,
                text: 'Monto en dólares ($)'
                },
                beginAtZero: true
            }
            }
        }
        });

      
    },
    initChartRanking: (
        analytics,
        period = 'hoy',
        chartId = 'miChart2',
        label = 'Ventas'
    ) => {

        // Destruir chart anterior
        if (DashboardController.chartCircle) {
            DashboardController.chartCircle.destroy();
        }

        // Ordenar por revenue DESC
        const ordered = [...analytics].sort(
            (a, b) => b.sales[period].revenue - a.sales[period].revenue
        );

        // Labels
        const labels = ordered.map(el => el.name);

        // Data
        const revenues = ordered.map(el => el.sales[period].revenue);

        // Colores negro + verde neon
        const bgColors = [
            'rgba(34, 197, 94, 0.95)',
            'rgba(22, 163, 74, 0.95)',
            'rgba(16, 185, 129, 0.95)',
            'rgba(74, 222, 128, 0.95)',
            'rgba(52, 211, 153, 0.95)',
            'rgba(5, 150, 105, 0.95)',
        ];

        const borderColors = [
            '#4ade80',
            '#22c55e',
            '#10b981',
            '#6ee7b7',
            '#34d399',
            '#059669'
        ];

        const ctx = document.getElementById(chartId);

        DashboardController.chartCircle = new window.Chart(ctx, {

            type: 'bar',

            data: {
                labels: labels,

                datasets: [{
                    label: `${label} (${period})`,
                    data: revenues,

                    backgroundColor: revenues.map(
                        (_, i) => bgColors[i % bgColors.length]
                    ),

                    borderColor: revenues.map(
                        (_, i) => borderColors[i % borderColors.length]
                    ),

                    borderWidth: 2,
                    borderRadius: 14,
                    borderSkipped: false,
                    hoverBackgroundColor: '#4ade80',
                    hoverBorderColor: '#bbf7d0',
                    hoverBorderWidth: 3,
                    barThickness: 28
                }]
            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                indexAxis: 'y',

                animation: {
                    duration: 1400,
                    easing: 'easeOutQuart'
                },

                plugins: {

                    legend: {
                        labels: {
                            color: '#000000',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },

                    tooltip: {
                        backgroundColor: '#000',
                        titleColor: '#4ade80',
                        bodyColor: '#dcfce7',
                        borderColor: '#22c55e',
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 12
                    }
                },

                scales: {

                    x: {

                        beginAtZero: true,

                        ticks: {
                            color: '#080808',
                            font: {
                                weight: 'bold'
                            }
                        },

                        grid: {
                            color: 'rgba(34,197,94,0.12)'
                        }
                    },

                    y: {

                        ticks: {
                            color: '#000000',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        },

                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },
    getDashboard: async ()=>{
        const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
       const peticion = await fetch('http://localhost:8000/api/admin/dashboard/index',{
            method: 'GET',
            headers
       });
       const metrics = await peticion.json();
       if (!peticion.ok) {
           return { status: false, message:  'Error al cargar métricas', data: metrics };
       }
       return metrics;
    },
    getOrders: async (date)=>{
         const token = cookieHandler.getCookie('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const peticion = await fetch(`http://localhost:8000/api/admin/dashboard/orders?range=${date}`,{
            method: 'GET',
            headers
        });
        const orders = await peticion.json();
        if (!peticion.ok) {
            return { status: false, message:  'Error al cargar pedidos', data: orders };
        }
        return orders;
    },
    loadSummary: (summary)=>{
        document.querySelector('#today-revenue-container').innerHTML = '$ ' + parseFloat(summary.total_revenue).toFixed(2);
        document.querySelector('#today-order-container').innerHTML = summary.orders_count;
        document.querySelector('#today-order-active').innerHTML = summary.orders_active;
        document.querySelector('#today-order-inactive').innerHTML = summary.orders_pendiente;
    },
    loadPromotion: (promociones)=>{
      
        const promoList = document.getElementById('dashboard-promos-list');
        if (promoList) {
            promoList.innerHTML = promociones.map(p => `
                <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${p.name}</strong><br>
                        <small class="text-muted">Comienza: ${(new Date(p.start_date)).toLocaleString('es-SV', { dateStyle: 'full', timeStyle: 'short' })}</small><br>
                        <small class="text-muted">Termina: ${(new Date(p.end_date)).toLocaleString('es-SV', { dateStyle: 'full', timeStyle: 'short' })}</small>
                    </div>
                    <span class="badge bg-success">${p.is_active ? 'Activo' : 'Inactivo'}</span>
                </div>
            `).join('');
        }
    },
    initTableOrders: (orders) =>{
        const table = document.querySelector('#orders-table-body');
        table.innerHTML = orders.map(data => `
            <tr>
                <th class="p-3">${data.id}</th>
                <th>${data.user.name}</th>
                <th>$${data.total}</th>
                <th>${data.status}</th>
            </tr>
        `).join('');
    },
    mostrarModalError: (mensaje) => {
        let modal = document.getElementById('errorModal');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', `
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-danger">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="errorModalLabel">Error</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
            `);
            modal = document.getElementById('errorModal');
        }
        modal.querySelector('.modal-body').textContent = mensaje;
        new bootstrap.Modal(modal).show();
    },
    onLoading: ()=>{
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('d-none');
    },
    onStart: ()=>{
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.add('d-none');
    },
    cerrarSesion: async ()=>{
        const respuesta = await UsuariosModel.deslogearUsuario();
        alert('ola');
        if(respuesta.status){
            alert('Deslogeo con exito. Navegando a login...');
            location.href = '../../public/login.php?logout=1';
        }
    }
};
document.addEventListener('DOMContentLoaded', ()=>{
    MainController.init();
    DashboardController.init();
});