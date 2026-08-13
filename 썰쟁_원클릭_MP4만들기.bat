@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio One-Click MP4

rem Create/update Desktop shortcut in the background.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_desktop_shortcut.ps1" >nul 2>&1

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
