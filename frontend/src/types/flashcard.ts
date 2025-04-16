export interface FlashcardCard {
  id: string
  front: string
  back: string
  imageUrl?: string
  position: number
}

export interface Flashcard {
  id: string
  title: string
  description?: string
  createdBy: string
  createdAt: string
  updatedAt?: string
  isPublic: boolean
  tags: string[]
  cards: FlashcardCard[]
}

export interface FlashcardStudySubmission {
  cardResults: Record<string, boolean> // cardId -> remembered (true/false)
  timeSpent: number // in seconds
}

export interface FlashcardStudy {
  id: string
  flashcardId: string
  flashcardTitle: string
  totalCards: number
  cardsStudied: number
  cardsRemembered: number
  cardsToReview: number
  completed: boolean
  timeSpent: number // in seconds
  startedAt: string
  completedAt?: string
}
