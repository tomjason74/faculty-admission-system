@echo off
title Faculty Admission System
echo Starting the Faculty Admission System...
cd /d "%~dp0"
echo Opening browser to http://localhost:8000
start http://localhost:8000
echo Booting up servers (Laravel and Vite)...
npm run start-system
