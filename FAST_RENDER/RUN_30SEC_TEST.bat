@echo off
chcp 65001 >nul
cd /d "%~dp0"
set SSEOLJENG_TEST_30S=1
echo ==========================================
echo  Sseoljeng Studio - 30 sec test render
echo ==========================================
python fast_render.py
