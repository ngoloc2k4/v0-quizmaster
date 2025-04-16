#!/bin/bash

# Script to run QuizMaster in normal (production) mode

# Set environment to production
export NODE_ENV=production

# Build frontend
echo "Building frontend in production mode..."
cd frontend
npm run build
cd ..

# Build backend
echo "Building backend in production mode..."
cd backend
./mvnw clean package -DskipTests
cd ..

# Start backend
echo "Starting backend in normal mode..."
cd backend
nohup java -jar target/quizmaster-api-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start frontend
echo "Starting frontend in production mode..."
cd frontend
nohup npm run start > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "QuizMaster is now running in normal mode!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend logs: backend/backend.log"
echo "Frontend logs: frontend/frontend.log"
echo "To stop the application, run: kill $BACKEND_PID $FRONTEND_PID"
