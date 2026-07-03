<?php

declare(strict_types=1);

/**
 * @file app/Jobs/ImpactAnalysisJob.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class ImpactAnalysisJob
 * @ingroup jobs
 *
 * @brief Job untuk menghitung Wizdam Impact Score secara asinkron.
 */

namespace Wizdam\Jobs;

use Wizdam\Services\SangiaApi\ImpactScoreClient;
use Wizdam\Services\SangiaApi\SdgIntegrator;
use Wizdam\Services\SangiaApi\RawDataPersister;
use Wizdam\Database\Models\ResearcherModel;

/**
 * Job untuk menghitung Wizdam Impact Score secara asinkron.
 * Dipicu dari queue ketika kalkulasi tidak bisa selesai dalam satu request HTTP.
 * Menggunakan ImpactScoreClient (SangiaGateway + batch pattern).
 */
class ImpactAnalysisJob extends JobAbstract
{
    private ImpactScoreClient $impactClient;
    private SdgIntegrator $sdgIntegrator;
    private ResearcherModel $researcherModel;

    public function __construct(string $jobId, array $data = [])
    {
        parent::__construct($jobId, $data);
        $this->impactClient    = new ImpactScoreClient();
        $this->sdgIntegrator   = new SdgIntegrator();
        $this->researcherModel = new ResearcherModel();
    }

    public function handle(): mixed
    {
        $entityType   = $this->data['entity_type'] ?? 'researcher';
        $entityId     = (int) ($this->data['entity_id'] ?? 0);
        $orcid        = $this->data['orcid']     ?? null;
        $scopusId     = $this->data['scopus_id'] ?? null;

        if (!$entityId) {
            throw new \InvalidArgumentException('entity_id diperlukan');
        }

        $this->updateProgress(10, 'Memulai analisis...');

        // Stage 1: SDG Classification (jika ada orcid)
        $sdgResult = [];
        if ($orcid) {
            $this->updateProgress(25, 'Mengklasifikasikan SDG...');
            $cached    = RawDataPersister::loadAuthorProfile($orcid);
            $sdgResult = $this->sdgIntegrator->classifyByOrcid(
                $orcid,
                $cached['supplied_works'] ?? []
            );
            RawDataPersister::saveAnalysis($orcid, 'sdg', $sdgResult);
        }

        // Stage 2: Impact Score Calculation
        $this->updateProgress(60, 'Menghitung Wizdam Impact Score...');
        $social   = $this->data['social']   ?? [];
        $economic = $this->data['economic'] ?? [];

        $score = $orcid
            ? $this->impactClient->calculateByOrcid($orcid, $entityId, $scopusId, $social, $economic)
            : $this->impactClient->calculate($entityType, $entityId);

        $this->updateProgress(100, 'Selesai');

        return [
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'sdg_result'  => $sdgResult,
            'score'       => $score,
        ];
    }
}
