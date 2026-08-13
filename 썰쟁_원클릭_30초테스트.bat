@echo off
chcp 65001 >nul
title 썰쟁 Studio 원클릭 30초 테스트
cd /d "%~dp0"
set SSEOLJENG_TEST_30S=1
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
