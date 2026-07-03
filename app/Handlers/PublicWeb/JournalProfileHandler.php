<?php

declare(strict_types=1);

/**
 * @file app/Handlers/PublicWeb/JournalProfileHandler.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class JournalProfileHandler
 * @ingroup public_web
 *
 * @brief Handler for managing journal profile functionality.
 */

namespace Wizdam\Handlers\PublicWeb;

use Wizdam\Database\DBConnector;
use Wizdam\Database\Models\JournalModel;
use Wizdam\Database\Models\ImpactScoreModel;
use Wizdam\Services\Core\AuthManager;
use Wizdam\Services\SangiaApi\IndexingIntegrator;
use Wizdam\Services\SangiaApi\ImpactScoreClient;
use Wizdam\Http\Request;
use Wizdam\Http\Response;

class JournalProfileHandler
{
    private JournalModel $journalModel;
    private ImpactScoreModel $scoreModel;

    public function __construct(
        private DBConnector $db,
        private AuthManager $auth
    ) {
        $this->journalModel = new JournalModel();
        $this->scoreModel   = new ImpactScoreModel();
    }

    public function show(string $issn): void
    {
        $response = $this->showWithResponse($issn);
        $response->send();
    }

    /** Versi Response object untuk show() - digunakan oleh router baru */
    public function showWithResponse(string $issn): Response
    {
        $journal = $this->journalModel->findByIssn($issn);

        if (!$journal) {
            return Response::error("Jurnal dengan ISSN $issn tidak ditemukan.", 404);
        }

        $articles     = $this->journalModel->getRecentArticles((int) $journal['id']);
        $indexing     = $this->journalModel->getIndexingMetrics((int) $journal['id']);

        $scoreClient  = new ImpactScoreClient();
        $score        = $scoreClient->getLatest('journal', (int) $journal['id']);
        $scoreHistory = $this->scoreModel->getHistory('journal', (int) $journal['id']);

        // Cek indeksasi real-time jika diminta
        $liveIndexing = null;
        if (isset($_GET['check_indexing'])) {
            $integrator   = new IndexingIntegrator();
            $liveIndexing = $integrator->checkByIssn($journal['issn']);
        }

        return Response::react('JournalProfilePage', [
            'journal'      => $journal,
            'articles'     => $articles,
            'indexing'     => $indexing,
            'liveIndexing' => $liveIndexing,
            'score'        => $score,
            'scoreHistory' => $scoreHistory,
            'pageTitle'    => ($journal['title'] ?? "Jurnal ISSN $issn") . ' – Sangia Scieco',
        ]);
    }
}
