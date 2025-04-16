export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
}

export interface QuizOption {
  id: string
  text: string
  isCorrect?: boolean // Only visible when reviewing
}

export interface QuizQuestion {
  id: string
  text: string
  imageUrl?: string
  type: QuestionType
  options: QuizOption[]
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  createdBy: string
  createdAt: string
  updatedAt?: string
  isPublic: boolean
  tags: string[]
  timeLimit: number // in minutes, 0 means no time limit
  questions: QuizQuestion[]
}

export interface QuizSubmission {
  answers: Record<string, string[]> // questionId -> selected optionIds
  timeSpent: number // in seconds
}

export interface QuizAttempt {
  id: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  unanswered: number
  timeSpent: number // in seconds
  completed: boolean
  startedAt: string
  completedAt?: string
}
