$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Join-Path $root "썰쟁_원클릭_MP4만들기.bat"

if (-not (Test-Path -LiteralPath $target)) {
    throw "원클릭 실행 파일을 찾지 못했습니다: $target"
}

$desktop = [Environment]::GetFolderPath("Desktop")
$link = Join-Path $desktop "썰쟁 Studio 원클릭 MP4.lnk"

# Existing shortcut is updated instead of duplicated.
$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($link)
$sc.TargetPath = $target
$sc.WorkingDirectory = $root
$sc.Description = "썰쟁 Studio 원클릭 MP4 렌더링"
$sc.WindowStyle = 1
$sc.Save()

Write-Host ""
Write-Host "바탕화면 바로가기 생성 완료:" -ForegroundColor Green
Write-Host $link -ForegroundColor Cyan

# Open Desktop and select the shortcut when possible.
Start-Process explorer.exe $desktop
