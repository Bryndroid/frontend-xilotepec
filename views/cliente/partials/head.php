<?php
require __DIR__.'/../../../helpers/AuthMiddleware.php';

if(!validate_jwt()){
  header('Location: /admin/errors/401.php');
}
$pageTitle = $pageTitle ?? 'Xilotepec Coffee Shop';
$assetBase = $assetBase ?? '../../';
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
  <link rel="stylesheet" href="<?= $assetBase ?>public/css/style_user.css" />
  <link rel="icon" href="/public/images/logo.png" type="image/png" />
</head>
