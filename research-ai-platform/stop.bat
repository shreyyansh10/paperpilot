@echo off
echo Stopping all PaperPilot services...
echo.

echo Killing ports 8000-8005...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 :8001 :8002 :8003 :8004 :8005" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Killing port 5173 (frontend)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All services stopped!
pause