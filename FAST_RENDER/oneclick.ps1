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

Write-Host "[1/5] autoedit-plan.json 선택" -ForegroundColor Cyan
$planSrc = Pick-One "autoedit-plan.json 선택" "JSON (*.json)|*.json"

Write-Host "[2/5] 음성 MP3 선택" -ForegroundColor Cyan
$audioSrc = Pick-One "음성 MP3 선택" "MP3 (*.mp3)|*.mp3|오디오 (*.wav;*.m4a)|*.wav;*.m4a"

Write-Host "[3/5] SRT 선택" -ForegroundColor Cyan
$srtSrc = Pick-One "자막 SRT 선택" "SRT (*.srt)|*.srt"

Write-Host "[4/5] 이미지 여러 장 선택" -ForegroundColor Cyan
$imageSrcs = Pick-Many "사용 이미지 선택 (Ctrl/Shift로 여러 장)" "이미지 (*.png;*.jpg;*.jpeg;*.webp)|*.png;*.jpg;*.jpeg;*.webp"

Write-Host "[5/5] 완성 MP4 저장 폴더 선택" -ForegroundColor Cyan
$outDir = Pick-Folder "완성 MP4를 저장할 폴더 선택"

# Previous input/output artifacts only. Scripts are preserved.
Get-ChildItem $base -File | Where-Object {
    $_.Extension.ToLower() -in ".json",".mp3",".wav",".m4a",".srt",".png",".jpg",".jpeg",".webp",".mp4"
} | Remove-Item -Force -ErrorAction SilentlyContinue

# Copy using exact basenames selected by the user.
$audioName = [IO.Path]::GetFileName($audioSrc)
$srtName   = [IO.Path]::GetFileName($srtSrc)
$imageNames = @()

Copy-Item $audioSrc (Join-Path $base $audioName) -Force
Copy-Item $srtSrc   (Join-Path $base $srtName)   -Force

foreach ($img in $imageSrcs) {
    $nm = [IO.Path]::GetFileName($img)
    Copy-Item $img (Join-Path $base $nm) -Force
    $imageNames += $nm
}

# Rewrite the plan to EXACT filenames that now exist in FAST_RENDER.
$plan = Get-Content -LiteralPath $planSrc -Raw -Encoding UTF8 | ConvertFrom-Json
$plan.audio = $audioName
$plan.srt = $srtName
$plan.images = @($imageNames)

# Keep scene image indexes, but validate they fit the newly selected image count.
if ($plan.scenes) {
    foreach ($sc in $plan.scenes) {
        if ([int]$sc.i -ge $imageNames.Count) {
            throw "설계의 이미지 번호가 선택한 이미지 수보다 큽니다. Studio에서 사용한 이미지와 같은 개수를 선택하세요."
        }
    }
}

$fixedPlan = Join-Path $base "autoedit-plan.json"
$plan | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $fixedPlan -Encoding UTF8

Write-Host ""
Write-Host "파일명 연결 완료." -ForegroundColor Green
Write-Host "  Audio : $audioName"
Write-Host "  SRT   : $srtName"
Write-Host "  Images: $($imageNames.Count)"
Write-Host ""
Write-Host "GPU 자동 감지 후 렌더링 시작..." -ForegroundColor Green

Push-Location $base
try {
    $pythonCmd = $null
    if (Get-Command python -ErrorAction SilentlyContinue) { $pythonCmd = "python" }
    elseif (Get-Command py -ErrorAction SilentlyContinue) { $pythonCmd = "py" }
    else { throw "Python을 찾지 못했습니다." }

    & $pythonCmd "fast_render.py"
    if ($LASTEXITCODE -ne 0) { throw "렌더링 실패 (코드 $LASTEXITCODE)" }

    $result = Get-ChildItem $base -File -Filter "*.mp4" |
              Where-Object { $_.Name -like "*완성*" -or $_.Name -like "*30초테스트*" } |
              Sort-Object LastWriteTime -Descending |
              Select-Object -First 1

    if (-not $result) { throw "완성 MP4를 찾지 못했습니다." }

    $stem = [IO.Path]::GetFileNameWithoutExtension($audioName)
    if ($env:SSEOLJENG_TEST_30S -eq "1") {
        $safeName = "${stem}_30초테스트.mp4"
    } else {
        $safeName = "${stem}_완성.mp4"
    }

    $dest = Join-Path $outDir $safeName
    Copy-Item $result.FullName $dest -Force

    Write-Host ""
    Write-Host "완료: $dest" -ForegroundColor Green
    Start-Process explorer.exe "/select,`"$dest`""
}
finally {
    Pop-Location
}
