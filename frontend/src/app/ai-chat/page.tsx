"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Send, Plus, Trash2, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import type { ChatSession, ChatMessage } from "@/types/chat"
import aiService from "@/services/ai-service"

export default function AIChatPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch chat sessions on component mount
  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        setLoading(true)
        setError(null)

        const sessions = await aiService.getUserChatSessions()
        setChatSessions(sessions)

        // Set active chat to the most recent one if available
        if (sessions.length > 0) {
          setActiveChatId(sessions[0].id)
          setActiveChat(sessions[0])
        } else {
          // Create a new chat session if none exists
          await handleNewChat()
        }
      } catch (err) {
        console.error("Error fetching chat sessions:", err)
        setError("Failed to load chat sessions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChatSessions()
  }, [])

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeChat?.messages])

  // Create a new chat session
  const handleNewChat = async () => {
    try {
      setLoading(true)
      const newChat = await aiService.createChatSession()
      setChatSessions((prev) => [newChat, ...prev])
      setActiveChatId(newChat.id)
      setActiveChat(newChat)
      setMessageInput("")
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (err) {
      console.error("Error creating new chat:", err)
      setError("Failed to create new chat. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Select a chat session
  const handleSelectChat = async (chatId: string) => {
    if (chatId === activeChatId) return

    try {
      setLoading(true)
      const chat = await aiService.getChatSessionById(chatId)
      setActiveChatId(chatId)
      setActiveChat(chat)
      setMessageInput("")
    } catch (err) {
      console.error("Error fetching chat:", err)
      setError("Failed to load chat. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Delete a chat session
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this chat?")) return

    try {
      await aiService.deleteChatSession(chatId)
      setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId))

      // If the active chat was deleted, set active chat to the most recent one
      if (chatId === activeChatId) {
        const remainingSessions = chatSessions.filter((chat) => chat.id !== chatId)
        if (remainingSessions.length > 0) {
          setActiveChatId(remainingSessions[0].id)
          setActiveChat(remainingSessions[0])
        } else {
          // Create a new chat session if none exists
          await handleNewChat()
        }
      }
    } catch (err) {
      console.error("Error deleting chat:", err)
      setError("Failed to delete chat. Please try again.")
    }
  }

  // Send a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!messageInput.trim() || !activeChatId || sending) return

    try {
      setSending(true)
      const message = messageInput.trim()
      setMessageInput("")

      // Optimistically update UI
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        role: "user",
        timestamp: new Date().toISOString(),
      }

      const updatedChat = {
        ...activeChat!,
        messages: [...(activeChat?.messages || []), userMessage],
      }
      setActiveChat(updatedChat)

      // Send message to API
      const response = await aiService.sendChatMessage(activeChatId, {
        content: message,
      })

      // Update chat with AI response
      const updatedMessages = [
        ...(activeChat?.messages || []),
        userMessage,
        {
          id: response.id,
          content: response.content,
          role: response.role,
          model: response.model,
          timestamp: response.timestamp,
        },
      ]

      setActiveChat({
        ...activeChat!,
        messages: updatedMessages,
      })

      // Update chat session in the list
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                title: chat.title === "New Chat" ? message.substring(0, 30) : chat.title,
                messages: updatedMessages,
              }
            : chat,
        ),
      )
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 flex-grow overflow-hidden">
            {/* Chat List Sidebar */}
            <div className="border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <Button onClick={handleNewChat} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
              </div>
              <ScrollArea className="flex-grow">
                <div className="p-2">
                  {chatSessions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No chat sessions</div>
                  ) : (
                    chatSessions.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                          chat.id === activeChatId ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleSelectChat(chat.id)}
                      >
                        <div className="truncate flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{chat.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <Card className="flex flex-col h-full">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  {activeChat?.title || "AI Chat Assistant"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
                {error && (
                  <Alert variant="destructive" className="m-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Messages */}
                <ScrollArea className="flex-grow p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : activeChat?.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Sparkles className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-medium mb-2">How can I help you today?</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Ask me anything about creating quizzes, flashcards, or any topic you want to learn about.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md">
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => setMessageInput("Create a quiz about world history")}
                        >
                          Create a quiz about world history
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => setMessageInput("Make flashcards for Spanish vocabulary")}
                        >
                          Make flashcards for Spanish vocabulary
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => setMessageInput("Explain quantum physics simply")}
                        >
                          Explain quantum physics simply
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => setMessageInput("Tips for effective studying")}
                        >
                          Tips for effective studying
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeChat?.messages.map((message, index) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <Avatar className={`${message.role === "user" ? "ml-2" : "mr-2"} h-8 w-8`}>
                              {message.role === "user" ? (
                                <AvatarFallback>U</AvatarFallback>
                              ) : (
                                <>
                                  <AvatarImage src="/ai-avatar.png" />
                                  <AvatarFallback>AI</AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              >
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={sending || loading || !activeChatId}
                      className="flex-grow"
                    />
                    <Button type="submit" disabled={sending || loading || !messageInput.trim() || !activeChatId}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
