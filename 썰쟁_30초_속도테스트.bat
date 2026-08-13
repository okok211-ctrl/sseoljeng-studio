@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio v23.5 - 30sec Speed Test
set SSEOLJENG_TEST_30S=1
set SSEOLJENG_SPEED_MODE=FAST
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
