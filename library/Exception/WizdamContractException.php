<?php

namespace Wizdam\Library\Exception;

/**
 * Dilempar saat response tidak sesuai kontrak.
 * Tangkap di caller untuk fallback graceful.
 */
class WizdamContractException extends \RuntimeException
{
    public function __construct(string $message)
    {
        parent::__construct("[Wizdam Contract] $message");
    }
}
