import apiClient from "./api-client"
import type { Flashcard, FlashcardStudy, FlashcardStudySubmission } from "@/types/flashcard"

class FlashcardService {
  // Get all public flashcards
  async getPublicFlashcards(): Promise<Flashcard[]> {
    try {
      return await apiClient.get<Flashcard[]>("/flashcards/public")
    } catch (error) {
      throw error
    }
  }

  // Get flashcards created by current user
  async getMyFlashcards(): Promise<Flashcard[]> {
    try {
      return await apiClient.get<Flashcard[]>("/flashcards/my")
    } catch (error) {
      throw error
    }
  }

  // Get flashcard by ID
  async getFlashcardById(id: string): Promise<Flashcard> {
    try {
      return await apiClient.get<Flashcard>(`/flashcards/${id}`)
    } catch (error) {
      throw error
    }
  }

  // Create a new flashcard
  async createFlashcard(flashcard: Omit<Flashcard, "id" | "createdBy" | "createdAt">): Promise<Flashcard> {
    try {
      return await apiClient.post<Flashcard>("/flashcards", flashcard)
    } catch (error) {
      throw error
    }
  }

  // Update an existing flashcard
  async updateFlashcard(id: string, flashcard: Partial<Flashcard>): Promise<Flashcard> {
    try {
      return await apiClient.put<Flashcard>(`/flashcards/${id}`, flashcard)
    } catch (error) {
      throw error
    }
  }

  // Delete a flashcard
  async deleteFlashcard(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/flashcards/${id}`)
    } catch (error) {
      throw error
    }
  }

  // Start a flashcard study session
  async startFlashcardStudy(flashcardId: string): Promise<FlashcardStudy> {
    try {
      return await apiClient.post<FlashcardStudy>(`/flashcards/${flashcardId}/start`)
    } catch (error) {
      throw error
    }
  }

  // Submit a flashcard study session
  async submitFlashcardStudy(studyId: string, submission: FlashcardStudySubmission): Promise<FlashcardStudy> {
    try {
      return await apiClient.post<FlashcardStudy>(`/flashcards/studies/${studyId}/submit`, submission)
    } catch (error) {
      throw error
    }
  }

  // Get flashcard studies by current user
  async getMyFlashcardStudies(): Promise<FlashcardStudy[]> {
    try {
      return await apiClient.get<FlashcardStudy[]>("/flashcards/studies/my")
    } catch (error) {
      throw error
    }
  }

  // Get a specific flashcard study
  async getFlashcardStudyById(studyId: string): Promise<FlashcardStudy> {
    try {
      return await apiClient.get<FlashcardStudy>(`/flashcards/studies/${studyId}`)
    } catch (error) {
      throw error
    }
  }

  // Search flashcards by keyword
  async searchFlashcards(keyword: string): Promise<Flashcard[]> {
    try {
      return await apiClient.get<Flashcard[]>(`/flashcards/search?keyword=${encodeURIComponent(keyword)}`)
    } catch (error) {
      throw error
    }
  }

  // Get flashcards by tag
  async getFlashcardsByTag(tag: string): Promise<Flashcard[]> {
    try {
      return await apiClient.get<Flashcard[]>(`/flashcards/tag/${encodeURIComponent(tag)}`)
    } catch (error) {
      throw error
    }
  }
}

// Create and export a singleton instance
const flashcardService = new FlashcardService()
export default flashcardService
