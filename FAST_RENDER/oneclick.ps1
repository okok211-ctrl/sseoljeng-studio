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
$outDir = Pick-Folder "프로젝트 작업폴더를 만들 상위 폴더 선택"

# Create ONE workspace folder for this render job.
$audioStem = [IO.Path]::GetFileNameWithoutExtension($audioSrc)
$invalid = [IO.Path]::GetInvalidFileNameChars()
foreach ($ch in $invalid) { $audioStem = $audioStem.Replace([string]$ch, "_") }
if ($audioStem.Length -gt 50) { $audioStem = $audioStem.Substring(0,50) }
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$projectDir = Join-Path $outDir ("썰쟁_" + $audioStem + "_" + $stamp)
$inputDir = Join-Path $projectDir "01_INPUT"
$outputDir = Join-Path $projectDir "02_OUTPUT"
New-Item -ItemType Directory -Path $inputDir -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Write-Host ""
Write-Host "[작업폴더] $projectDir" -ForegroundColor Green


# Stage every selected source in Windows TEMP FIRST.
# This prevents the old bug where selecting an SRT/MP3/image already inside FAST_RENDER
# caused cleanup to delete the source before Copy-Item could copy it.
$stage = Join-Path ([IO.Path]::GetTempPath()) ("sseoljeng_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stage -Force | Out-Null

$planStage = Join-Path $stage "source_plan.json"
Copy-Item -LiteralPath $planSrc -Destination $planStage -Force

$audioName = [IO.Path]::GetFileName($audioSrc)
$srtName   = [IO.Path]::GetFileName($srtSrc)
$imageNames = @()

$audioStage = Join-Path $stage $audioName
$srtStage   = Join-Path $stage $srtName
Copy-Item -LiteralPath $audioSrc -Destination $audioStage -Force
Copy-Item -LiteralPath $srtSrc   -Destination $srtStage   -Force

$imageStages = @()
foreach ($img in $imageSrcs) {
    $nm = [IO.Path]::GetFileName($img)
    $dst = Join-Path $stage $nm
    Copy-Item -LiteralPath $img -Destination $dst -Force
    $imageNames += $nm
    $imageStages += $dst
}


# Load the Studio render plan BEFORE copying images so the renderer can preserve
# the exact image order shown in Studio.
$plan = Get-Content -LiteralPath $planStage -Raw -Encoding UTF8 | ConvertFrom-Json

# Build selected-image lookup by basename.
$selectedByName = @{}
foreach ($imgStage in $imageStages) {
    $bn = [IO.Path]::GetFileName($imgStage)
    $selectedByName[$bn] = $imgStage
}

$orderedImageStages = @()
$orderedImageNames = @()

if ($plan.images -and $plan.images.Count -gt 0) {
    foreach ($plannedName in $plan.images) {
        $bn = [IO.Path]::GetFileName([string]$plannedName)
        if ($selectedByName.ContainsKey($bn)) {
            $orderedImageStages += $selectedByName[$bn]
            $orderedImageNames += $bn
        }
    }
}

# Fallback only if plan-based matching failed.
if ($orderedImageStages.Count -ne $imageStages.Count) {
    $orderedImageStages = @($imageStages | Sort-Object { [IO.Path]::GetFileName($_) })
    $orderedImageNames = @($orderedImageStages | ForEach-Object { [IO.Path]::GetFileName($_) })
    Write-Host "[주의] Studio 설계 이미지명과 선택 파일명이 완전히 일치하지 않아 파일명 순으로 정렬합니다." -ForegroundColor Yellow
} else {
    Write-Host "[이미지 순서] Studio 렌더링 설계 순서를 그대로 사용합니다." -ForegroundColor Green
}

Write-Host ""
for ($i=0; $i -lt $orderedImageNames.Count; $i++) {
    Write-Host ("  {0}. {1}" -f ($i+1), $orderedImageNames[$i])
}
Write-Host ""

# Now it is safe to clean prior render inputs/outputs.
Get-ChildItem $base -File | Where-Object {
    $_.Extension.ToLower() -in ".json",".mp3",".wav",".m4a",".srt",".png",".jpg",".jpeg",".webp",".mp4"
} | Remove-Item -Force -ErrorAction SilentlyContinue

# Restore staged inputs into FAST_RENDER.
Copy-Item -LiteralPath $audioStage -Destination (Join-Path $base $audioName) -Force
Copy-Item -LiteralPath $srtStage   -Destination (Join-Path $base $srtName)   -Force
foreach ($imgStage in $orderedImageStages) {
    Copy-Item -LiteralPath $imgStage -Destination $base -Force
}


# Keep one clean project workspace so old/new jobs do not get mixed.
Copy-Item -LiteralPath (Join-Path $base $audioName) -Destination $inputDir -Force
Copy-Item -LiteralPath (Join-Path $base $srtName) -Destination $inputDir -Force
foreach ($imgStage in $orderedImageStages) {
    Copy-Item -LiteralPath $imgStage -Destination $inputDir -Force
}

# Rewrite the plan to EXACT filenames that now exist in FAST_RENDER.
$plan.audio = $audioName
$plan.srt = $srtName
$plan.images = @($orderedImageNames)

# Keep scene image indexes, but validate they fit the newly selected image count.
if ($plan.scenes) {
    foreach ($sc in $plan.scenes) {
        if ([int]$sc.i -ge $orderedImageNames.Count) {
            throw "설계의 이미지 번호가 선택한 이미지 수보다 큽니다. Studio에서 사용한 이미지와 같은 개수를 선택하세요."
        }
    }
}

$fixedPlan = Join-Path $base "autoedit-plan.json"
$jsonText = $plan | ConvertTo-Json -Depth 20
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($fixedPlan, $jsonText, $utf8NoBom)
Copy-Item -LiteralPath $fixedPlan -Destination (Join-Path $inputDir "autoedit-plan.json") -Force

Write-Host ""
Write-Host "파일명 연결 완료." -ForegroundColor Green
Write-Host "  Audio : $audioName"
Write-Host "  SRT   : $srtName"
Write-Host "  Images: $($orderedImageNames.Count)"
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

    $dest = Join-Path $outputDir $safeName
    Copy-Item $result.FullName $dest -Force

    Write-Host ""
    Write-Host "완료: $dest" -ForegroundColor Green

    $latestFile = Join-Path $outDir "썰쟁_최근작업폴더.txt"
    [System.IO.File]::WriteAllText($latestFile, $projectDir, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "작업폴더: $projectDir" -ForegroundColor Green

    Start-Process explorer.exe "`"$projectDir`""
}
finally {
    Pop-Location
    if ($stage -and (Test-Path -LiteralPath $stage)) {
        Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
    }
}
