import apiClient from "./api-client"
import type { Quiz, QuizAttempt, QuizSubmission } from "@/types/quiz"

class QuizService {
  // Get all public quizzes
  async getPublicQuizzes(): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>("/quizzes/public")
    } catch (error) {
      throw error
    }
  }

  // Get quizzes created by current user
  async getMyQuizzes(): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>("/quizzes/my")
    } catch (error) {
      throw error
    }
  }

  // Get quiz by ID
  async getQuizById(id: string): Promise<Quiz> {
    try {
      return await apiClient.get<Quiz>(`/quizzes/${id}`)
    } catch (error) {
      throw error
    }
  }

  // Create a new quiz
  async createQuiz(quiz: Omit<Quiz, "id" | "createdBy" | "createdAt">): Promise<Quiz> {
    try {
      return await apiClient.post<Quiz>("/quizzes", quiz)
    } catch (error) {
      throw error
    }
  }

  // Update an existing quiz
  async updateQuiz(id: string, quiz: Partial<Quiz>): Promise<Quiz> {
    try {
      return await apiClient.put<Quiz>(`/quizzes/${id}`, quiz)
    } catch (error) {
      throw error
    }
  }

  // Delete a quiz
  async deleteQuiz(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/quizzes/${id}`)
    } catch (error) {
      throw error
    }
  }

  // Start a quiz attempt
  async startQuiz(quizId: string): Promise<QuizAttempt> {
    try {
      return await apiClient.post<QuizAttempt>(`/quizzes/${quizId}/start`)
    } catch (error) {
      throw error
    }
  }

  // Submit a quiz attempt
  async submitQuiz(attemptId: string, submission: QuizSubmission): Promise<QuizAttempt> {
    try {
      return await apiClient.post<QuizAttempt>(`/quizzes/attempts/${attemptId}/submit`, submission)
    } catch (error) {
      throw error
    }
  }

  // Get quiz attempts by current user
  async getMyQuizAttempts(): Promise<QuizAttempt[]> {
    try {
      return await apiClient.get<QuizAttempt[]>("/quizzes/attempts/my")
    } catch (error) {
      throw error
    }
  }

  // Get a specific quiz attempt
  async getQuizAttemptById(attemptId: string): Promise<QuizAttempt> {
    try {
      return await apiClient.get<QuizAttempt>(`/quizzes/attempts/${attemptId}`)
    } catch (error) {
      throw error
    }
  }

  // Search quizzes by keyword
  async searchQuizzes(keyword: string): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>(`/quizzes/search?keyword=${encodeURIComponent(keyword)}`)
    } catch (error) {
      throw error
    }
  }

  // Get quizzes by tag
  async getQuizzesByTag(tag: string): Promise<Quiz[]> {
    try {
      return await apiClient.get<Quiz[]>(`/quizzes/tag/${encodeURIComponent(tag)}`)
    } catch (error) {
      throw error
    }
  }
}

// Create and export a singleton instance
const quizService = new QuizService()
export default quizService
