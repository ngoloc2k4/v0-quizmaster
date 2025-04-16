export interface User {
  id: string
  username: string
  email: string
  fullName?: string
  avatarUrl?: string
  emailVerified: boolean
  roles: string[]
  createdAt: string
  updatedAt?: string

  // Stats
  quizzesCreated?: number
  quizzesCompleted?: number
  flashcardsCreated?: number
  flashcardsStudied?: number
  aiChatsInitiated?: number
}
