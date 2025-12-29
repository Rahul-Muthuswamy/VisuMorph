@echo off
REM Kafka Consumer Startup Script for Windows
REM Activates virtual environment and starts the consumer

echo ========================================
echo VisuMorph Kafka Consumer (Windows)
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found!
    echo.
    echo Please create a virtual environment first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if activation was successful
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)

echo Virtual environment activated.
echo.

REM Run the consumer
python start_consumer.py

REM Keep window open on error
if errorlevel 1 (
    echo.
    echo [ERROR] Consumer failed to start!
    pause
)


