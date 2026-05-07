<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
    />
    <link rel="stylesheet" href="./css/index.css" />
    <link rel="icon" href="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778105791/logo_ovjyyk.png" type="image/png" />
    <title>Xilotepec Cofee Shop</title>
  </head>
  <body>
    <header>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778110890/Logo_xilo_color_tpfzbj.jpg" alt=" logo con fondo " />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex">
              <li class="nav-item">
                <a
                  class="nav-link active text-light"
                  aria-current="page"
                  href="#conocenos"
                  >Nuestra Historia</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link text-light" href="#promociones"
                  >Promociones</a
                >
              </li>
            </ul>
            <div class="ms-auto">
              <a
                class="btn btn-light"
                aria-disabled="true"
                href="login.php"
                >Iniciar sesión</a
              >
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <section class="banner">
        <a class="btn-conocenos" href="#conocenos">
          <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778110890/Logo_xilo_color_tpfzbj.jpg" alt=" logo con fondo " />
        </a>
      </section>
      <section class="contenedor">
        <h2 id="conocenos">¡Conocenos!</h2>
        <article class="conocenos">
          <img id="logo-conocenos" src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778110890/Logo_xilo_color_tpfzbj.jpg" alt=" logo con fondo " />
          <p>
            XILOTEPEC no representa solo una marca; para nosotros es un puente
            entre el pasado y el presente. Desde la época precolombina, el
            volcán XILOTEPEC fue una emblema cultura de nuestra tierra, y hoy
            por hoy es una impresionante y bello lago. Nuestra misión es no solo
            ofrecer una excelente tasa de café, sino también transmitir el
            legado de esta región tan rica en historia y sabor.
          </p>
        </article>
        <h2>Nosotros te traemos el café, ¡de la finca a tu casa!</h2>

        <div class="bento">
          <article class="box" style="grid-area: box-1">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111052/1_jueyez.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-2">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111054/2_dtdu8o.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-3">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111056/3_adbzxa.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-4">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111058/4_qkslve.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-5">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111043/5_hguooe.jpg" alt="" />
          </article>
        </div>
        <h2 id="promociones">Conoce nuestras promociones</h2>
        <div class="bento2">
          <article class="box" style="grid-area: box-1">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111042/6_xacnpb.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-2">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111046/7_k7mvmi.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-3">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111047/8_e6plgx.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-4">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111049/9_wkf8gj.jpg" alt="" />
          </article>
          <article class="box" style="grid-area: box-5">
            <img src="https://res.cloudinary.com/dhotqeo6c/image/upload/v1778111071/10_qfocbk.jpg" alt="" />
          </article>
        </div>
      </section>
    </main>
    <footer class="text-light pt-5">
      <div class="container px-5">
        <div class="row">
          <div class="col-6 col-lg-4">
            <h3 class="fw-bold">XILOTEPEC</h3>
            <p class="pt-2">Todos los derechos reservados</p>
            <p class="mb-2">0987654321</p>
            <p>1234567890</p>
          </div>
          <div class="col">
            <h4>Te ofrecemos:</h4>
            <ul class="list-unstyled pt-2">
              <li class="py-1">Cafe</li>
              <li class="py-1">Postres</li>
              <li class="py-1">Bebidas</li>
              <li class="py-1">Experiencias</li>
            </ul>
          </div>
          <!-- <div class="col">
            <h4>More</h4>
            <ul class="list-unstyled pt-2">
              <li class="py-1">Landing Pages</li>
              <li class="py-1">FAQs</li>
            </ul>
          </div> -->
          <div class="col">
            <h4>Encuentranos en:</h4>
            <ul class="list-unstyled pt-2">
              <li class="py-1">Centro Comercias las cascadas</li>
            </ul>
          </div>
          <div class="col-6 col-lg-3 text-lg-end">
            <h4>Siguenos en:</h4>
            <div class="social-media pt-2">
              <a
                href="https://www.facebook.com/xilotepeccoffeeshop"
                target="_blank"
                class="text-light fs-2 me-3"
                ><i class="bi bi-facebook"></i
              ></a>
              <a
                href="https://www.instagram.com/xilotepec.sv?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                class="text-light fs-2 me-3"
                ><i class="bi bi-instagram"></i
              ></a>
            </div>
          </div>
        </div>
        <hr />
        <div class="d-sm-flex justify-content-between py-1">
          <p>2026 © Trabajo Universitario</p>
        </div>
      </div>
    </footer>
  </body>
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
    crossorigin="anonymous"
  ></script>
</html>
