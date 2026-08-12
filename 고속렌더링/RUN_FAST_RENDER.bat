@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo  썰쟁 Studio v22.6 고속 FFmpeg 렌더링
echo ==========================================
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  py fast_render.py
) else (
  python fast_render.py
)
pause
