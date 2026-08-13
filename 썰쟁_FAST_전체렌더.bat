@echo off
chcp 65001 >nul
cd /d "%~dp0"
set SSEOLJENG_SPEED_MODE=FAST
set SSEOLJENG_TEST_30S=
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
