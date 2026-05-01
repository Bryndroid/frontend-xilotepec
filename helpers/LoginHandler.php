<?php
require_once __DIR__.'/../helpers/session.php';

$baseURL = 'http://localhost:8000/api/login';
function login(){
    iniciarSesionSegura();
    //Se va a hacer la peticion, guardar el JWT en Session y mandarlo a una Cookie
}

function validate_jwt(){
    iniciarSesionSegura();
    //Validar si existe el JWT, si no, redirigir al index de public!
}

function cookie_jwt(){
   /*  setcookie("token", $jwt, [
        'expires' => time() + 3600,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => false,     // true en HTTPS
        'httponly' => true,    //evita acceso JS
        'samesite' => 'Lax'
    ]);

    header("Location: dashboard.php");
    exit; */
}