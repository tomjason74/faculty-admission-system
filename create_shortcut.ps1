Add-Type -AssemblyName System.Drawing
$imagePath = "c:\Users\Tom Jason\Desktop\Faculty-Admission-System\public\images\pup-logo.png"
$iconPath = "c:\Users\Tom Jason\Desktop\Faculty-Admission-System\public\images\pup-favicon.ico"

try {
    $img = [System.Drawing.Image]::FromFile($imagePath)
    $bitmap = New-Object System.Drawing.Bitmap($img, 64, 64)
    $iconHandle = $bitmap.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($iconHandle)
    $fs = New-Object System.IO.FileStream($iconPath, [System.IO.FileMode]::Create)
    $icon.Save($fs)
    $fs.Close()
    $icon.Dispose()
    $bitmap.Dispose()
    $img.Dispose()
} catch {
    Write-Host "Failed to convert image: $_"
}

$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("c:\Users\Tom Jason\Desktop\Faculty Admission System.lnk")
$Shortcut.TargetPath = "c:\Users\Tom Jason\Desktop\Faculty-Admission-System\start_system.bat"
$Shortcut.WorkingDirectory = "c:\Users\Tom Jason\Desktop\Faculty-Admission-System"
$Shortcut.IconLocation = $iconPath
$Shortcut.Save()
