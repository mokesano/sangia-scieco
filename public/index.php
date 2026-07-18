<?php

declare(strict_types=1);

/**
 * Application Entry Point
 * 
 * File ini hanya bertugas sebagai bootstrap aplikasi.
 * Semua logika routing dan bisnis ditangani oleh komponen terpisah.
 */

define('BASE_PATH', dirname(__DIR__));
define('APP_START', microtime(true));

// Autoload
require BASE_PATH . '/vendor/autoload.php';

// Bootstrap aplikasi
$app = \Sangia\Core\App::getInstance()->bootstrap(BASE_PATH);

// Load routes
$routerFactory = require BASE_PATH . '/config/routes.php';
$router = $routerFactory($app);

// Dispatch request
$request = \Sangia\Http\Request::fromGlobals();
$response = $router->dispatch($request);

// Jika response object, kirim langsung (untuk redirect/json/html)
if (is_object($response) && method_exists($response, 'send')) {
    $response->send();
    exit;
}

// Fallback 404
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
echo '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Halaman tidak ditemukan</title>
</head>
<body>
    <h1>404 - Halaman tidak ditemukan</h1>
    <p>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
</body>
</html>';

