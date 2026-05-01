//Este es el comun para los archivos maneja la parte del sidebar
import {MenuModel} from '../../models/Product.js'

export const MainController = {
    init: () => {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const toggleBtn = document.getElementById('btn-sidebar-toggle');
        const overlay = document.getElementById('sidebar-overlay');

        const toggle = () =>{
            const isMobile = window.innerWidth <= 991;
            if(isMobile){
                sidebar.classList.toggle('open');
                overlay.classList.toggle('show');
            }else{
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        };
        if(toggleBtn) toggleBtn.addEventListener('click',toggle);
        if(overlay) overlay.addEventListener('click',toggle);
    }
};


