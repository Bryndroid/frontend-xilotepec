<?php

class AppSessionHandler{


    public static function cerrarSesionSegura() {
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        session_destroy();
        header('Location: /admin/errors/401.php');
        exit;
    }
    public static function iniciarSesionSegura() {

        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }
        // Evitar que PHP use sesiones por URL
        ini_set('session.use_only_cookies', 1);
        ini_set('session.use_strict_mode', 1);

        // Configurar cookies seguras
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,   // true si usas HTTPS
            'httponly' => true,    // evita acceso por JS
            'samesite' => 'Strict' // protege contra CSRF
        ]);

        // Iniciar sesión si no está iniciada
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        // Protección contra secuestro de sesión
        if (!isset($_SESSION['ip'])) {
            $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
            $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
        } else {
            if (
                $_SESSION['ip'] !== ($_SERVER['REMOTE_ADDR'] ?? '') ||
                $_SESSION['user_agent'] !== ($_SERVER['HTTP_USER_AGENT'] ?? '')
            ) {
                self::cerrarSesionSegura();
                
            }
        }

        if (isset($_SESSION['expires_at'])) {
            if(time() > $_SESSION['expires_at']){
                self::cerrarSesionSegura();
            }
        }

    }
}

