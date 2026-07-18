<?php

declare(strict_types=1);

/**
 * @file app/Install/RequirementsChecker.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class RequirementsChecker
 * @ingroup install
 *
 * @brief Pemeriksa persyaratan sistem untuk instalasi.
 */

namespace Sangia\Install;

use PDO;
use Exception;

class RequirementsChecker
{
    private array $requirements = [
        'php_version' => '7.4',
        'extensions' => ['pdo', 'pdo_mysql', 'json', 'curl', 'mbstring', 'openssl'],
        'writable_dirs' => ['storage', 'storage/logs', 'storage/cache']
    ];

    public function check(): array
    {
        $results = [
            'passed' => true,
            'php_version' => false,
            'extensions' => [],
            'permissions' => []
        ];

        // Cek Versi PHP
        $results['php_version'] = version_compare(PHP_VERSION, $this->requirements['php_version'], '>=');
        if (!$results['php_version']) {
            $results['passed'] = false;
        }

        // Cek Ekstensi
        foreach ($this->requirements['extensions'] as $ext) {
            $loaded = extension_loaded($ext);
            $results['extensions'][$ext] = $loaded;
            if (!$loaded) {
                $results['passed'] = false;
            }
        }

        // Cek Izin Folder
        foreach ($this->requirements['writable_dirs'] as $dir) {
            $path = dirname(__DIR__, 2) . '/' . $dir;
            $writable = is_writable($path);
            $results['permissions'][$dir] = $writable;
            if (!$writable) {
                $results['passed'] = false;
            }
        }

        return $results;
    }
}
