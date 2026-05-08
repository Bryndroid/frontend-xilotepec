<?php
require_once './../config/config.php';
require_once __DIR__.'/../helpers/sessionHandler.php';
AppSessionHandler::iniciarSesionSegura();
$error = '';
$name = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['contrasena'] ?? '');

    if (!$name || !$email || !$password) {
        $error = 'Todos los campos son requeridos';
    } elseif (strlen($password) < 9) {
        $error = 'La contraseña debe tener al menos 8 caracteres';
    } else {
        $ch = curl_init('http://127.0.0.1:8000/api/registro');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(['name' => $name, 'email' => $email, 'password' => $password]),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($http_code === 201 && isset($data['user'])) {
            $_SESSION['user'] = $data['user'];
            header('Location: login.php'); 
            exit;
        } else {
            $error = $data['mensaje'] ?? 'Error en el registro';
        }
    }
}
?>

<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="./css/login.css" />
    <link rel="icon" href="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778105791/logo_ovjyyk.png" type="image/png" />
    <title>Xilotepec Coffe Shop - Regístrate</title>
</head>

<body>
    <div class="contenedor-login">
        <div class="card">
            <div class="row g-0">
                <div class="col-md-6 imagen d-none d-md-block">
                    <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778106985/portada_registro_cgcb8n.jpg" alt="Logo Xilotepec" class="img-fluid w-100 h-100" />
                    <div class="img-overlay register-overlay"></div>
                </div>
                <div class="col-md-6 col-12 formulario">
                    <h3 class="fw-bold mb-4">Regístrate</h3>

                    <?php if ($error): ?>
                        <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($error); ?></div>
                    <?php endif; ?>

                    <form method="POST">
                        <div class="mb-3">
                            <input type="text" class="form-control" name="nombre" placeholder="Nombre" value="<?php echo htmlspecialchars($name); ?>" />
                        </div>
                        <div class="mb-3">
                            <input type="email" class="form-control" name="email" placeholder="Correo electrónico" value="<?php echo htmlspecialchars($email); ?>" />
                        </div>
                        <div class="mb-4">
                            <input type="password" class="form-control" name="contrasena" placeholder="Contraseña" />
                        </div>
                        <div class="d-grid gap-3">
                            <button type="submit" class="btn btn-buttons">Crear cuenta</button>
                            <a href="./config/google-callback.php" class="btn btn-buttons">
                                <i class="bi bi-google"></i> Registrarse con Google
                            </a>
                        </div>
                    </form>
                    <p>¿Ya tenías una cuenta? <a href="login.php">¡Inicia sesión!</a></p>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
</body>

</html>