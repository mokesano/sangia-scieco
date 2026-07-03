<?php

declare(strict_types=1);

/**
 * @file config/routes.php
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

use Wizdam\Http\Router;
use Wizdam\Http\Request;
use Wizdam\Http\Response;
use Wizdam\Core\App;
use Wizdam\Http\Middleware\AuthMiddleware;
use Wizdam\Http\Middleware\AdminMiddleware;

/**
 * Definisi semua route aplikasi.
 * 
 * @param App $app Application container
 * @return Router Configured router instance
 */
return function (App $app): Router {
    $router = new Router();

    // Middleware instances
    $authMiddleware = new AuthMiddleware($app->getAuth());
    $adminMiddleware = new AdminMiddleware($app->getAuth());

    // ─── HELPER: render React shell ───────────────────────────────────────────
    $reactShell = function (Request $request) use ($app): Response {
        $auth   = $app->getAuth();
        $isDev  = ($_ENV['APP_ENV'] ?? 'production') === 'development';
        $apiUrl = $_ENV['VITE_API_URL'] ?? $_ENV['REACT_APP_API_URL'] ?? '/api/v1';

        // Baca Vite manifest (hanya production)
        $manifest     = [];
        $manifestPath = BASE_PATH . '/public/app/.vite/manifest.json';
        if (!$isDev && file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true) ?? [];
        }

        // Bangun currentUser dari AuthManager (menghindari instansiasi AuthService terpisah)
        $currentUser = null;
        if ($auth->isLoggedIn()) {
            $userId = $auth->getUserId();
            try {
                $row = \Wizdam\Database\DBConnector::getInstance()->fetchOne(
                    'SELECT id, email, full_name, role FROM users WHERE id = ? AND is_active = 1',
                    [$userId]
                );
                $currentUser = $row ?: ['id' => $userId];
            } catch (\Throwable) {
                $currentUser = ['id' => $userId];
            }
        }

        // Render HTML shell untuk React SPA
        $html = '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sangia Scieco</title>
    <script>window.__INITIAL_DATA__ = ' . json_encode([
            'vite_dev' => $isDev,
            'api_url' => $apiUrl,
            'current_user' => $currentUser,
            'csrf_token' => bin2hex(random_bytes(16)),
        ]) . ';</script>
</head>
<body>
    <div id="root"></div>';

        if ($isDev) {
            $html .= '<script type="module" src="/app/src/main.jsx"></script>';
        } else {
            foreach ($manifest as $file => $data) {
                if (($data['isEntry'] ?? false) && isset($data['file'])) {
                    $html .= '<script type="module" src="/app/' . htmlspecialchars($data['file']) . '"></script>';
                }
            }
        }

        $html .= '</body></html>';

        return Response::html($html);
    };

    // ─── PUBLIC ROUTES ────────────────────────────────────────────────────────

    // Halaman Utama - Daftar Peneliti (React SPA)
    $router->get('/', function (Request $request) use ($reactShell) {
        return $reactShell($request);
    });

    // Profil Peneliti: /researcher/{orcid} (React SPA)
    $router->get('/researcher/{orcid}', function (Request $request, string $orcid) use ($reactShell) {
        return $reactShell($request);
    });

    // Profil Institusi: /institution/{id} (React SPA)
    $router->get('/institution/{id:\d+}', function (Request $request, int $id) use ($reactShell) {
        return $reactShell($request);
    });

    // Profil Jurnal: /journal/{issn} (React SPA)
    $router->get('/journal/{issn}', function (Request $request, string $issn) use ($reactShell) {
        return $reactShell($request);
    });

    // WizdamCrawler — halaman publik mesin crawler resmi (React SPA)
    $router->get('/crawler', function (Request $request) use ($reactShell) {
        return $reactShell($request);
    });

    // ─── AUTH ROUTES ──────────────────────────────────────────────────────────

    // Login page & handle (React SPA)
    $router->any('/auth/login', function (Request $request) use ($reactShell) {
        return $reactShell($request);
    });

    // Logout
    $router->get('/auth/logout', function (Request $request) use ($app) {
        $app->getAuth()->logout();
        return Response::redirect('/');
    });

    // ORCID Callback
    $router->get('/auth/orcid-callback', function (Request $request) use ($app) {
        $app->getAuth()->handleOrcidCallback();
        return Response::redirect('/dashboard');
    });

    // ─── REACT SPA (halaman dinamis — dimuat via Twig React shell) ───────────
    // Semua sub-path /app/* dilayani oleh shell yang sama; React Router
    // menangani navigasi di sisi client.

    // P1-fix: {path:.+} catch-all agar deep links seperti /app/researchers/123 tidak 404
    $router->get('/app',           $reactShell);
    $router->get('/app/{path:.+}', $reactShell);

    // ─── PROTECTED ROUTES (Requires Login) ────────────────────────────────────

    // Dashboard User (React SPA)
    $router->get('/dashboard', function (Request $request) use ($reactShell, $authMiddleware) {
        if ($response = $authMiddleware->handle($request, [])) {
            return $response;
        }
        return $reactShell($request);
    });

    // Admin Analytics (Admin only - React SPA)
    $router->get('/admin', function (Request $request) use ($reactShell, $adminMiddleware) {
        if ($response = $adminMiddleware->handle($request, [])) {
            return $response;
        }
        return $reactShell($request);
    });

    $router->get('/admin/{path}', function (Request $request, string $path) use ($reactShell, $adminMiddleware) {
        if ($response = $adminMiddleware->handle($request, [])) {
            return $response;
        }
        return $reactShell($request);
    });

    // ─── TOOLS ROUTES ─────────────────────────────────────────────────────────

    // Image Resizer (React SPA)
    $router->any('/tools/image-resizer', function (Request $request) use ($reactShell) {
        return $reactShell($request);
    });

    // PDF Compress (React SPA)
    $router->any('/tools/pdf-compress', function (Request $request) use ($reactShell) {
        return $reactShell($request);
    });

    // ─── API ROUTES ───────────────────────────────────────────────────────────

    // Crawler Receiver
    $router->any('/api/crawler', function (Request $request) use ($app) {
        $handler = new \Wizdam\Services\Harvesting\CrawlerReceiver();
        return $handler->receiveWithResponse($request);
    });

    // ─── REST API v1 ──────────────────────────────────────────────────────────
    // Semua endpoint di bawah ini mengembalikan JSON dan mendukung CORS
    // sehingga React frontend dapat memanggilnya langsung.

    // Stats — ringkasan dashboard
    $router->get('/api/v1/stats', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\StatsApiHandler();
        return $handler->index($request);
    });

    // OPTIONS preflight untuk semua /api/v1/*
    $router->any('/api/v1/{path}', function (Request $request) {
        if ($request->method === 'OPTIONS') {
            $cors = new \Wizdam\Http\Middleware\CorsMiddleware();
            $cors->sendCorsHeaders();
            return new \Wizdam\Http\Response('', 204);
        }
        return \Wizdam\Http\Response::json(['success' => false, 'message' => 'Not found'], 404);
    });

    // Researchers
    $router->get('/api/v1/researchers', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\ResearcherApiHandler();
        return $handler->index($request);
    });

    $router->get('/api/v1/researchers/top', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\ResearcherApiHandler();
        return $handler->top($request);
    });

    $router->get('/api/v1/researchers/{orcid}', function (Request $request, string $orcid) {
        $handler = new \Wizdam\Handlers\Api\ResearcherApiHandler();
        return $handler->show($request, $orcid);
    });

    // Articles / Publications
    $router->get('/api/v1/articles', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\ArticleApiHandler();
        return $handler->index($request);
    });

    $router->get('/api/v1/articles/top', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\ArticleApiHandler();
        return $handler->top($request);
    });

    $router->get('/api/v1/articles/trends', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\ArticleApiHandler();
        return $handler->trends($request);
    });

    $router->get('/api/v1/articles/{id:\d+}', function (Request $request, int $id) {
        $handler = new \Wizdam\Handlers\Api\ArticleApiHandler();
        return $handler->show($request, $id);
    });

    // Institutions
    $router->get('/api/v1/institutions', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\InstitutionApiHandler();
        return $handler->index($request);
    });

    $router->get('/api/v1/institutions/map', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\InstitutionApiHandler();
        return $handler->map($request);
    });

    $router->get('/api/v1/institutions/{id:\d+}', function (Request $request, int $id) {
        $handler = new \Wizdam\Handlers\Api\InstitutionApiHandler();
        return $handler->show($request, $id);
    });

    // Impact Scores
    $router->get('/api/v1/impact-scores/averages/{type}', function (Request $request, string $type) {
        $handler = new \Wizdam\Handlers\Api\ImpactScoreApiHandler();
        return $handler->averages($request, $type);
    });

    $router->get('/api/v1/impact-scores/{type}/{id:\d+}', function (Request $request, string $type, int $id) {
        $handler = new \Wizdam\Handlers\Api\ImpactScoreApiHandler();
        return $handler->show($request, $type, $id);
    });

    $router->post('/api/v1/impact-scores/{type}/{id:\d+}/calculate', function (Request $request, string $type, int $id) {
        $handler = new \Wizdam\Handlers\Api\ImpactScoreApiHandler();
        return $handler->calculate($request, $type, $id);
    });

    $router->get('/api/v1/impact-scores/{type}/{id:\d+}/history', function (Request $request, string $type, int $id) {
        $handler = new \Wizdam\Handlers\Api\ImpactScoreApiHandler();
        return $handler->history($request, $type, $id);
    });

    // SDG Classification
    $router->post('/api/v1/sdg/classify', function (Request $request) {
        $handler = new \Wizdam\Handlers\Api\ImpactScoreApiHandler();
        return $handler->classifySdg($request);
    });

    return $router;
};
