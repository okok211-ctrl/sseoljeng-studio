@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio v23.7 One-Click MP4

rem Keep/repair Desktop shortcut.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_desktop_shortcut.ps1" >nul 2>&1

set "SSEOLJENG_SPEED_MODE="
for /f "usebackq delims=" %%M in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0render_mode_chooser.ps1"`) do set "SSEOLJENG_SPEED_MODE=%%M"

if not defined SSEOLJENG_SPEED_MODE (
  echo Render cancelled.
  exit /b 0
)

echo.
echo Selected render mode: %SSEOLJENG_SPEED_MODE%
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FAST_RENDER\oneclick.ps1"
echo.
pause
