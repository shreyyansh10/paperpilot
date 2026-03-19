# PaperPilot - Start All Services in VS Code Terminals

Write-Host "Starting PaperPilot Services..." -ForegroundColor Cyan

# Activate venv
& "c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform\.venv\Scripts\Activate.ps1"

# Function to start service in new VS Code terminal
function Start-Service {
    param($name, $command, $path)
    Write-Host "Starting $name..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$path'; $command"
}

$root = "c:\Users\inspi\OneDrive\Desktop\PAPERPILOT\research-ai-platform"

# Start all Python services
Start-Service "API Gateway" "uvicorn main:app --host 0.0.0.0 --port 8000 --reload" "$root\services\api-gateway"
Start-Sleep -Seconds 1
Start-Service "Paper Service" "uvicorn main:app --host 0.0.0.0 --port 8001 --reload" "$root\services\paper-service"
Start-Sleep -Seconds 1
Start-Service "AI Service" "uvicorn main:app --host 0.0.0.0 --port 8002 --reload" "$root\services\ai-service"
Start-Sleep -Seconds 1
Start-Service "Vector Service" "uvicorn main:app --host 0.0.0.0 --port 8003 --reload" "$root\services\vector-service"
Start-Sleep -Seconds 1
Start-Service "Citation Service" "uvicorn main:app --host 0.0.0.0 --port 8004 --reload" "$root\services\citation-service"
Start-Sleep -Seconds 1

# Start Node services
Start-Service "Auth Service" "npm run dev" "$root\services\auth-service"
Start-Sleep -Seconds 1

# Start Frontend
Start-Service "Frontend" "npm run dev" "$root\frontend"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor Yellow
