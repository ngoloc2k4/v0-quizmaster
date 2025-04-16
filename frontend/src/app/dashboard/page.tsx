"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BookOpen, Brain, Grid, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DashboardLayout from "@/components/layouts/dashboard-layout"

export default function Dashboard() {
  // Simple effect to log when the component mounts
  useEffect(() => {
    console.log("Dashboard component mounted")
  }, [])

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to QuizMaster AI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Quizzes</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Flashcards</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-secondary/10 p-3 rounded-full">
                  <Grid className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Quizzes</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-bold">0%</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/quizzes/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </Link>
          <Link href="/flashcards/create">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Flashcards
            </Button>
          </Link>
          <Link href="/ai-chat">
            <Button variant="secondary">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI
            </Button>
          </Link>
        </div>

        {/* Simple content */}
        <div className="bg-muted/30 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="mb-4">
            Welcome to QuizMaster AI! Create quizzes, study flashcards, or chat with our AI assistant to help you learn.
          </p>
          <Link href="/quizzes">
            <Button>Browse Quizzes</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
