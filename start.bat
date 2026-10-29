@echo off
title Lancement de GIFTLY
color 0D

echo ========================================================
echo          LANCEMENT DE L'APPLICATION GIFTLY
echo ========================================================
echo.

cd /d C:\Users\HP\tassnim\projet
set PATH=C:\Users\HP\nodejs;%PATH%

:: 1. Verifier et demarrer MySQL via XAMPP si besoin
echo [1/3] Verification du serveur MySQL (port 3306)...
powershell -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet" | findstr /i "True" >nul
if errorlevel 1 (
    echo     Demarrage de MySQL XAMPP en arriere-plan...
    start /b "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 3 /nobreak >nul
) else (
    echo     MySQL est deja actif et connecte.
)

:: 2. Lancer le backend API MySQL sur le port 5000
echo [2/3] Lancement de l'API Backend Express (port 5000)...
start "GIFTLY - API MySQL" cmd /k "cd /d C:\Users\HP\tassnim\projet && set PATH=C:\Users\HP\nodejs;%PATH% && npm run server"

timeout /t 2 /nobreak >nul

:: 3. Lancer le frontend Vite sur le port 5173
echo [3/3] Lancement de l'application Web Frontend (port 5173)...
start "GIFTLY - Frontend React" cmd /k "cd /d C:\Users\HP\tassnim\projet && set PATH=C:\Users\HP\nodejs;%PATH% && npm run dev"

timeout /t 2 /nobreak >nul

:: 4. Ouvrir le navigateur
echo.
echo ========================================================
echo   GIFTLY est pret ! Ouverture dans le navigateur...
echo   URL : http://localhost:5173
echo   Admin : http://localhost:5173/admin
echo ========================================================
start http://localhost:5173

exit
