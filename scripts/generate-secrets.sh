#!/bin/bash

# Script to generate secure values for sensitive environment variables
# Usage: ./generate-secrets.sh

echo "Generating secure values for sensitive environment variables..."

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT_SECRET: $JWT_SECRET"

# Generate a secure MongoDB password
MONGO_PASSWORD=$(openssl rand -base64 16)
echo "Generated MONGO_PASSWORD: $MONGO_PASSWORD"

# Create or update .env file with generated secrets
ENV_FILE="./backend/.env.production"

# Backup existing file if it exists
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "${ENV_FILE}.backup"
  echo "Backed up existing $ENV_FILE to ${ENV_FILE}.backup"
fi

# Update JWT_SECRET in the .env file
if grep -q "JWT_SECRET=" "$ENV_FILE" 2>/dev/null; then
  sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE"
else
  echo "JWT_SECRET=$JWT_SECRET" >> "$ENV_FILE"
fi

echo "Updated JWT_SECRET in $ENV_FILE"

echo "Secret generation complete!"
echo "IMPORTANT: Make sure to securely store these values and never commit them to version control."
