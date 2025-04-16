"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, Clock, HelpCircle, Award, BarChart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import quizService from "@/services/quiz-service"
import type { QuizAttempt } from "@/types/quiz"

interface PageProps {
  params: {
    id: string
  }
}

export default function QuizAttemptResultPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({})

  // Fetch quiz attempt and quiz details
  useEffect(() => {
    const fetchAttemptAndQuiz = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch attempt details
        const attemptData = await quizService.getQuizAttemptById(params.id)
        setAttempt(attemptData)

        // Fetch quiz details
        const quizData = await quizService.getQuizById(attemptData.quizId)
        setQuiz(quizData)

        // Get user answers from the attempt
        // Note: In a real implementation, you would get this from the backend
        // For now, we'll simulate it with empty answers
        const answers: Record<string, string[]> = {}
        quizData.questions.forEach((question: any) => {
          // Randomly select some answers for demonstration
          // In a real app, this would come from the backend
          if (Math.random() > 0.3) {
            const randomOption = question.options[Math.floor(Math.random() * question.options.length)]
            answers[question.id] = [randomOption.id]
          } else {
            answers[question.id] = []
          }
        })
        setUserAnswers(answers)
      } catch (err) {
        console.error("Error fetching quiz attempt:", err)
        setError("Failed to load quiz attempt. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAttemptAndQuiz()
  }, [params.id])

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Check if user answered a question correctly
  const isQuestionCorrect = (questionId: string): boolean => {
    if (!quiz) return false

    const question = quiz.questions.find((q: any) => q.id === questionId)
    if (!question) return false

    const userAnswer = userAnswers[questionId] || []
    if (userAnswer.length === 0) return false

    // For single choice and true/false questions
    if (question.type === "SINGLE_CHOICE" || question.type === "TRUE_FALSE") {
      const correctOption = question.options.find((o: any) => o.isCorrect)
      return userAnswer.includes(correctOption.id)
    }

    // For multiple choice questions
    if (question.type === "MULTIPLE_CHOICE") {
      const correctOptionIds = question.options.filter((o: any) => o.isCorrect).map((o: any) => o.id)

      // Check if user selected all correct options and no incorrect ones
      return (
        correctOptionIds.every((id: string) => userAnswer.includes(id)) &&
        userAnswer.every((id: string) => correctOptionIds.includes(id))
      )
    }

    return false
  }

  // Get the status of a question (correct, incorrect, unanswered)
  const getQuestionStatus = (questionId: string): "correct" | "incorrect" | "unanswered" => {
    const userAnswer = userAnswers[questionId] || []
    if (userAnswer.length === 0) return "unanswered"
    return isQuestionCorrect(questionId) ? "correct" : "incorrect"
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Loading results...</h2>
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

  if (!attempt || !quiz) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/quizzes")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{quiz.title} - Results</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{attempt.score}%</div>
              <Progress value={attempt.score} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{attempt.correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="flex justify-center">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold">{attempt.wrongAnswers}</div>
                  <div className="text-xs text-muted-foreground">Wrong</div>
                </div>
                <div>
                  <div className="flex justify-center">
                    <HelpCircle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold">{attempt.unanswered}</div>
                  <div className="text-xs text-muted-foreground">Skipped</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(attempt.timeSpent)}</div>
              <div className="text-sm text-muted-foreground">
                {quiz.timeLimit > 0 ? `Time limit: ${formatTime(quiz.timeLimit * 60)}` : "No time limit"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="review">
          <TabsList className="mb-6">
            <TabsTrigger value="review">Review Answers</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="review">
            <div className="space-y-6">
              {quiz.questions.map((question: any, index: number) => {
                const status = getQuestionStatus(question.id)
                return (
                  <Card
                    key={question.id}
                    className={`border-l-4 ${
                      status === "correct"
                        ? "border-l-green-500"
                        : status === "incorrect"
                          ? "border-l-red-500"
                          : "border-l-yellow-500"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between">
                        <span>Question {index + 1}</span>
                        {status === "correct" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : status === "incorrect" ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <HelpCircle className="h-3 w-3 mr-1" />
                            Unanswered
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h3 className="font-medium">{question.text}</h3>

                      <div className="space-y-2">
                        {question.options.map((option: any) => {
                          const isSelected = userAnswers[question.id]?.includes(option.id)
                          const isCorrect = option.isCorrect

                          let className = "p-2 rounded-md border "

                          if (isSelected && isCorrect) {
                            className += "bg-green-50 border-green-200"
                          } else if (isSelected && !isCorrect) {
                            className += "bg-red-50 border-red-200"
                          } else if (!isSelected && isCorrect) {
                            className += "bg-blue-50 border-blue-200"
                          } else {
                            className += "bg-gray-50 border-gray-200"
                          }

                          return (
                            <div key={option.id} className={className}>
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  {isSelected && isCorrect && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                                  {!isSelected && isCorrect && <CheckCircle className="h-4 w-4 text-blue-500" />}
                                  {!isSelected && !isCorrect && <div className="h-4 w-4" />}
                                </div>
                                <div className="ml-2">{option.text}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {question.explanation && (
                        <div className="bg-muted/30 p-3 rounded-md">
                          <h4 className="font-medium mb-1">Explanation:</h4>
                          <p>{question.explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Quiz Details</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span>{quiz.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Questions:</span>
                        <span>{quiz.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Limit:</span>
                        <span>{quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : "No time limit"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tags:</span>
                        <div className="flex flex-wrap justify-end gap-1">
                          {quiz.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Attempt Details</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Score:</span>
                        <span>{attempt.score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Correct Answers:</span>
                        <span>
                          {attempt.correctAnswers} of {attempt.totalQuestions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Spent:</span>
                        <span>{formatTime(attempt.timeSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{new Date(attempt.completedAt || "").toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">Performance by Question</h3>
                  <div className="space-y-2">
                    {quiz.questions.map((question: any, index: number) => {
                      const status = getQuestionStatus(question.id)
                      return (
                        <div
                          key={question.id}
                          className={`p-2 rounded-md flex justify-between items-center ${
                            status === "correct"
                              ? "bg-green-50 border border-green-200"
                              : status === "incorrect"
                                ? "bg-red-50 border border-red-200"
                                : "bg-yellow-50 border border-yellow-200"
                          }`}
                        >
                          <span className="truncate mr-2">
                            Question {index + 1}: {question.text.substring(0, 50)}
                            {question.text.length > 50 ? "..." : ""}
                          </span>
                          {status === "correct" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : status === "incorrect" ? (
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          ) : (
                            <HelpCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/quizzes")}>
                  Back to Quizzes
                </Button>
                <Link href={`/quizzes/${quiz.id}/take`}>
                  <Button>Retake Quiz</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
