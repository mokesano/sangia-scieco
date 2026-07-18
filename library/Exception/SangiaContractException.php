<?php
declare(strict_types=1);

namespace Sangia\Library\Exception;

/**
 * Dilempar saat response tidak sesuai kontrak.
 * Tangkap di caller untuk fallback graceful.
 */
class SangiaContractException extends \RuntimeException
{
    public function __construct(string $message)
    {
        parent::__construct("[Sangia Contract] $message");
    }
}
