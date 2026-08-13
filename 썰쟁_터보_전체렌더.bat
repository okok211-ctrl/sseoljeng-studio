@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio v23.6 TURBO Full Render
set SSEOLJENG_TEST_30S=
set SSEOLJENG_SPEED_MODE=TURBO
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
