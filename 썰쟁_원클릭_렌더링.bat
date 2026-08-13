@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio One-Click Render
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
