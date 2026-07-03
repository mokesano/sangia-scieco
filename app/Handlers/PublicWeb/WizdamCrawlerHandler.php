<?php

declare(strict_types=1);

/**
 * @file app/Handlers/PublicWeb/WizdamCrawlerHandler.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class WizdamCrawlerHandler
 * @ingroup public_web
 *
 * @brief Handler for Wizdam Crawler tool page.
 */

namespace Wizdam\Handlers\PublicWeb;

use Wizdam\Http\Request;
use Wizdam\Http\Response;

class WizdamCrawlerHandler
{
    public function index(Request $request): Response
    {
        return Response::react('WizdamCrawlerPage', [
            'pageTitle' => 'Wizdam Crawler – Sangia Scieco',
        ]);
    }
}
