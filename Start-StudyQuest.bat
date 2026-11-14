@echo off
title StudyQuest AI - Launcher
cd /d "%~dp0"

echo ========================================================
echo   StudyQuest AI - "Learn Your Way. Play Your Way."
echo ========================================================
echo.
echo Checking database and launching development server...
echo URL: http://localhost:3000
echo.

timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
npm.cmd run dev
