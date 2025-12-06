#!/bin/bash
# Run the FastAPI app using Uvicorn (Production Server)

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run Uvicorn
# --host 0.0.0.0: Bind to all interfaces
# --port 5004: Bind to port 5004
# --workers 1: Use 1 worker (sufficient for local use)
echo "Starting production server with Uvicorn on port 5004..."
uvicorn app:app --host 0.0.0.0 --port 5004 --workers 1
