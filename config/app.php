<?php
declare(strict_types=1);

/**
 * @file config/app.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class App
 * @ingroup core
 *
 * @brief Application container for managing dependencies and bootstrap process.
 */

return [
    'name'          => $_ENV['APP_NAME'] ?? 'Sangia Scieco',
    'version'       => '1.0.0',
    'url'           => $_ENV['APP_URL'] ?? 'http://localhost',
    'base_path'     => $_ENV['BASE_PATH'] ?? dirname(__DIR__),
    'debug'         => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'env'           => $_ENV['APP_ENV'] ?? 'development',
    'locale'        => 'id_ID',
    'timezone'      => 'Asia/Makassar',
    'session_lifetime' => (int) ($_ENV['SESSION_LIFETIME'] ?? 120),
    'encryption_key'   => $_ENV['ENCRYPTION_KEY'] ?? '',
    'max_upload_size'  => (int) ($_ENV['MAX_UPLOAD_SIZE'] ?? 10485760),
    'allowed_extensions' => explode(',', $_ENV['ALLOWED_EXTENSIONS'] ?? 'jpg,jpeg,png,pdf,doc,docx'),
];
