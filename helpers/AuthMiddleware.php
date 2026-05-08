<?php
require_once __DIR__.'/sessionHandler.php';
function validate_jwt(){
    AppSessionHandler::iniciarSesionSegura();
    if(isset($_SESSION['token'])){
        return true;
    }
    return false;
}

function isUserAdmin(): bool
{
    AppSessionHandler::iniciarSesionSegura();

    return isset($_SESSION['user']['role']) 
        && $_SESSION['user']['role'] === 'admin';
}