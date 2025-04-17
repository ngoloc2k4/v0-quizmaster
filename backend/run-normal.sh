#!/bin/bash

# Script to run the backend in normal mode without tests

echo "Building and running backend in normal mode (without tests)..."

# Set the JWT_SECRET environment variable if it's not already set
if [ -z "$JWT_SECRET" ]; then
  echo "JWT_SECRET environment variable is not set. Please set it before running this script."
  exit 1
fi

# Clean and package the application, skipping tests
./mvnw clean package -DskipTests

# Run the application with the JWT_SECRET environment variable
java -jar -Djwt.secret="$JWT_SECRET" target/quizmaster-api-0.0.1-SNAPSHOT.jar

echo "Backend is running in normal mode!"
