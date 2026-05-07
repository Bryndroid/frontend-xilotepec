<?php
require_once __DIR__ . '/../../vendor/autoload.php';
session_start();
if (!$conn = new mysqli("localhost", "root", "", "api_xilotepec")) {
    die("Error de conexión: " . $conn->connect_error);
}

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

require __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

define('GOOGLE_CLIENT_ID', $_ENV['GOOGLE_CLIENT_ID']);
define('GOOGLE_CLIENT_SECRET', $_ENV['GOOGLE_CLIENT_SECRET']);
define('GOOGLE_REDIRECT_URI', $_ENV['GOOGLE_REDIRECT_URI']);


?>
