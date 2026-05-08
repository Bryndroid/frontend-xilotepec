<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__.'/../helpers/sessionHandler.php';
AppSessionHandler::iniciarSesionSegura();


$client = new Google_Client();
$client->setClientId(GOOGLE_CLIENT_ID);
$client->setClientSecret(GOOGLE_CLIENT_SECRET);
$client->setRedirectUri(GOOGLE_REDIRECT_URI);
$client->addScope("email");
$client->addScope("profile");

if (!isset($_GET['code'])) {
    $auth_url = $client->createAuthUrl();
    header("Location: " . filter_var($auth_url, FILTER_SANITIZE_URL));
    exit;
} else {
    // Intercambiar el code por el token
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

    if (isset($token['error'])) {
        die("Error al obtener el token: " . $token['error']);
    }

    $client->setAccessToken($token);

    // Obtener datos del usuario
    $oauth = new Google_Service_Oauth2($client);
    $user_info = $oauth->userinfo->get();

    // Enviar datos a tu API Laravel
    $ch = curl_init('http://127.0.0.1:8000/api/login/google');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'email' => $user_info->email,
            'name'  => $user_info->name
        ]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode($response, true);

    if ($http_code === 200 && isset($data['token'])) {
        $_SESSION['user'] = $data['user'];
        $_SESSION['token'] = $data['token'];
        $_SESSION['expires_at'] = $data['expires_at'];
         setcookie(
                'jwt_token',
                $data['token'],
                time() + 3600, //pa una hora es la cookie, no se si debe ser de menos
                '/',
                '',
                false, 
                false
            );

        if($_SESSION['user']['role'] == 'admin'){
            header('Location: ../views/admin/index.php');
            exit;
        }
        header('Location: ../views/cliente/menu.php');
        exit;
    } else {
        echo "Error en login con Google: " . ($data['mensaje'] ?? 'Respuesta inválida');
    }

    var_dump($response);

}
