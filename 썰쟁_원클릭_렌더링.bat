@echo off
chcp 65001 >nul
title 썰쟁 Studio 원클릭 렌더링
cd /d "%~dp0"

echo ==============================================
echo        썰쟁 Studio - 원클릭 고속 렌더링
echo ==============================================
echo.
echo MP3, SRT, 이미지, autoedit-plan.json 을 선택하면
echo FAST_RENDER 폴더로 자동 복사한 뒤 렌더링합니다.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
if errorlevel 1 (
  echo.
  echo [오류] 원클릭 작업이 중단되었습니다.
)
echo.
pause
