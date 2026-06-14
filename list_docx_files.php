<?php
$zip = new ZipArchive;
if ($zip->open('REquest-Letter-for-2nd-Sem-PROF-RENEWAL-SY-2425-UNDERGRAD.docx') === true) {
    $xml = $zip->getFromName('word/header1.xml');
    if ($xml) {
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadXML($xml);
        libxml_clear_errors();
        echo $dom->textContent . "\n";
    } else {
        echo "No header1.xml found.\n";
    }
    $zip->close();
} else {
    echo "Failed to open docx file.\n";
}
