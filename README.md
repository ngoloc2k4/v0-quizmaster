# QuizMaster AI

QuizMaster AI is a web application that allows users to create, manage, and take quizzes and flashcards with AI assistance.

## Project Structure

The project is organized as follows:

- `frontend/`: Contains all the frontend code (Next.js)
- `backend/`: Contains all the backend code (Spring Boot)

## Getting Started

### Prerequisites

- Node.js 18+ for the frontend
- Java 17+ for the backend
- PostgreSQL database

### Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file with the following variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. The frontend will be available at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Configure the database connection in `src/main/resources/application.properties`

3. Build and run the application:
   \`\`\`bash
   ./mvnw spring-boot:run
   \`\`\`

4. The backend API will be available at http://localhost:8080/api/v1

## Features

- User authentication (register, login, password reset)
- Quiz creation and management
- Flashcard creation and study
- AI-assisted content generation
- Chat with AI for learning assistance
- User profile and statistics
- Admin dashboard for content moderation

## Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication

## Deployment

The application can be deployed using Vercel for the frontend and a suitable Java hosting service for the backend.

## License

This project is licensed under the MIT License.
\`\`\`

Let's update the tsconfig.json file to ensure proper TypeScript configuration:
