"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { QuestionType } from "@/types/quiz"
import quizService from "@/services/quiz-service"

interface PageProps {
  params: {
    id: string
  }
}

export default function TakeQuizPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Fetch quiz and start attempt
  useEffect(() => {
    const fetchQuizAndStartAttempt = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch quiz details
        const quizData = await quizService.getQuizById(params.id)
        setQuiz(quizData)

        // Start quiz attempt
        const attempt = await quizService.startQuiz(params.id)
        setAttemptId(attempt.id)

        // Initialize answers object
        const initialAnswers: Record<string, string[]> = {}
        quizData.questions.forEach((question: any) => {
          initialAnswers[question.id] = []
        })
        setAnswers(initialAnswers)

        // Set timer if quiz has time limit
        if (quizData.timeLimit > 0) {
          setTimeLeft(quizData.timeLimit * 60) // Convert minutes to seconds
        }

        // Start tracking time spent
        startTimeRef.current = Date.now()
      } catch (err) {
        console.error("Error fetching quiz:", err)
        setError("Failed to load quiz. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizAndStartAttempt()

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [params.id])

  // Timer effect
  useEffect(() => {
    if (!loading && quiz) {
      // Start timer to track time spent
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTimeRef.current) / 1000)
        setTimeSpent(elapsed)

        // Update time left if quiz has time limit
        if (timeLeft !== null) {
          const newTimeLeft = Math.max(0, quiz.timeLimit * 60 - elapsed)
          setTimeLeft(newTimeLeft)

          // Auto-submit when time runs out
          if (newTimeLeft === 0) {
            handleSubmitQuiz()
          }
        }
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [loading, quiz, timeLeft])

  // Handle answer selection for single choice questions
  const handleSingleChoiceSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }))
  }

  // Handle answer selection for multiple choice questions
  const handleMultipleChoiceSelect = (questionId: string, optionId: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = [...(prev[questionId] || [])]

      if (checked) {
        // Add option if not already selected
        if (!currentAnswers.includes(optionId)) {
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionId],
          }
        }
      } else {
        // Remove option if selected
        return {
          ...prev,
          [questionId]: currentAnswers.filter((id) => id !== optionId),
        }
      }

      return prev
    })
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!attemptId) return

    try {
      setSubmitting(true)

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Submit quiz attempt
      const result = await quizService.submitQuiz(attemptId, {
        answers,
        timeSpent,
      })

      // Navigate to results page
      router.push(`/quizzes/attempts/${result.id}`)
    } catch (err) {
      console.error("Error submitting quiz:", err)
      setError("Failed to submit quiz. Please try again.")
      setSubmitting(false)
    }
  }

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!quiz) return 0
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  }

  // Check if current question is answered
  const isCurrentQuestionAnswered = (): boolean => {
    if (!quiz) return false
    const currentQuestion = quiz.questions[currentQuestionIndex]
    return answers[currentQuestion.id]?.length > 0
  }

  // Count answered questions
  const countAnsweredQuestions = (): number => {
    if (!quiz) return 0
    return Object.values(answers).filter((ans) => ans.length > 0).length
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Loading quiz...</h2>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!quiz) {
    return null
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">
                {countAnsweredQuestions()} / {quiz.questions.length} answered
              </Badge>
            </div>
            {timeLeft !== null && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className={timeLeft < 60 ? "text-destructive font-bold" : ""}>
                  Time left: {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              {currentQuestion.type === QuestionType.SINGLE_CHOICE && <Badge>Single Choice</Badge>}
              {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && <Badge>Multiple Choice</Badge>}
              {currentQuestion.type === QuestionType.TRUE_FALSE && <Badge>True/False</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4">{currentQuestion.text}</h3>
              {currentQuestion.imageUrl && (
                <div className="mb-4">
                  <img
                    src={currentQuestion.imageUrl || "/placeholder.svg"}
                    alt="Question"
                    className="max-w-full rounded-md"
                  />
                </div>
              )}
            </div>

            {currentQuestion.type === QuestionType.SINGLE_CHOICE && (
              <RadioGroup
                value={answers[currentQuestion.id]?.[0] || ""}
                onValueChange={(value) => handleSingleChoiceSelect(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option: any) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <label htmlFor={option.id} className="text-base cursor-pointer flex-grow">
                      {option.text}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="space-y-3">
                {currentQuestion.options.map((option: any) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={answers[currentQuestion.id]?.includes(option.id) || false}
                      onCheckedChange={(checked) =>
                        handleMultipleChoiceSelect(currentQuestion.id, option.id, checked === true)
                      }
                    />
                    <label htmlFor={option.id} className="text-base cursor-pointer flex-grow">
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === QuestionType.TRUE_FALSE && (
              <RadioGroup
                value={answers[currentQuestion.id]?.[0] || ""}
                onValueChange={(value) => handleSingleChoiceSelect(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option: any) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <label htmlFor={option.id} className="text-base cursor-pointer flex-grow">
                      {option.text}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button onClick={handleNextQuestion} disabled={!isCurrentQuestionAnswered()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmitQuiz} disabled={submitting || countAnsweredQuestions() === 0}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Quiz
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-wrap gap-2 mb-6">
          {quiz.questions.map((_, index: number) => (
            <Button
              key={index}
              variant={
                index === currentQuestionIndex
                  ? "default"
                  : answers[quiz.questions[index].id]?.length > 0
                    ? "secondary"
                    : "outline"
              }
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
              className="w-10 h-10 p-0"
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Exit Quiz
          </Button>
          <Button onClick={handleSubmitQuiz} disabled={submitting || countAnsweredQuestions() === 0}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Quiz
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
