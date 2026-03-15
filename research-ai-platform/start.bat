@echo off
echo ================================
echo   Starting PaperPilot Services
echo ================================

echo.
echo [1/7] Starting API Gateway (port 8000)...
start "API Gateway" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\services\api-gateway && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/7] Starting Paper Service (port 8001)...
start "Paper Service" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\services\paper-service && uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

timeout /t 2 /nobreak >nul

echo [3/7] Starting AI Service (port 8002)...
start "AI Service" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\services\ai-service && uvicorn main:app --host 0.0.0.0 --port 8002 --reload"

timeout /t 2 /nobreak >nul

echo [4/7] Starting Vector Service (port 8003)...
start "Vector Service" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\services\vector-service && uvicorn main:app --host 0.0.0.0 --port 8003 --reload"

timeout /t 2 /nobreak >nul

echo [5/7] Starting Citation Service (port 8004)...
start "Citation Service" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\services\citation-service && uvicorn main:app --host 0.0.0.0 --port 8004 --reload"

timeout /t 2 /nobreak >nul

echo [6/7] Starting Auth Service (port 8005)...
start "Auth Service" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\services\auth-service && npm run dev"

timeout /t 2 /nobreak >nul

echo [7/7] Starting Frontend (port 5173)...
start "Frontend" cmd /k "cd /d c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ================================
echo   All services started!
echo ================================
echo.
echo   API Gateway  → http://localhost:8000
echo   Paper Service → http://localhost:8001
echo   AI Service   → http://localhost:8002
echo   Vector Service → http://localhost:8003
echo   Citation Service → http://localhost:8004
echo   Auth Service → http://localhost:8005
echo   Frontend     → http://localhost:5173
echo.
echo   Open http://localhost:5173 in your browser
echo ================================
pause