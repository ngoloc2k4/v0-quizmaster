#!/bin/bash

# Script to run the backend in normal mode without tests

echo "Building and running backend in normal mode (without tests)..."

# Clean and package the application, skipping tests
./mvnw clean package -DskipTests

# Run the application
java -jar target/quizmaster-api-0.0.1-SNAPSHOT.jar

echo "Backend is running in normal mode!"
