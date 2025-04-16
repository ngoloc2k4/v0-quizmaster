"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Brain } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">QuizMaster AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#features" className="font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Learn Smarter with AI-Powered Quizzes</h1>
            <p className="text-xl mb-8">
              Create, share, and master knowledge with personalized quizzes and flashcards powered by artificial
              intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create engaging learning experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Generated Quizzes</h3>
              <p className="text-muted-foreground">
                Create comprehensive quizzes on any topic in seconds using advanced AI technology.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="mb-4 bg-secondary/10 p-3 rounded-full w-fit">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Flashcards</h3>
              <p className="text-muted-foreground">
                Study efficiently with AI-powered flashcards that adapt to your learning progress.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="mb-4 bg-accent/10 p-3 rounded-full w-fit">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
              <p className="text-muted-foreground">
                Get instant help and explanations from our intelligent AI chat assistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">QuizMaster AI</span>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-8 items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                © {new Date().getFullYear()} QuizMaster AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
