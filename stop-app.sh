#!/bin/bash

# Script to stop the QuizMaster application

# Find and kill the backend process
BACKEND_PID=$(ps aux | grep "quizmaster-api" | grep -v grep | awk '{print $2}')
if [ -n "$BACKEND_PID" ]; then
  echo "Stopping backend (PID: $BACKEND_PID)..."
  kill $BACKEND_PID
else
  echo "Backend is not running."
fi

# Find and kill the frontend process
FRONTEND_PID=$(ps aux | grep "next start" | grep -v grep | awk '{print $2}')
if [ -n "$FRONTEND_PID" ]; then
  echo "Stopping frontend (PID: $FRONTEND_PID)..."
  kill $FRONTEND_PID
else
  echo "Frontend is not running."
fi

echo "Application stopped."
