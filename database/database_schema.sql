-- ============================================================
-- Sangia Scieco – Skema Database
-- MySQL 8.0+ / MariaDB 10.6+
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── Tabel Autentikasi (Delight-IM/Auth) ─────────────────────
-- Tabel ini dibuat otomatis oleh library Delight-IM.
-- Jalankan: php -r "require 'vendor/autoload.php'; (new \Delight\Auth\Auth(...))->install();"

-- ── Institusi ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `institutions` (
    `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(255) NOT NULL,
    `acronym`           VARCHAR(20)  DEFAULT NULL,
    `type`              ENUM('universitas','institut','politeknik','sekolah_tinggi','akademi','lembaga_riset','lainnya') DEFAULT 'universitas',
    `province`          VARCHAR(100) DEFAULT NULL,
    `city`              VARCHAR(100) DEFAULT NULL,
    `sinta_id`          VARCHAR(50)  DEFAULT NULL UNIQUE,
    `scopus_affil_id`   VARCHAR(50)  DEFAULT NULL,
    `total_researchers` INT UNSIGNED DEFAULT 0,
    `avg_impact_score`  DECIMAL(8,4) DEFAULT 0.0000,
    `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_province (`province`),
    INDEX idx_sinta    (`sinta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Peneliti ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `researchers` (
    `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `orcid`            VARCHAR(20)  NOT NULL UNIQUE,
    `name`             VARCHAR(255) NOT NULL,
    `affiliation_id`   INT UNSIGNED DEFAULT NULL,
    `sinta_id`         VARCHAR(50)  DEFAULT NULL,
    `scopus_id`        VARCHAR(50)  DEFAULT NULL,
    `research_field`   VARCHAR(100) DEFAULT NULL,
    `biography`        TEXT         DEFAULT NULL,
    `h_index`          SMALLINT UNSIGNED DEFAULT 0,
    `i10_index`        SMALLINT UNSIGNED DEFAULT 0,
    `total_citations`  INT UNSIGNED DEFAULT 0,
    `works_count`      SMALLINT UNSIGNED DEFAULT 0,
    `impact_score`     DECIMAL(8,4) DEFAULT 0.0000,
    `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`affiliation_id`) REFERENCES `institutions`(`id`) ON DELETE SET NULL,
    INDEX idx_orcid         (`orcid`),
    INDEX idx_impact_score  (`impact_score` DESC),
    INDEX idx_research_field(`research_field`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Link User–Peneliti ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `user_researcher_links` (
    `user_id`       INT UNSIGNED NOT NULL,
    `researcher_id` INT UNSIGNED NOT NULL,
    `linked_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `researcher_id`),
    FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Jurnal ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `journals` (
    `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title`           VARCHAR(500) NOT NULL,
    `issn`            VARCHAR(9)   DEFAULT NULL,
    `e_issn`          VARCHAR(9)   DEFAULT NULL,
    `publisher`       VARCHAR(255) DEFAULT NULL,
    `sinta_rank`      TINYINT UNSIGNED DEFAULT NULL COMMENT '1-6',
    `sinta_score`     DECIMAL(10,4)    DEFAULT NULL,
    `scopus_sjr`      DECIMAL(10,4)    DEFAULT NULL,
    `wos_jif`         DECIMAL(10,4)    DEFAULT NULL,
    `is_predatory`    TINYINT(1)       DEFAULT 0,
    `total_articles`  INT UNSIGNED     DEFAULT 0,
    `created_at`      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      DATETIME         DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_issn  (`issn`),
    INDEX idx_sinta_rank(`sinta_rank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Artikel ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `articles` (
    `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title`            TEXT         NOT NULL,
    `doi`              VARCHAR(255) DEFAULT NULL UNIQUE,
    `journal_id`       INT UNSIGNED DEFAULT NULL,
    `year`             SMALLINT UNSIGNED DEFAULT NULL,
    `abstract`         TEXT         DEFAULT NULL,
    `citations`        INT UNSIGNED DEFAULT 0,
    `social_mentions`  INT UNSIGNED DEFAULT 0,
    `practical_uses`   INT UNSIGNED DEFAULT 0,
    `impact_score`     DECIMAL(8,4) DEFAULT 0.0000,
    `authors_snapshot` TEXT         DEFAULT NULL COMMENT 'JSON: [{name, orcid}]',
    `sdg_tags`         TEXT         DEFAULT NULL COMMENT 'JSON: [{sdg, score}]',
    `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`journal_id`) REFERENCES `journals`(`id`) ON DELETE SET NULL,
    INDEX idx_year         (`year`),
    INDEX idx_citations    (`citations` DESC),
    INDEX idx_impact_score (`impact_score` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Relasi Artikel–Peneliti ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `article_authors` (
    `article_id`    INT UNSIGNED NOT NULL,
    `researcher_id` INT UNSIGNED NOT NULL,
    `author_order`  TINYINT UNSIGNED DEFAULT 1,
    PRIMARY KEY (`article_id`, `researcher_id`),
    FOREIGN KEY (`article_id`)    REFERENCES `articles`(`id`)    ON DELETE CASCADE,
    FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Impact Scores (4 Pilar) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `impact_scores` (
    `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `entity_type`     ENUM('researcher','article','institution','journal') NOT NULL,
    `entity_id`       INT UNSIGNED NOT NULL,
    `pillar_academic` DECIMAL(8,4) NOT NULL DEFAULT 0.0000 COMMENT '40% bobot',
    `pillar_social`   DECIMAL(8,4) NOT NULL DEFAULT 0.0000 COMMENT '25% bobot',
    `pillar_economic` DECIMAL(8,4) NOT NULL DEFAULT 0.0000 COMMENT '20% bobot',
    `pillar_sdg`      DECIMAL(8,4) NOT NULL DEFAULT 0.0000 COMMENT '15% bobot',
    `composite_score` DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    `sdg_tags`        TEXT         DEFAULT NULL COMMENT 'JSON array SDG matches',
    `calculated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity        (`entity_type`, `entity_id`),
    INDEX idx_calculated_at (`calculated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Notifikasi ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `notifications` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`    INT UNSIGNED NOT NULL,
    `message`    TEXT         NOT NULL,
    `link`       VARCHAR(500) DEFAULT NULL,
    `is_read`    TINYINT(1)   DEFAULT 0,
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_unread (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Log Aktivitas ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT UNSIGNED DEFAULT NULL,
    `action`      VARCHAR(100) NOT NULL,
    `description` TEXT         DEFAULT NULL,
    `ip_address`  VARCHAR(45)  DEFAULT NULL,
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cache profil author (ORCID + Scopus) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS author_profiles_cache (
    orcid        VARCHAR(19)  NOT NULL,
    person_data  JSON         DEFAULT NULL COMMENT 'Data person dari ORCID',
    works_data   JSON         DEFAULT NULL COMMENT 'Array karya dari ORCID',
    scopus_data  JSON         DEFAULT NULL COMMENT 'Data author + publikasi dari Scopus',
    fetched_at   DATETIME     NOT NULL,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (orcid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cache sitasi per DOI ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS citations_cache (
    doi          VARCHAR(255) NOT NULL,
    metadata     JSON         DEFAULT NULL COMMENT 'Metadata artikel',
    citations    JSON         DEFAULT NULL COMMENT 'Array citing DOI per sumber',
    counts       JSON         DEFAULT NULL COMMENT '{opencitations: N, crossref: N, ...}',
    fetched_at   DATETIME     NOT NULL,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (doi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cache metrik jurnal (Scopus + SINTA) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_profiles_cache (
    issn         VARCHAR(10)  NOT NULL,
    scopus_data  JSON         DEFAULT NULL COMMENT 'CiteScore, SJR, SNIP, quartile',
    sinta_data   JSON         DEFAULT NULL COMMENT 'Grade SINTA, sinta_id, impact',
    fetched_at   DATETIME     NOT NULL,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (issn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Riwayat analisis (SDG, impact, trend, policy) ─────────────────────────
CREATE TABLE IF NOT EXISTS analysis_history (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    orcid         VARCHAR(19)  DEFAULT NULL,
    analysis_type VARCHAR(50)  NOT NULL COMMENT 'sdg|impact|trend|recommendation',
    result        JSON         NOT NULL,
    calculated_at DATETIME     NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_orcid (orcid),
    INDEX idx_type  (analysis_type),
    INDEX idx_date  (calculated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Input data Social & Economic pillar dari user/admin/crawler ────────────
CREATE TABLE IF NOT EXISTS researcher_impact_inputs (
    id          INT          NOT NULL AUTO_INCREMENT,
    orcid       VARCHAR(19)  NOT NULL,
    input_type  ENUM('social', 'economic') NOT NULL,
    field_key   VARCHAR(50)  NOT NULL COMMENT 'media_mentions|policy_citations|industry_adoption|patents|...',
    value       DECIMAL(5,2) NOT NULL COMMENT '0.00 – 100.00',
    source      ENUM('user_input', 'crawler', 'admin', 'api') DEFAULT 'user_input',
    verified    TINYINT(1)   DEFAULT 0,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_orcid_type_field (orcid, input_type, field_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Konfigurasi bobot analisis (dikelola via Admin Panel) ──────────────────
CREATE TABLE IF NOT EXISTS analysis_weight_configs (
    id          INT          NOT NULL AUTO_INCREMENT,
    config_key  VARCHAR(50)  NOT NULL COMMENT 'sdg_v5|sdg_v4|impact_composite|...',
    weights     JSON         NOT NULL,
    updated_by  INT          DEFAULT NULL COMMENT 'FK ke users.id',
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: nilai default bobot
INSERT IGNORE INTO analysis_weight_configs (config_key, weights) VALUES
('sdg_v5', JSON_OBJECT(
    'keyword', 0.30, 'similarity', 0.30, 'substantive', 0.20, 'causal', 0.20,
    'max_sdgs', 7,
    'thresholds', JSON_OBJECT('min', 0.20, 'confidence', 0.30, 'high', 0.60)
)),
('impact_composite', JSON_OBJECT(
    'academic', 0.40, 'social', 0.25, 'economic', 0.20, 'sdg', 0.15
));

-- ── Log panggilan ke Sangia API (monitoring efisiensi) ─────────────────────
CREATE TABLE IF NOT EXISTS api_call_logs (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    user_id      INT          DEFAULT NULL,
    endpoint     VARCHAR(100) NOT NULL,
    params       JSON         DEFAULT NULL,
    status       VARCHAR(20)  NOT NULL COMMENT 'success|error|processing',
    duration_ms  INT          DEFAULT NULL,
    data_source  VARCHAR(50)  DEFAULT NULL COMMENT 'wizdam_scola_db|orcid_api|scopus_api|...',
    called_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_user    (user_id),
    INDEX idx_called  (called_at),
    INDEX idx_source  (data_source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;
