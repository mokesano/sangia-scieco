<?php

declare(strict_types=1);

/**
 * @file app/Http/Response.php
 *
 * Copyright (c) 2024-2026 Sangia Lumera Publishing
 * Copyright (c) 2017-2026 Rochmady and Code Lumera Teams
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class Response
 * @ingroup http
 *
 * @brief Response sederhana dengan helper untuk JSON, HTML, dan redirect.
 */

namespace Wizdam\Http;

/**
 * Response sederhana dengan helper untuk JSON, HTML, dan redirect.
 */
class Response
{
    public function __construct(
        public readonly string $body = '',
        public readonly int $statusCode = 200,
        public readonly array $headers = []
    ) {
    }

    public static function html(string $content, int $status = 200, array $headers = []): self
    {
        $headers['Content-Type'] = 'text/html; charset=utf-8';
        return new self(body: $content, statusCode: $status, headers: $headers);
    }

    public static function json(mixed $data, int $status = 200, array $headers = []): self
    {
        $headers['Content-Type'] = 'application/json';
        return new self(
            body: json_encode($data, JSON_THROW_ON_ERROR),
            statusCode: $status,
            headers: $headers
        );
    }

    public static function redirect(string $url, int $status = 302): self
    {
        return new self(body: '', statusCode: $status, headers: ['Location' => $url]);
    }

    public static function notFound(string $message = 'Not Found'): self
    {
        return self::html($message, 404);
    }

    public static function error(string $message, int $status = 500): self
    {
        return self::html($message, $status);
    }

    public function send(): void
    {
        http_response_code($this->statusCode);
        foreach ($this->headers as $name => $value) {
            header("$name: $value");
        }
        echo $this->body;
    }
}
