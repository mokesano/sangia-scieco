<?php
declare(strict_types=1);

/**
 * @file api/admin/cache_to_db_batch.php
 *
 * Copyright (c) 2017-2026 Sangia Publishing House
 * Copyright (c) 2017-2026 Rochmady
 * Distributed under the MIT License.
 *
 * @ingroup api
 * @brief Anti-timeout sequential AJAX migrator: SDG cache (.json.gz) -> database.
 *
 * Reads the cache files produced by api/sdgs_v1.0.0/SDGsClassification_v520.php
 * (orcid_init_*, orcid_batch_*, orcid_*, article_*) and persists them into the
 * canonical schema from db/schema.sql: institutions, researchers, publications,
 * publication_authors, work_sdgs, researcher_sdg_expertise, and — as a catch-all
 * for anything unrecognised — ecosystem_cache.
 *
 * Pattern follows the same "small batch + client-driven loop" approach already
 * used by the SDG Classification API itself (action=init/batch/summary) and by
 * the Wizdam identifier web-batch generator: every HTTP request only touches a
 * handful of files, so nothing ever gets close to PHP's max_execution_time.
 *
 * GET  ?action=page                         -> HTML control panel (default)
 * GET  ?action=status&key=...               -> cache file counts + DB connectivity
 * GET  ?action=run&key=...&phase=researchers&offset=0&limit=8
 * GET  ?action=run&key=...&phase=publications&offset=0&limit=8
 * GET  ?action=finalize&key=...             -> one-shot SDG-expertise aggregation
 *
 * Auth: this endpoint performs bulk writes, so it is gated behind a shared
 * secret rather than being wide open like the read-only classification API.
 * Set CACHE_MIGRATION_KEY in your .env (see config/config.php for the loader);
 * nothing is accepted here as valid until that constant is non-empty, and the
 * key is compared with hash_equals() so timing side-channels don't leak it.
 * DB credentials are NOT duplicated in this file — they come from the existing
 * DB_HOST / DB_DATABASE / DB_USERNAME / DB_PASSWORD constants in
 * config/config.php (itself populated from .env), exactly like every other
 * file in this repo (api/Database.php, src/Database/Connection.php,
 * api/admin/researchers.php). Keeping one source of truth for credentials
 * means you only ever rotate them in one place, and this file stays safe to
 * commit to git.
 */

if (!defined('ROOT_PATH')) {
    define('ROOT_PATH', dirname(__DIR__, 2));
}

$configFile = ROOT_PATH . '/config/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
}
require_once ROOT_PATH . '/includes/autoload.php';

use Sciecola\Database\Connection;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('MIGRATION_BATCH_SIZE', 8); // cache files processed per AJAX request

// -----------------------------------------------------------------
// AUTH GATE — shared secret, set via .env: CACHE_MIGRATION_KEY=...
// -----------------------------------------------------------------
$expectedKey = getenv('CACHE_MIGRATION_KEY') ?: '';
$providedKey = (string) ($_GET['key'] ?? '');
$action      = $_GET['action'] ?? 'page';

if ($action !== 'page') {
    header('Content-Type: application/json; charset=utf-8');
    if ($expectedKey === '') {
        http_response_code(503);
        echo json_encode([
            'status'  => 'error',
            'message' => 'CACHE_MIGRATION_KEY belum diatur di .env. Set nilai rahasia lalu tambahkan &key=... pada URL.',
        ]);
        exit;
    }
    if ($providedKey === '' || !hash_equals($expectedKey, $providedKey)) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Akses ditolak: key tidak valid.']);
        exit;
    }
}

// -----------------------------------------------------------------
// ROUTER
// -----------------------------------------------------------------
try {
    switch ($action) {
        case 'status':
            echo json_encode(getCacheStatus(), JSON_UNESCAPED_UNICODE);
            break;

        case 'run':
            $phase  = $_GET['phase'] ?? 'researchers';
            $offset = max(0, (int) ($_GET['offset'] ?? 0));
            $limit  = min(50, max(1, (int) ($_GET['limit'] ?? MIGRATION_BATCH_SIZE)));
            echo json_encode(runBatch($phase, $offset, $limit), JSON_UNESCAPED_UNICODE);
            break;

        case 'finalize':
            echo json_encode(finalizeSdgExpertise(), JSON_UNESCAPED_UNICODE);
            break;

        case 'page':
        default:
            renderPage($providedKey);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

// =================================================================
// CACHE FILE DISCOVERY
// =================================================================

function cacheDir(): string
{
    return defined('CACHE_DIR') ? CACHE_DIR : ROOT_PATH . '/cache';
}

/** @return string[] absolute paths, sorted for deterministic pagination */
function findFiles(string $pattern): array
{
    $files = glob(cacheDir() . '/' . $pattern) ?: [];
    sort($files);
    return $files;
}

/** orcid_*.json.gz that are NOT orcid_init_* or orcid_batch_* (i.e. the legacy "full" cache) */
function findLegacyOrcidFiles(): array
{
    $all = findFiles('orcid_*.json.gz');
    return array_values(array_filter($all, function (string $f): bool {
        $base = basename($f);
        return !str_starts_with($base, 'orcid_init_') && !str_starts_with($base, 'orcid_batch_');
    }));
}

function filesForPhase(string $phase): array
{
    if ($phase === 'researchers') {
        return array_merge(findFiles('orcid_init_*.json.gz'), findLegacyOrcidFiles());
    }
    if ($phase === 'publications') {
        return array_merge(findFiles('orcid_batch_*.json.gz'), findLegacyOrcidFiles(), findFiles('article_*.json.gz'));
    }
    return [];
}

function classifyFile(string $path): string
{
    $base = basename($path);
    if (str_starts_with($base, 'orcid_init_'))  return 'orcid_init';
    if (str_starts_with($base, 'orcid_batch_')) return 'orcid_batch';
    if (str_starts_with($base, 'article_'))     return 'article';
    if (str_starts_with($base, 'orcid_'))       return 'orcid_legacy';
    return 'unknown';
}

function readCacheFile(string $path): ?array
{
    $raw = @file_get_contents($path);
    if ($raw === false) return null;
    $json = @gzdecode($raw);
    if ($json === false) return null;
    $data = json_decode($json, true);
    return (json_last_error() === JSON_ERROR_NONE && is_array($data)) ? $data : null;
}

// =================================================================
// STATUS
// =================================================================

function getCacheStatus(): array
{
    $dir = cacheDir();
    if (!is_dir($dir)) {
        return ['status' => 'error', 'message' => 'Cache directory tidak ditemukan: ' . $dir];
    }

    $counts = [
        'orcid_init'   => count(findFiles('orcid_init_*.json.gz')),
        'orcid_batch'  => count(findFiles('orcid_batch_*.json.gz')),
        'orcid_legacy' => count(findLegacyOrcidFiles()),
        'article'      => count(findFiles('article_*.json.gz')),
    ];
    $counts['total_files'] = array_sum($counts);

    $dbConnected = false;
    $dbError     = null;
    try {
        Connection::getInstance()->fetchOne('SELECT 1 AS ok');
        $dbConnected = true;
    } catch (Throwable $e) {
        $dbError = $e->getMessage();
    }

    return [
        'status'          => 'success',
        'cache_dir'       => $dir,
        'file_counts'     => $counts,
        'researchers_phase_files'  => count(filesForPhase('researchers')),
        'publications_phase_files' => count(filesForPhase('publications')),
        'db_connected'    => $dbConnected,
        'db_error'        => $dbError,
    ];
}

// =================================================================
// BATCH RUNNER
// =================================================================

function runBatch(string $phase, int $offset, int $limit): array
{
    if (!in_array($phase, ['researchers', 'publications'], true)) {
        throw new InvalidArgumentException("Phase tidak dikenali: {$phase}");
    }

    $files = filesForPhase($phase);
    $total = count($files);
    $batch = array_slice($files, $offset, $limit);

    if (empty($batch)) {
        return [
            'status' => 'success', 'phase' => $phase, 'offset' => $offset, 'limit' => $limit,
            'processed' => 0, 'total' => $total, 'logs' => [],
            'is_done' => true, 'next_offset' => $offset,
        ];
    }

    $db   = Connection::getInstance();
    $logs = [];
    $counts = [
        'researchers' => 0, 'institutions' => 0,
        'publications' => 0, 'sdg_links' => 0, 'authors_linked' => 0,
        'generic_cache' => 0, 'skipped' => 0, 'errors' => 0,
    ];

    foreach ($batch as $file) {
        $base = basename($file);
        $pdo  = $db->getPdo();
        try {
            $pdo->beginTransaction();

            $payload = readCacheFile($file);
            if ($payload === null) {
                $counts['errors']++;
                $logs[] = "[SKIP] {$base} — file rusak atau tidak bisa didekompresi";
                $pdo->rollBack();
                continue;
            }

            $kind = classifyFile($file);

            if ($phase === 'researchers') {
                $result = migrateResearcherPayload($db, $kind, $payload);
            } else {
                $result = migratePublicationPayload($db, $kind, $payload);
            }

            foreach ($result['counts'] as $k => $v) {
                $counts[$k] = ($counts[$k] ?? 0) + $v;
            }
            $logs[] = "[OK] {$base} — " . $result['summary'];

            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $counts['errors']++;
            $logs[] = "[ERROR] {$base} — " . $e->getMessage();
        }
    }

    $nextOffset = $offset + count($batch);
    $isDone     = $nextOffset >= $total;

    return [
        'status' => 'success', 'phase' => $phase, 'offset' => $offset, 'limit' => $limit,
        'processed' => count($batch), 'total' => $total, 'counts' => $counts, 'logs' => $logs,
        'is_done' => $isDone, 'next_offset' => $nextOffset,
    ];
}

// =================================================================
// RESEARCHERS PHASE  ->  institutions, researchers
// =================================================================

function migrateResearcherPayload(Connection $db, string $kind, array $payload): array
{
    $info = $payload['personal_info'] ?? null;
    if (empty($info) || empty($info['orcid'])) {
        return ['counts' => ['skipped' => 1], 'summary' => 'tidak ada personal_info/orcid, dilewati'];
    }

    $orcid = trim((string) $info['orcid']);
    if (!preg_match('/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i', $orcid)) {
        return ['counts' => ['skipped' => 1], 'summary' => "format ORCID tidak valid: {$orcid}"];
    }

    $institutionId  = null;
    $institutionsAdded = 0;
    if (!empty($info['institutions']) && is_array($info['institutions'])) {
        foreach ($info['institutions'] as $instName) {
            $instName = trim((string) $instName);
            if ($instName === '') continue;
            $id = upsertInstitution($db, $instName);
            if ($institutionId === null) $institutionId = $id;
            $institutionsAdded++;
        }
    }

    $name = trim((string) ($info['name'] ?? '')) ?: $orcid;

    $db->upsert('researchers', [
        'orcid'              => $orcid,
        'name'               => substr($name, 0, 255),
        'institution_id'     => $institutionId,
        'country'            => null,
        'profile_cache_json' => json_encode($payload, JSON_UNESCAPED_UNICODE),
        'cache_expires_at'   => date('Y-m-d H:i:s', time() + 7 * 86400),
        'updated_at'         => date('Y-m-d H:i:s'),
    ], ['orcid']);

    return [
        'counts'  => ['researchers' => 1, 'institutions' => $institutionsAdded],
        'summary' => "researcher {$orcid} ({$name}) upserted",
    ];
}

function lookupResearcherName(Connection $db, string $orcid): ?string
{
    static $memo = [];
    if (array_key_exists($orcid, $memo)) return $memo[$orcid];

    $row = $db->fetchOne('SELECT name FROM researchers WHERE orcid = ? LIMIT 1', [$orcid]);
    $memo[$orcid] = $row['name'] ?? null;
    return $memo[$orcid];
}

/** @var array<string,int> in-process memo to avoid a SELECT per row within one request */
function upsertInstitution(Connection $db, string $name): int
{
    static $memo = [];
    $key = strtolower($name);
    if (isset($memo[$key])) return $memo[$key];

    $existing = $db->fetchOne('SELECT id FROM institutions WHERE name = ? LIMIT 1', [$name]);
    if ($existing) {
        $memo[$key] = (int) $existing['id'];
        return $memo[$key];
    }

    $id = $db->insert('institutions', ['name' => substr($name, 0, 255)]);
    $memo[$key] = $id;
    return $id;
}

// =================================================================
// PUBLICATIONS PHASE  ->  publications, work_sdgs, publication_authors
// =================================================================

function migratePublicationPayload(Connection $db, string $kind, array $payload): array
{
    $counts = ['publications' => 0, 'sdg_links' => 0, 'authors_linked' => 0, 'generic_cache' => 0, 'skipped' => 0];
    $sdgVersion = extractSdgVersion($payload);

    if ($kind === 'article') {
        $ok = migratePublicationWork($db, $payload, $sdgVersion, $counts);
        if ($ok && !empty($payload['authors']) && is_array($payload['authors'])) {
            $doi = normalizeDoi($payload['doi'] ?? '');
            foreach (array_values($payload['authors']) as $i => $authorName) {
                linkPublicationAuthor($db, $doi, null, (string) $authorName, $i + 1, $i === 0, $counts);
            }
        }
        return ['counts' => $counts, 'summary' => "artikel diproses, {$counts['sdg_links']} SDG"];
    }

    if ($kind === 'orcid_batch') {
        $orcid = isset($payload['orcid']) ? trim((string) $payload['orcid']) : null;
        $name  = $orcid ? lookupResearcherName($db, $orcid) : null;
        $works = $payload['works'] ?? [];
        foreach ($works as $work) {
            $ok = migratePublicationWork($db, $work, $sdgVersion, $counts);
            if ($ok && $orcid) {
                $doi = normalizeDoi($work['doi'] ?? '');
                linkPublicationAuthor($db, $doi, $orcid, $name, 1, false, $counts);
            }
        }
        return ['counts' => $counts, 'summary' => count($works) . " karya (orcid_batch, {$orcid})"];
    }

    if ($kind === 'orcid_legacy') {
        $orcid = isset($payload['personal_info']['orcid']) ? trim((string) $payload['personal_info']['orcid']) : null;
        // Legacy cache carries the researcher's name inline, so no DB lookup is needed here.
        $name  = trim((string) ($payload['personal_info']['name'] ?? '')) ?: ($orcid ? lookupResearcherName($db, $orcid) : null);
        $works = $payload['works'] ?? [];
        foreach ($works as $work) {
            $ok = migratePublicationWork($db, $work, $sdgVersion, $counts);
            if ($ok && $orcid) {
                $doi = normalizeDoi($work['doi'] ?? '');
                linkPublicationAuthor($db, $doi, $orcid, $name, 1, false, $counts);
            }
        }
        return ['counts' => $counts, 'summary' => count($works) . " karya (legacy, {$orcid})"];
    }

    // Unknown shape — don't lose the data, park it in the generic cache table.
    $db->upsert('ecosystem_cache', [
        'cache_key'  => 'unrecognized_' . md5(json_encode($payload)),
        'payload'    => json_encode($payload, JSON_UNESCAPED_UNICODE),
        'expires_at' => date('Y-m-d H:i:s', time() + 7 * 86400),
        'created_by' => 'cache_to_db_batch',
    ], ['cache_key']);
    $counts['generic_cache']++;

    return ['counts' => $counts, 'summary' => 'format cache tidak dikenali, disimpan ke ecosystem_cache'];
}

function extractSdgVersion(array $payload): string
{
    $v = $payload['api_version'] ?? 'v5.2.0';
    return is_string($v) ? $v : 'v5.2.0';
}

function normalizeDoi(string $doi): string
{
    return strtolower(trim($doi));
}

/** Upserts publications + work_sdgs for a single work record. Returns false if no usable DOI. */
function migratePublicationWork(Connection $db, array $work, string $sdgVersion, array &$counts): bool
{
    $doi = normalizeDoi((string) ($work['doi'] ?? ''));
    if ($doi === '') {
        $counts['skipped']++;
        return false;
    }

    $title = $work['title'] ?? $doi;
    if (is_array($title)) $title = $title[0] ?? $doi;

    $db->upsert('publications', [
        'doi'            => substr($doi, 0, 512),
        'title'          => substr((string) $title, 0, 1024),
        'abstract'       => $work['abstract'] ?? null,
        'sdg_cache_json' => json_encode([
            'sdgs'                  => $work['sdgs'] ?? [],
            'sdg_confidence'        => $work['sdg_confidence'] ?? [],
            'contributor_types'     => $work['contributor_types'] ?? [],
            'contribution_pathways' => $work['contribution_pathways'] ?? [],
        ], JSON_UNESCAPED_UNICODE),
        'raw_data_json'  => json_encode($work, JSON_UNESCAPED_UNICODE),
        'updated_at'     => date('Y-m-d H:i:s'),
    ], ['doi']);
    $counts['publications']++;

    $detailed = $work['detailed_analysis'] ?? [];
    if (is_array($detailed)) {
        foreach ($detailed as $sdgKey => $analysis) {
            $sdgNumber = (int) preg_replace('/[^0-9]/', '', (string) $sdgKey);
            if ($sdgNumber < 1 || $sdgNumber > 17) continue;

            $db->upsert('work_sdgs', [
                'doi'                   => $doi,
                'sdg_number'            => $sdgNumber,
                'sdg_version'           => substr($sdgVersion, 0, 10),
                'confidence'            => $analysis['score'] ?? null,
                'classification_detail' => json_encode($analysis, JSON_UNESCAPED_UNICODE),
                'classified_at'         => date('Y-m-d H:i:s'),
            ], ['doi', 'sdg_number', 'sdg_version']);
            $counts['sdg_links']++;
        }
    }

    return true;
}

/** publication_authors has no unique key in the schema, so dedupe in application code. */
function linkPublicationAuthor(
    Connection $db,
    string $doi,
    ?string $orcid,
    ?string $name,
    int $sequence,
    bool $isCorresponding,
    array &$counts
): void {
    if ($doi === '') return;

    if ($orcid) {
        $existing = $db->fetchOne(
            'SELECT id FROM publication_authors WHERE doi = ? AND orcid = ? LIMIT 1',
            [$doi, $orcid]
        );
    } else {
        $existing = $db->fetchOne(
            'SELECT id FROM publication_authors WHERE doi = ? AND name = ? LIMIT 1',
            [$doi, (string) $name]
        );
    }
    if ($existing) return;

    $db->insert('publication_authors', [
        'doi'              => $doi,
        'orcid'            => $orcid,
        'name'             => substr((string) ($name ?: $orcid ?: 'Unknown'), 0, 255),
        'sequence'         => max(1, $sequence),
        'is_corresponding' => $isCorresponding ? 1 : 0,
    ]);
    $counts['authors_linked']++;
}

// =================================================================
// FINALIZE — aggregate work_sdgs into researcher_sdg_expertise
// (mirrors what SDG_Classification_API's ?action=summary computes on the fly)
// =================================================================

function finalizeSdgExpertise(): array
{
    $db = Connection::getInstance();

    $sql = "
        INSERT INTO researcher_sdg_expertise (orcid, sdg_number, expertise_level, publications_count)
        SELECT
            pa.orcid,
            ws.sdg_number,
            CASE
                WHEN AVG(ws.confidence) >= 0.60 THEN 'expert'
                WHEN AVG(ws.confidence) >= 0.35 THEN 'intermediate'
                ELSE 'beginner'
            END AS expertise_level,
            COUNT(DISTINCT ws.doi) AS publications_count
        FROM work_sdgs ws
        INNER JOIN publication_authors pa ON pa.doi = ws.doi
        WHERE pa.orcid IS NOT NULL
        GROUP BY pa.orcid, ws.sdg_number
        ON DUPLICATE KEY UPDATE
            expertise_level    = VALUES(expertise_level),
            publications_count = VALUES(publications_count),
            updated_at         = NOW()
    ";

    $stmt = $db->query($sql);

    return [
        'status'  => 'success',
        'message' => 'researcher_sdg_expertise diperbarui dari work_sdgs + publication_authors',
        'rows_affected' => $stmt->rowCount(),
    ];
}

// =================================================================
// HTML CONTROL PANEL
// =================================================================

function renderPage(string $key): void
{
    header('Content-Type: text/html; charset=utf-8');
    $keyAttr = htmlspecialchars($key, ENT_QUOTES);
    ?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Sciecola — Cache to DB Migrator</title>
<style>
body{font-family:monospace;background:#1a1a1a;color:#ddd;padding:20px}
.container{max-width:960px;margin:0 auto;background:#2d2d2d;padding:20px;border:1px solid #444;border-radius:8px}
input[type=text]{background:#111;border:1px solid #555;color:#ddd;padding:8px;width:320px;border-radius:4px}
button{background:#ff4757;color:#fff;border:none;padding:12px 24px;cursor:pointer;font-size:16px;font-weight:bold;border-radius:4px;margin-top:10px}
button:hover{background:#ff6b81}
button:disabled{background:#555;cursor:not-allowed}
.log-box{height:420px;overflow-y:auto;background:#000;border:1px solid #555;margin-top:15px;padding:10px;font-size:13px;line-height:1.5;border-radius:4px}
.ok{color:#2ed573;display:block;border-bottom:1px dashed #333;padding-bottom:2px}
.err{color:#ff4757;display:block}
.phase{color:#1e90ff;font-weight:bold;margin-top:10px;display:block}
#status{margin-top:15px;font-size:1.1em;font-weight:bold}
</style>
</head>
<body>
<div class="container">
  <h2>🗄️ Sciecola — Cache to Database Migrator</h2>
  <p>Memindahkan cache SDG Classification API (orcid_init / orcid_batch / orcid legacy / article) ke database <code>sangia_ecosystem</code> secara bertahap, anti-timeout.</p>

  <div>
    <label>Migration key: </label>
    <input type="text" id="key" value="<?php echo $keyAttr; ?>" placeholder="isi CACHE_MIGRATION_KEY dari .env">
    <br>
    <button onclick="checkStatus()">CEK STATUS CACHE</button>
    <button onclick="start()" id="btnStart">MULAI MIGRASI</button>
  </div>

  <div id="status">Status: menunggu instruksi...</div>
  <div class="log-box" id="logs"></div>
</div>

<script>
function key() { return document.getElementById('key').value.trim(); }

function checkStatus() {
    setStatus('Mengecek cache & koneksi database...', '#1e90ff');
    fetch('?action=status&key=' + encodeURIComponent(key()))
        .then(r => r.json())
        .then(d => {
            if (d.status !== 'success') { log('[ERROR] ' + d.message, 'err'); return; }
            log('<strong>Cache:</strong> ' + JSON.stringify(d.file_counts));
            log('<strong>DB connected:</strong> ' + d.db_connected + (d.db_error ? (' — ' + d.db_error) : ''));
            setStatus('Status OK. Siap migrasi.', '#2ed573');
        })
        .catch(e => log('[ERROR] ' + e.message, 'err'));
}

function start() {
    document.getElementById('btnStart').disabled = true;
    runPhase('researchers', 0);
}

function runPhase(phase, offset) {
    setStatus('Fase "' + phase + '" — offset ' + offset + ' ...', '#1e90ff');
    fetch('?action=run&key=' + encodeURIComponent(key()) + '&phase=' + phase + '&offset=' + offset)
        .then(r => r.text())
        .then(t => { try { return JSON.parse(t); } catch (e) { throw new Error('Respon bukan JSON (kemungkinan timeout): ' + t.substring(0, 300)); } })
        .then(d => {
            if (d.status === 'error') { log('[ERROR] ' + d.message, 'err'); return; }
            if (d.processed > 0) {
                log('<span class="phase">▶ ' + phase + ' [' + d.offset + '-' + (d.offset + d.processed) + ' / ' + d.total + ']</span>');
                (d.logs || []).forEach(l => log(l));
            }
            if (!d.is_done) {
                setTimeout(() => runPhase(phase, d.next_offset), 400);
            } else if (phase === 'researchers') {
                runPhase('publications', 0);
            } else {
                finalize();
            }
        })
        .catch(e => log('[ERROR] ' + e.message, 'err'));
}

function finalize() {
    setStatus('Merangkum SDG expertise per peneliti...', '#1e90ff');
    fetch('?action=finalize&key=' + encodeURIComponent(key()))
        .then(r => r.json())
        .then(d => {
            log('<strong>' + (d.message || d.status) + '</strong> (' + (d.rows_affected ?? 0) + ' baris)');
            setStatus('🔥 MIGRASI SELESAI.', '#2ed573');
            document.getElementById('btnStart').disabled = false;
        })
        .catch(e => log('[ERROR] ' + e.message, 'err'));
}

function log(html, cls) {
    const div = document.createElement('div');
    div.className = cls || 'ok';
    div.innerHTML = html;
    const box = document.getElementById('logs');
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function setStatus(text, color) {
    const el = document.getElementById('status');
    el.innerText = 'Status: ' + text;
    el.style.color = color;
}
</script>
</body>
</html>
    <?php
}