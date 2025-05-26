#!/bin/bash

set -e

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  exit 0
}

trap cleanup SIGINT

cd backend || { exit 1; }
npm install
npx sequelize db:migrate
npm start &
BACKEND_PID=$!
cd ..

cd frontend || { exit 1; }
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Application is starting..."
echo "Backend running on http://localhost:3000"
echo "Frontend running on http://localhost:3001"
echo "Press Ctrl+C to stop both servers."

wait