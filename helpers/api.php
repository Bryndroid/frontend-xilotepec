<?php
require_once __DIR__.'/session.php';
require_once __DIR__.'/AuthMiddleware.php';
iniciarSesionSegura();

$path = basename($_GET['path'] ?? '');
//TODO: Parsear las rutas relativas! xd
//TODO: Si en el backend recibo un 401 dentro de Dashboard o vista Admin debe de redirigir a Login!
switch($path){
    case 'pedidos':
    case 'promociones':
    case 'usuarios':
    case 'index-admin':
    case 'menu':
        if(isUserAdmin() && validate_jwt()){
            header('Location: /admin/'.$path.'.php');
        }else{
            header('Location: /errors/401.php');
        }
    exit;
    
    case 'carrito':
        if(validate_jwt()){
            header('Location: /admin/'.$path.'.php');
        }else{
            header('Location: /errors/401.php');
        }
    exit;


    default:
        header('Location: 404.php');
    exit;
    //Case de usuarios clientes ...
}
