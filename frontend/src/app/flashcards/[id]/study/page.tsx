"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, X, Loader2, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import type { Flashcard } from "@/types/flashcard"
import flashcardService from "@/services/flashcard-service"

interface PageProps {
  params: {
    id: string
  }
}

export default function StudyFlashcardPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null)
  const [studyId, setStudyId] = useState<string | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [cardResults, setCardResults] = useState<Record<string, boolean>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Fetch flashcard and start study session
  useEffect(() => {
    const fetchFlashcardAndStartStudy = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch flashcard details
        const flashcardData = await flashcardService.getFlashcardById(params.id)
        setFlashcard(flashcardData)

        // Start flashcard study session
        const study = await flashcardService.startFlashcardStudy(params.id)
        setStudyId(study.id)

        // Initialize card results object
        const initialResults: Record<string, boolean> = {}
        flashcardData.cards.forEach((card) => {
          initialResults[card.id] = false
        })
        setCardResults(initialResults)

        // Start tracking time spent
        startTimeRef.current = Date.now()
      } catch (err) {
        console.error("Error fetching flashcard:", err)
        setError("Failed to load flashcard. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcardAndStartStudy()

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [params.id])

  // Timer effect
  useEffect(() => {
    if (!loading && flashcard) {
      // Start timer to track time spent
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTimeRef.current) / 1000)
        setTimeSpent(elapsed)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [loading, flashcard])

  // Handle card flip
  const handleFlip = () => {
    setFlipped(!flipped)
  }

  // Mark card as remembered
  const handleRemembered = () => {
    if (!flashcard) return

    const currentCard = flashcard.cards[currentCardIndex]
    setCardResults((prev) => ({
      ...prev,
      [currentCard.id]: true,
    }))

    moveToNextCard()
  }

  // Mark card as not remembered
  const handleNotRemembered = () => {
    if (!flashcard) return

    const currentCard = flashcard.cards[currentCardIndex]
    setCardResults((prev) => ({
      ...prev,
      [currentCard.id]: false,
    }))

    moveToNextCard()
  }

  // Move to next card
  const moveToNextCard = () => {
    setFlipped(false)
    if (flashcard && currentCardIndex < flashcard.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      handleFinishStudy()
    }
  }

  // Move to previous card
  const handlePrevCard = () => {
    setFlipped(false)
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  // Finish study session
  const handleFinishStudy = async () => {
    if (!studyId || !flashcard) return

    try {
      setSubmitting(true)

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Submit study session
      const result = await flashcardService.submitFlashcardStudy(studyId, {
        cardResults,
        timeSpent,
      })

      // Navigate to results page
      router.push(`/flashcards/studies/${result.id}`)
    } catch (err) {
      console.error("Error submitting study session:", err)
      setError("Failed to submit study session. Please try again.")
      setSubmitting(false)
    }
  }

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!flashcard) return 0
    return ((currentCardIndex + 1) / flashcard.cards.length) * 100
  }

  // Count remembered cards
  const countRememberedCards = (): number => {
    return Object.values(cardResults).filter(Boolean).length
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Loading flashcards...</h2>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!flashcard) {
    return null
  }

  const currentCard = flashcard.cards[currentCardIndex]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{flashcard.title}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">
                {currentCardIndex + 1} / {flashcard.cards.length}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Remembered: {countRememberedCards()}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <div className="flex justify-center mb-6">
          <div
            className={`w-full max-w-md h-64 perspective-1000 ${flipped ? "rotate-y-180" : ""} transition-transform duration-500`}
            onClick={handleFlip}
          >
            <div className="relative w-full h-full cursor-pointer">
              <div
                className={`absolute w-full h-full backface-hidden ${
                  flipped ? "opacity-0" : "opacity-100"
                } transition-opacity duration-500 bg-card rounded-lg shadow-lg flex items-center justify-center p-6 border`}
              >
                <div className="text-center">
                  <h3 className="text-xl font-medium">{currentCard.front}</h3>
                  {currentCard.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={currentCard.imageUrl || "/placeholder.svg"}
                        alt="Card front"
                        className="max-h-32 mx-auto rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`absolute w-full h-full backface-hidden ${
                  flipped ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 bg-card rounded-lg shadow-lg flex items-center justify-center p-6 border`}
              >
                <div className="text-center">
                  <h3 className="text-xl font-medium">{currentCard.back}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <p className="text-sm text-muted-foreground">Click the card to flip it</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handlePrevCard} disabled={currentCardIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex space-x-4">
            <Button variant="outline" className="border-red-200 text-red-600" onClick={handleNotRemembered}>
              <X className="mr-2 h-4 w-4" />
              Don't Know
            </Button>
            <Button variant="outline" className="border-green-200 text-green-600" onClick={handleRemembered}>
              <Check className="mr-2 h-4 w-4" />
              Know It
            </Button>
          </div>
          {currentCardIndex < flashcard.cards.length - 1 ? (
            <Button onClick={moveToNextCard}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinishStudy} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finishing...
                </>
              ) : (
                <>
                  Finish
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setCurrentCardIndex(0)}>
            <RotateCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
