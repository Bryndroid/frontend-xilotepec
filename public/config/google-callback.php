<?php
require_once 'config.php';
require_once __DIR__ . '/../../vendor/autoload.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


global $conn;

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
    $client->authenticate($_GET['code']);
    $token = $client->getAccessToken();
    $client->setAccessToken($token);

    $oauth = new Google_Service_Oauth2($client);
    $user_info = $oauth->userinfo->get();

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $user_info->email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
    } else {
        $stmt = $conn->prepare("INSERT INTO users (name, email, role) VALUES (?, ?, 'cliente')");
        $stmt->bind_param("ss", $user_info->name, $user_info->email);
        $stmt->execute();
        $user_id = $stmt->insert_id;
        $user = ['id' => $user_id, 'name' => $user_info->name, 'email' => $user_info->email];
    }

    $_SESSION['user'] = $user;
    $_SESSION['token'] = $token;

    // la cookie
    setcookie(
        'jwt_token',
        $token['id_token'],
        time() + 3600, 
        '/',
        '',           
        false,        
        false         
    );

    header("Location: ../index.php");
    exit;
}
