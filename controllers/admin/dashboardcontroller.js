import { PedidosModel } from '../../models/Order.js';
import {MenuModel} from '../../models/Product.js'
import {PromocionesModel} from '../../models/Promocion.js';
import { MainController } from './MainController.js';
//TODO: Validar errores!!!!!
//TODO: Aplicarle rendimiento vergon
//TODO: Validarlo que este en LocalStorage!
const DashboardController = {
    init: async () => {
        //para tener la fecha
        const dateEl = document.getElementById('today-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString();
        }

        const [
            dashboard,
            orders,
            promociones,
            fiveOrders
        ] = await Promise.all([
            DashboardController.getDashboard(),
            DashboardController.getOrders('year'),
            PromocionesModel.obtenerPromocionesActivas(),
            PedidosModel.obtenerPedidos()
        ]);

        DashboardController.loadSummary(dashboard.data.summary);
        DashboardController.initChartLine(orders.data);
        DashboardController.initChartRadar(dashboard.data.categories);
        DashboardController.loadPromotion(promociones.data);
        DashboardController.initTableOrders(fiveOrders.data);
        
        window.DashboardController = DashboardController;
    },
    initChartLine: (analitycs)=>{
       
       
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
        const myChartOne = new window.Chart(ctx, {
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
    initChartRadar: (analitycs) =>{
        const randomColor = (alpha = 0.3) =>{
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            return {
                border: `rgba(${r}, ${g}, ${b}, 1)`,
                background: `rgba(${r}, ${g}, ${b}, ${alpha})`
            };
        }
        const labels = Object.keys(analitycs[0].sales);
        let datasets = new Array();
        analitycs.forEach(el => {
            const color = randomColor();
            datasets.push({
                label: el.name,
                data: Object.values(el.sales).map(a => a.revenue),
                borderColor: color.border,
                backgroundColor: color.background,
                fill: 1
            });
            
        });
        const data = {
            labels:labels,
            datasets: datasets
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                plugins: {
                filler: {
                    propagate: false
                },
                'samples-filler-analyser': {
                    target: 'chart-analyser'
                }
                },
                interaction: {
                intersect: false
                },
                elements:{
                    line:{
                        tension: 0.4
                    }
                }
            }
        };

        const ctx = document.getElementById('miChart2');
        const myChartSecond = new window.Chart(ctx, config); 
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
    getOrders: async (date)=>{
        
        const peticion = await fetch(`http://localhost:8000/api/admin/dashboard/orders?range=${date}`);
        const orders = await peticion.json();
        return orders 
    },
    loadSummary: (summary)=>{
        //TODO: Verificar si esto es de verdad correspondiente a HOY
        document.querySelector('#today-revenue-container').innerHTML = summary.total_revenue;
        document.querySelector('#today-order-container').innerHTML = summary.orders_count;
        document.querySelector('#today-order-active').innerHTML = summary.orders_active;
        document.querySelector('#today-order-inactive').innerHTML = parseInt(summary.orders_count) - parseInt(summary.orders_active);
    },
    loadPromotion: (promociones)=>{
      
        const promoList = document.getElementById('dashboard-promos-list');
        if (promoList) {
            promoList.innerHTML = promociones.map(p => `
                <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${p.name}</strong><br>
                        <small class="text-muted">${p.end_date}</small>
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
    }
};
document.addEventListener('DOMContentLoaded', ()=>{
    MainController.init();
    DashboardController.init();
});