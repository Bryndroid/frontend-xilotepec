import {MenuModel} from '../../models/Product.js'
import {PromocionesModel} from '../../models/Promocion.js';
import { MainController } from './maincontroller.js';
const DashboardController = {
    init: async () => {
        //para tener la fecha
        const dateEl = document.getElementById('today-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString();
        }

        const dashboard = await DashboardController.getDashboard();
        
        DashboardController.loadSummary(dashboard.data.summary);
        DashboardController.initChart(dashboard.data.analytics.orders_per_month);
      
        //los datos de los productos y las promos
        const productos = MenuModel.obtenerProductos();
        const promociones = PromocionesModel.obtenerPromociones();

        const promoList = document.getElementById('dashboard-promos-list');
        if (promoList) {
            promoList.innerHTML = promociones.map(p => `
                <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${p.nombre}</strong><br>
                        <small class="text-muted">${p.validez}</small>
                    </div>
                    <span class="badge bg-success">${p.estado}</span>
                </div>
            `).join('');
        }
       

        window.DashboardController = DashboardController;
        
    },
    initChart: (analitycs)=>{
       
       
        const labels = analitycs.map(l => l.month);
        const revenues = analitycs.map(d => d.revenue);
        const data = {
            labels: labels,
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
        const myChartOne = new window.Chart(ctx, {
        type: 'line', // puedes cambiar a 'line' si prefieres
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
    getDashboard: async ()=>{
        /* const [res1, res2, res3, res4]= await Promise.all(
        [   fetch('http://localhost:8000/api/admin/dashboard/orders?range=today'),
            fetch('http://localhost:8000/api/admin/dashboard/orders?range=last_week'),
            fetch('http://localhost:8000/api/admin/dashboard/orders?range=Month'),
            fetch('http://localhost:8000/api/admin/dashboard/index')
        ]
        );
        
        const [orders_today, orders_last_week, orders_month, dashboard] = await Promise.all(
        [res1.json(),
            res2.json(),
            res3.json(),
            res4.json(), 
            ]
        );
       console.log(orders_today);
       console.log(orders_last_week);
       console.log(orders_month);
       console.log(dashboard); */

       const peticion = await fetch('http://localhost:8000/api/admin/dashboard/index');

       const metrics= await peticion.json();
       if(!metrics){
        //Validar errores
        return null
       }
       console.log(metrics);
       return metrics 
        
    },
    loadOrders: (orders)=>{
        //Estos van a ser renderizados por Orden con un title que diga de Hoy y de lastweek y current month!
        // pedidos estos son datos estaticos 
        const table = document.getElementById('orders-table-body');
        if (table) {
            table.innerHTML = `
                <tr>
                    <td class="p-3">01</td>
                    <td>Maria Lopez</td>
                    <td>$4.50</td>
                    <td><span class="badge bg-warning">Pendiente</span></td>
                </tr>
            `;
        }
    },
    loadSummary: (summary)=>{
        document.querySelector('#today-revenue-container').innerHTML = summary.total_revenue;
        document.querySelector('#today-order-container').innerHTML = summary.orders_count;
        document.querySelector('#today-order-active').innerHTML = summary.orders_active
    }
};
document.addEventListener('DOMContentLoaded', ()=>{
    MainController.init();
    DashboardController.init();
});