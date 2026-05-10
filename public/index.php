<!doctype html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Xilotepec Coffee Shop</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="./css/style_user.css" />
    <link rel="icon" href="./images/logo.png" type="image/png" />
</head>

<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-xilo">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php">
                    <img src="./images/Logo xilo color.jpg" alt="Logo Xilotepec" />
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Mostrar navegación">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex">
                        <li class="nav-item">
                            <a class="nav-link active text-light" aria-current="page" href="#conocenos">Nuestra
                                Historia</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-light" href="#promociones">Promociones</a>
                        </li>
                    </ul>

                    <div class="ms-auto">
                        <a class="btn btn-light btn-login-public" href="login.php">Iniciar sesión</a>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <section class="banner">
            <a class="btn-conocenos" href="#conocenos">
                <img src="./images/Logo xilo color.jpg" alt="Logo Xilotepec" />
            </a>
        </section>

        <section class="contenedor">
            <h2 id="conocenos">¡Conócenos!</h2>
            <article class="conocenos">
                <img id="logo-conocenos" src="./images/Logo xilo color.jpg" alt="Logo Xilotepec" />
                <p>
                    XILOTEPEC no representa solo una marca; para nosotros es un puente entre el pasado y el presente.
                    Desde la época precolombina, el volcán XILOTEPEC fue un emblema cultural de nuestra tierra, y hoy
                    por hoy es un impresionante y bello lago. Nuestra misión es no solo ofrecer una excelente taza de
                    café,
                    sino también transmitir el legado de esta región tan rica en historia y sabor.
                </p>
            </article>

            <h2>Nosotros te traemos el café, ¡de la finca a tu casa!</h2>
            <div class="bento">
                <article class="box" style="grid-area: box-1"><img src="./images/1.jpg" alt="Café Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-2"><img src="./images/2.jpg" alt="Café Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-3"><img src="./images/3.jpg" alt="Café Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-4"><img src="./images/4.jpg" alt="Café Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-5"><img src="./images/5.jpg" alt="Café Xilotepec" />
                </article>
            </div>

            <h2 id="promociones">Conoce nuestras promociones</h2>
            <div id="home-alert-container"></div>
            <div id="promociones-dinamicas" class="promo-grid mb-4"></div>
            <div class="bento2" id="promociones-estaticas">
                <article class="box" style="grid-area: box-1"><img src="../img/6.jpg" alt="Promoción Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-2"><img src="../img/7.jpg" alt="Promoción Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-3"><img src="../img/8.jpg" alt="Promoción Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-4"><img src="../img/9.jpg" alt="Promoción Xilotepec" />
                </article>
                <article class="box" style="grid-area: box-5"><img src="../img/10.jpg" alt="Promoción Xilotepec" />
                </article>
            </div>
        </section>
    </main>

    <?php require __DIR__ . '/../views/cliente/partials/footer.php'; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="../controllers/cliente/homecontroller.js"></script>
</body>

</html>