<?php

declare(strict_types=1);

/**
 * @file app/Http/Middleware/AuthMiddleware.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class AuthMiddleware
 * @ingroup http
 *
 * @brief Middleware for ensuring the user is logged in.
 */

namespace Wizdam\Http\Middleware;

use Wizdam\Http\Request;
use Wizdam\Http\Response;
use Wizdam\Services\Core\AuthManager;

/**
 * Middleware untuk memastikan user sudah login.
 */
class AuthMiddleware
{
    public function __construct(
        private AuthManager $auth
    ) {
    }

    public function handle(Request $request, array $params): ?Response
    {
        if (!$this->auth->isLoggedIn()) {
            return Response::redirect('/auth/login');
        }
        return null; // Lanjut ke handler
    }
}
