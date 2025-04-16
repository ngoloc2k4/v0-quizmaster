#!/bin/bash

# Script to check if all required environment variables are set
# Usage: ./check-env-vars.sh [environment]
# Example: ./check-env-vars.sh production

ENV=$1
if [ -z "$ENV" ]; then
  ENV="production"
fi

echo "Checking environment variables for $ENV environment..."

# Define required environment variables
BACKEND_REQUIRED_VARS=(
  "MONGODB_URI"
  "JWT_SECRET"
  "OPENROUTER_API_KEY"
  "MAIL_HOST"
  "MAIL_PORT"
  "MAIL_USERNAME"
  "MAIL_PASSWORD"
)

FRONTEND_REQUIRED_VARS=(
  "NEXT_PUBLIC_API_URL"
)

# Load variables from .env file if it exists
if [ -f "./backend/.env.$ENV" ]; then
  source "./backend/.env.$ENV"
  echo "Loaded variables from ./backend/.env.$ENV"
else
  echo "Warning: ./backend/.env.$ENV file not found"
fi

# Check backend environment variables
echo "Checking backend environment variables..."
MISSING_VARS=0
for VAR in "${BACKEND_REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Missing required environment variable: $VAR"
    MISSING_VARS=$((MISSING_VARS+1))
  else
    echo "✅ $VAR is set"
  fi
done

# Check frontend environment variables
echo "Checking frontend environment variables..."
for VAR in "${FRONTEND_REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Missing required environment variable: $VAR"
    MISSING_VARS=$((MISSING_VARS+1))
  else
    echo "✅ $VAR is set"
  fi
done

if [ $MISSING_VARS -gt 0 ]; then
  echo "❌ $MISSING_VARS required environment variables are missing!"
  exit 1
else
  echo "✅ All required environment variables are set!"
  exit 0
fi
