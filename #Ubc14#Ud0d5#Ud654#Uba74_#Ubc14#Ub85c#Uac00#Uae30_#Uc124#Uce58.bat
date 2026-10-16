@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sseoljeng Studio Shortcut Installer
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_desktop_shortcut.ps1"
if errorlevel 1 (
  echo.
  echo Shortcut creation failed.
)
echo.
pause
