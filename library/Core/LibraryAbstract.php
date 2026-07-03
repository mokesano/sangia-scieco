<?php

/**
 * @file library/Core/LibraryAbstract.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class LibraryAbstract
 * @ingroup Library
 *
 * @brief Base class for all custom Wizdam libraries.
 */

declare(strict_types=1);

namespace Wizdam\Library\Core;

/**
 * Base class untuk semua library custom Wizdam
 */
abstract class LibraryAbstract
{
    protected array $config = [];

    public function __construct(array $config = [])
    {
        $this->config = $config;
        $this->boot();
    }

    /**
     * Method yang dipanggil saat inisialisasi
     */
    protected function boot(): void
    {
        // Override di child class jika perlu
    }

    /**
     * Validasi konfigurasi
     */
    protected function validateConfig(array $required = []): bool
    {
        foreach ($required as $key) {
            if (!isset($this->config[$key])) {
                throw new \InvalidArgumentException("Konfigurasi '{$key}' diperlukan");
            }
        }
        return true;
    }
}
