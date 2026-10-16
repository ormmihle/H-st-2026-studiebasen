@echo off
rem Starter Studiebasen: dobbeltklikk denne filen.
cd /d "%~dp0"

where py >nul 2>&1
if errorlevel 1 (
  echo Fant ikke Python. Installer Python fra https://www.python.org/downloads/ og kryss av for "Add python.exe to PATH".
  pause
  exit /b 1
)

py -m mkdocs --version >nul 2>&1
if errorlevel 1 (
  echo Installerer MkDocs for forste gang. Dette tar et minutt...
  py -m pip install -r requirements.txt
)

echo.
echo Studiebasen kjorer paa http://127.0.0.1:8000
echo Lukk dette vinduet for aa stoppe siden.
echo.
start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:8000"
py -m mkdocs serve
