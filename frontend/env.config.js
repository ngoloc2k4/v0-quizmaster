// Environment configuration for different environments
const environments = {
  development: {
    API_URL: "http://localhost:8080/api/v1",
    AUTH_DOMAIN: "localhost",
    ENABLE_AI_FEATURES: true,
    ANALYTICS_ID: "",
  },
  test: {
    API_URL: "http://localhost:8080/api/v1",
    AUTH_DOMAIN: "localhost",
    ENABLE_AI_FEATURES: true,
    ANALYTICS_ID: "",
  },
  production: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.quizmaster-ai.com/api/v1",
    AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "auth.quizmaster-ai.com",
    ENABLE_AI_FEATURES: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === "true",
    ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || "",
  },
}

// Get current environment
const environment = process.env.NODE_ENV || "development"

// Export environment variables for current environment
module.exports = environments[environment]
