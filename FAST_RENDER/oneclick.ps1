$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms

$base = Split-Path -Parent $MyInvocation.MyCommand.Path

function Pick-One($title, $filter) {
    $d = New-Object System.Windows.Forms.OpenFileDialog
    $d.Title = $title
    $d.Filter = $filter
    $d.Multiselect = $false
    if ($d.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { throw "선택 취소" }
    return $d.FileName
}

function Pick-Many($title, $filter) {
    $d = New-Object System.Windows.Forms.OpenFileDialog
    $d.Title = $title
    $d.Filter = $filter
    $d.Multiselect = $true
    if ($d.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { throw "선택 취소" }
    return $d.FileNames
}

function Pick-Folder($title) {
    $d = New-Object System.Windows.Forms.FolderBrowserDialog
    $d.Description = $title
    $d.ShowNewFolderButton = $true
    if ($d.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { throw "선택 취소" }
    return $d.SelectedPath
}

Write-Host "[1/5] Studio에서 받은 autoedit-plan.json 선택" -ForegroundColor Cyan
$plan = Pick-One "autoedit-plan.json 선택" "JSON (*.json)|*.json"
Write-Host "[2/5] 음성 MP3 선택" -ForegroundColor Cyan
$audio = Pick-One "음성 MP3 선택" "MP3 (*.mp3)|*.mp3|오디오 (*.wav;*.m4a)|*.wav;*.m4a"
Write-Host "[3/5] SRT 선택" -ForegroundColor Cyan
$srt = Pick-One "자막 SRT 선택" "SRT (*.srt)|*.srt"
Write-Host "[4/5] 이미지 여러 장 선택" -ForegroundColor Cyan
$images = Pick-Many "사용 이미지 선택 (Ctrl/Shift로 여러 장)" "이미지 (*.png;*.jpg;*.jpeg;*.webp)|*.png;*.jpg;*.jpeg;*.webp"
Write-Host "[5/5] 완성 MP4 저장 폴더 선택" -ForegroundColor Cyan
$outDir = Pick-Folder "완성 MP4를 저장할 폴더 선택"

# Clean only prior input/output artifacts; keep scripts.
Get-ChildItem $base -File | Where-Object {
    $_.Extension -in ".json",".mp3",".wav",".m4a",".srt",".png",".jpg",".jpeg",".webp",".mp4"
} | Remove-Item -Force -ErrorAction SilentlyContinue

Copy-Item $plan (Join-Path $base "autoedit-plan.json") -Force
Copy-Item $audio $base -Force
Copy-Item $srt $base -Force
foreach ($img in $images) { Copy-Item $img $base -Force }

Write-Host ""
Write-Host "파일 준비 완료. GPU 자동 감지 후 렌더링 시작..." -ForegroundColor Green
Push-Location $base
try {
    python fast_render.py
    if ($LASTEXITCODE -ne 0) { throw "렌더링 실패 (코드 $LASTEXITCODE)" }

    $result = Get-ChildItem $base -File -Filter "*완성*.mp4" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $result) { throw "완성 MP4를 찾지 못했습니다." }

    $safeName = [IO.Path]::GetFileNameWithoutExtension($audio) + "_완성.mp4"
    $dest = Join-Path $outDir $safeName
    Copy-Item $result.FullName $dest -Force
    Write-Host ""
    Write-Host "완료: $dest" -ForegroundColor Green
    Start-Process explorer.exe "/select,`"$dest`""
}
finally {
    Pop-Location
}
