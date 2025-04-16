import apiClient from "./api-client"
import type { Quiz } from "@/types/quiz"
import type { Flashcard } from "@/types/flashcard"
import type { ChatMessage, ChatSession } from "@/types/chat"

export interface GenerateQuizRequest {
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  numberOfQuestions: number
  tags?: string[]
  model?: string
}

export interface GenerateFlashcardRequest {
  topic: string
  numberOfCards: number
  tags?: string[]
  model?: string
}

export interface ChatMessageRequest {
  content: string
  model?: string
}

class AIService {
  // Create a new chat session
  async createChatSession(title?: string): Promise<ChatSession> {
    try {
      return await apiClient.post<ChatSession>("/ai/chat/sessions", { title })
    } catch (error) {
      throw error
    }
  }

  // Get all chat sessions for current user
  async getUserChatSessions(): Promise<ChatSession[]> {
    try {
      return await apiClient.get<ChatSession[]>("/ai/chat/sessions")
    } catch (error) {
      throw error
    }
  }

  // Get chat session by ID
  async getChatSessionById(sessionId: string): Promise<ChatSession> {
    try {
      return await apiClient.get<ChatSession>(`/ai/chat/sessions/${sessionId}`)
    } catch (error) {
      throw error
    }
  }

  // Send a message in a chat session
  async sendChatMessage(sessionId: string, message: ChatMessageRequest): Promise<ChatMessage> {
    try {
      return await apiClient.post<ChatMessage>(`/ai/chat/sessions/${sessionId}/messages`, message)
    } catch (error) {
      throw error
    }
  }

  // Generate a quiz using AI
  async generateQuiz(request: GenerateQuizRequest): Promise<Quiz> {
    try {
      return await apiClient.post<Quiz>("/ai/generate/quiz", request)
    } catch (error) {
      throw error
    }
  }

  // Generate a flashcard set using AI
  async generateFlashcard(request: GenerateFlashcardRequest): Promise<Flashcard> {
    try {
      return await apiClient.post<Flashcard>("/ai/generate/flashcard", request)
    } catch (error) {
      throw error
    }
  }

  // Delete a chat session
  async deleteChatSession(sessionId: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/ai/chat/sessions/${sessionId}`)
    } catch (error) {
      throw error
    }
  }
}

// Create and export a singleton instance
const aiService = new AIService()
export default aiService
