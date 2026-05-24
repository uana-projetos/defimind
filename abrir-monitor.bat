@echo off
set "FILE=%~dp0index.html"

:: Tenta Chrome nos caminhos mais comuns
set "CHROME1=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "CHROME2=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
set "CHROME3=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME1%" (
  start "" "%CHROME1%" "%FILE%"
  goto :end
)
if exist "%CHROME2%" (
  start "" "%CHROME2%" "%FILE%"
  goto :end
)
if exist "%CHROME3%" (
  start "" "%CHROME3%" "%FILE%"
  goto :end
)

:: Chrome não encontrado — abre no navegador padrão
echo Chrome nao encontrado. Abrindo no navegador padrao...
start "" "%FILE%"

:end
