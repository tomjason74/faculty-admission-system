<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Log credentials to a text file safely.
     */
    protected function logCredentials(string $message): void
    {
        $logFile = base_path('credentials.txt');
        // If base path is not writable (e.g. in a locked production container),
        // fallback to the writable storage path.
        if (!is_writable($logFile) && (!file_exists($logFile) || !is_writable(dirname($logFile)))) {
            $logFile = storage_path('credentials.txt');
        }

        try {
            file_put_contents($logFile, $message . "\n", FILE_APPEND);
        } catch (\Exception $e) {
            // Silently catch write errors to avoid crashing production flow
            logger()->error("Failed to write to credentials.txt: " . $e->getMessage());
        }
    }
}
