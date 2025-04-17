#!/bin/bash

# Script to set environment variables in production
# Usage: ./set-env-vars.sh [environment]
# Example: ./set-env-vars.sh production

ENV=$1
if [ -z "$ENV" ]; then
 ENV="production"
fi

echo "Setting environment variables for $ENV environment..."

# Load variables from .env file if it exists
if [ -f "./backend/.env.production" ]; then
 source "./backend/.env.production"
 echo "Loaded variables from ./backend/.env.production"
else
 echo "Warning: ./backend/.env.production file not found"
fi

# Set backend environment variables
if [ "$ENV" = "production" ]; then
 # For cloud providers like Heroku, Vercel, etc.
 echo "Setting environment variables for cloud deployment..."
 
 # Example for Heroku
 if command -v heroku &> /dev/null; then
   echo "Setting Heroku environment variables..."
   heroku config:set MONGODB_URI="$MONGODB_URI" --app quizmaster-api
   heroku config:set JWT_SECRET="$JWT_SECRET" --app quizmaster-api
   heroku config:set OPENROUTER_API_KEY="$OPENROUTER_API_KEY" --app quizmaster-api
   heroku config:set MAIL_HOST="$MAIL_HOST" --app quizmaster-api
   heroku config:set MAIL_PORT="$MAIL_PORT" --app quizmaster-api
   heroku config:set MAIL_USERNAME="$MAIL_USERNAME" --app quizmaster-api
   heroku config:set MAIL_PASSWORD="$MAIL_PASSWORD" --app quizmaster-api
   heroku config:set MAIL_FROM="$MAIL_FROM" --app quizmaster-api
   heroku config:set SERVER_PORT="$SERVER_PORT" --app quizmaster-api
   heroku config:set LOG_LEVEL="$LOG_LEVEL" --app quizmaster-api
   heroku config:set SPRING_PROFILES_ACTIVE="prod" --app quizmaster-api
 fi
 
 # Example for Vercel
 if command -v vercel &> /dev/null; then
   echo "Setting Vercel environment variables for frontend..."
   vercel env add NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" --environment production
   vercel env add NEXT_PUBLIC_AUTH_DOMAIN="$NEXT_PUBLIC_AUTH_DOMAIN" --environment production
   vercel env add NEXT_PUBLIC_ENABLE_AI_FEATURES="$NEXT_PUBLIC_ENABLE_AI_FEATURES" --environment production
   vercel env add NEXT_PUBLIC_ANALYTICS_ID="$NEXT_PUBLIC_ANALYTICS_ID" --environment production
 fi
 
else
 # For local development or testing
 echo "Setting environment variables for local deployment..."
 
 # Export variables for local use
 export MONGODB_URI
 export JWT_SECRET
 export OPENROUTER_API_KEY
 export MAIL_HOST
 export MAIL_PORT
 export MAIL_USERNAME
 export MAIL_PASSWORD
 export MAIL_FROM
 export SERVER_PORT
 export LOG_LEVEL
 export SPRING_PROFILES_ACTIVE="prod"
 
 echo "Environment variables set for local $ENV environment"
fi

echo "Environment variables setup complete!"
