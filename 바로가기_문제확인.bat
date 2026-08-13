@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ROOT=%CD%
echo.
if exist "썰쟁_원클릭_MP4만들기.bat" (
  echo One-click launcher: OK
) else (
  echo One-click launcher: MISSING
)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Environment]::GetFolderPath('Desktop')"
echo.
pause
