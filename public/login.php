<?php
require_once __DIR__.'/../helpers/sessionHandler.php';
require_once __DIR__.'/../config/config.php';
AppSessionHandler::iniciarSesionSegura();

if (isset($_GET['logout'])) {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    setcookie('jwt_token', '', time() - 42000, '/');
    header('Location: /admin/public/login.php');
    exit;
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        $error = 'Email y contraseña requeridos';
    } else {
        $ch = curl_init('http://127.0.0.1:8000/api/login');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(['email' => $email, 'password' => $password]),
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
                header('Location: /admin/views/admin/index.php');
                exit;
            }
            header('Location: /admin/views/cliente/menu.php');
            exit;
        } else {
            $error = $data['message'] ?? 'Credenciales inválidas';
        }
    }
}
?>

<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="./css/login.css" />
    <link rel="icon" href="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778105791/logo_ovjyyk.png" type="image/png" />
    <title>Xilotepec Coffe Shop - Iniciar Sesión</title>
</head>
<body>
    <div class="contenedor-login">
        <div class="card">
            <div class="row g-0">
                <div class="col-md-6 imagen d-none d-md-block">
                    <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778105841/portada_login_jh3gyb.jpg" alt="Cosecha de café" class="img-fluid w-100 h-100" />
                    <div class="img-overlay login-overlay"></div>
                </div>
                <div class="col-md-6 col-12 formulario">
                    <h3 class="fw-bold mb-4">¡Hola de Nuevo!</h3>
                    
                    <?php if ($error): ?>
                        <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($error); ?></div>
                    <?php endif; ?>

                    <form method="POST">
                        <div class="mb-3">
                            <input type="email" class="form-control" name="email" placeholder="Correo" value="<?php echo htmlspecialchars($email); ?>" />
                        </div>
                        <div class="mb-4">
                            <input type="password" class="form-control" name="password" placeholder="Contraseña"  />
                        </div>
                        <div class="d-grid gap-3">
                            <button type="submit" class="btn btn-buttons">Ingresar</button>
                            <a href="./../helpers/google-callback.php" class="btn btn-buttons">
                                <i class="bi bi-google"></i> Ingresar con Google
                            </a>
                        </div>
                    </form>
                    <p>¿Aún no tienes una cuenta? <a href="register.php">¡Regístrate!</a></p>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
    <script src="./config/main.js" defer></script>
</body>
</html>