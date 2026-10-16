@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio 30sec Test
set SSEOLJENG_TEST_30S=1
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
