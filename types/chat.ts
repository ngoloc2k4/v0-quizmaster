export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  model?: string
  timestamp: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}
