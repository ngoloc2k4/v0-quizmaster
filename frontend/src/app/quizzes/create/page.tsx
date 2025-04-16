"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { v4 as uuidv4 } from "uuid"
import { BookOpen, Plus, Trash2, Save, ArrowLeft, Sparkles, Loader2, Clock, TagIcon, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { QuestionType } from "@/types/quiz"
import quizService from "@/services/quiz-service"
import aiService from "@/services/ai-service"

// Form schema for manual quiz creation
const quizSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  timeLimit: z.number().min(0).default(0),
  tags: z.array(z.string()).default([]),
  questions: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, { message: "Question text is required" }),
        type: z.nativeEnum(QuestionType),
        options: z
          .array(
            z.object({
              id: z.string(),
              text: z.string().min(1, { message: "Option text is required" }),
              isCorrect: z.boolean().default(false),
            }),
          )
          .min(2, { message: "At least 2 options are required" }),
        explanation: z.string().optional(),
      }),
    )
    .min(1, { message: "At least 1 question is required" }),
})

// Form schema for AI quiz generation
const aiQuizSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  numberOfQuestions: z.number().min(1).max(20),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
})

type QuizFormValues = z.infer<typeof quizSchema>
type AIQuizFormValues = z.infer<typeof aiQuizSchema>

export default function CreateQuizPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("manual")
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizFormValues | null>(null)

  // Form for manual quiz creation
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      timeLimit: 0,
      tags: [],
      questions: [
        {
          id: uuidv4(),
          text: "",
          type: QuestionType.SINGLE_CHOICE,
          options: [
            { id: uuidv4(), text: "", isCorrect: false },
            { id: uuidv4(), text: "", isCorrect: false },
          ],
          explanation: "",
        },
      ],
    },
  })

  // Form for AI quiz generation
  const aiForm = useForm<AIQuizFormValues>({
    resolver: zodResolver(aiQuizSchema),
    defaultValues: {
      topic: "",
      difficulty: "Medium",
      numberOfQuestions: 5,
      tags: [],
      isPublic: true,
    },
  })

  // Add a new question to the form
  const addQuestion = () => {
    const currentQuestions = form.getValues("questions")
    form.setValue("questions", [
      ...currentQuestions,
      {
        id: uuidv4(),
        text: "",
        type: QuestionType.SINGLE_CHOICE,
        options: [
          { id: uuidv4(), text: "", isCorrect: false },
          { id: uuidv4(), text: "", isCorrect: false },
        ],
        explanation: "",
      },
    ])
  }

  // Remove a question from the form
  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues("questions")
    if (currentQuestions.length > 1) {
      form.setValue(
        "questions",
        currentQuestions.filter((_, i) => i !== index),
      )
    }
  }

  // Add a new option to a question
  const addOption = (questionIndex: number) => {
    const currentQuestions = form.getValues("questions")
    const currentOptions = currentQuestions[questionIndex].options

    const updatedQuestions = [...currentQuestions]
    updatedQuestions[questionIndex] = {
      ...currentQuestions[questionIndex],
      options: [...currentOptions, { id: uuidv4(), text: "", isCorrect: false }],
    }

    form.setValue("questions", updatedQuestions)
  }

  // Remove an option from a question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentQuestions = form.getValues("questions")
    const currentOptions = currentQuestions[questionIndex].options

    if (currentOptions.length > 2) {
      const updatedQuestions = [...currentQuestions]
      updatedQuestions[questionIndex] = {
        ...currentQuestions[questionIndex],
        options: currentOptions.filter((_, i) => i !== optionIndex),
      }

      form.setValue("questions", updatedQuestions)
    }
  }

  // Handle option selection for single choice questions
  const handleSingleChoiceSelect = (questionIndex: number, optionIndex: number) => {
    const currentQuestions = form.getValues("questions")
    const updatedQuestions = [...currentQuestions]

    // Set all options to not correct
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.map((option, i) => ({
      ...option,
      isCorrect: i === optionIndex,
    }))

    form.setValue("questions", updatedQuestions)
  }

  // Add a tag to the form
  const addTag = () => {
    if (tagInput.trim() && !form.getValues("tags").includes(tagInput.trim())) {
      const currentTags = form.getValues("tags")
      form.setValue("tags", [...currentTags, tagInput.trim()])
      setTagInput("")
    }
  }

  // Remove a tag from the form
  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag),
    )
  }

  // Add a tag to the AI form
  const addAITag = () => {
    if (tagInput.trim() && !aiForm.getValues("tags").includes(tagInput.trim())) {
      const currentTags = aiForm.getValues("tags")
      aiForm.setValue("tags", [...currentTags, tagInput.trim()])
      setTagInput("")
    }
  }

  // Remove a tag from the AI form
  const removeAITag = (tag: string) => {
    const currentTags = aiForm.getValues("tags")
    aiForm.setValue(
      "tags",
      currentTags.filter((t) => t !== tag),
    )
  }

  // Submit the manual quiz form
  const onSubmit = async (data: QuizFormValues) => {
    try {
      setIsSubmitting(true)

      // Ensure at least one option is marked as correct for each question
      const validQuestions = data.questions.every((question) => question.options.some((option) => option.isCorrect))

      if (!validQuestions) {
        alert("Each question must have at least one correct answer.")
        setIsSubmitting(false)
        return
      }

      // Submit the quiz
      await quizService.createQuiz(data)
      router.push("/quizzes")
    } catch (error) {
      console.error("Error creating quiz:", error)
      alert("Failed to create quiz. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Generate a quiz using AI
  const onGenerateQuiz = async (data: AIQuizFormValues) => {
    try {
      setIsGenerating(true)

      const generatedQuizData = await aiService.generateQuiz({
        topic: data.topic,
        difficulty: data.difficulty,
        numberOfQuestions: data.numberOfQuestions,
        tags: data.tags,
      })

      // Convert the generated quiz to the form format
      const formattedQuiz: QuizFormValues = {
        title: generatedQuizData.title,
        description: generatedQuizData.description || "",
        isPublic: data.isPublic,
        timeLimit: 0,
        tags: generatedQuizData.tags,
        questions: generatedQuizData.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options.map((o) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect || false,
          })),
          explanation: q.explanation || "",
        })),
      }

      setGeneratedQuiz(formattedQuiz)

      // Switch to manual tab to edit the generated quiz
      setActiveTab("manual")

      // Update the form with the generated quiz
      form.reset(formattedQuiz)
    } catch (error) {
      console.error("Error generating quiz:", error)
      alert("Failed to generate quiz. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Quiz</h1>
            <p className="text-muted-foreground">Create a new quiz manually or with AI assistance</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="manual" disabled={isGenerating}>
              <BookOpen className="h-4 w-4 mr-2" />
              Manual Creation
            </TabsTrigger>
            <TabsTrigger value="ai" disabled={isSubmitting}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Details</CardTitle>
                    <CardDescription>Enter the basic information about your quiz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter quiz title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter quiz description" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="timeLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Limit (minutes)</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0 (no limit)"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Set to 0 for no time limit</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center">
                                {field.value ? (
                                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                ) : (
                                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                )}
                                {field.value ? "Public" : "Private"}
                              </FormLabel>
                              <FormDescription>
                                {field.value
                                  ? "Anyone can view and take this quiz"
                                  : "Only you can view and take this quiz"}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={() => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <div className="flex items-center space-x-2">
                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Add a tag"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  addTag()
                                }
                              }}
                            />
                            <Button type="button" onClick={addTag} size="sm">
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {form.watch("tags").map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => removeTag(tag)}
                                >
                                  ×
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Questions</h2>
                    <Button type="button" onClick={addQuestion} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  {form.watch("questions").map((question, questionIndex) => (
                    <Card key={question.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                          {form.watch("questions").length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(questionIndex)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question Text</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter your question" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question Type</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(value as QuestionType)}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select question type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={QuestionType.SINGLE_CHOICE}>Single Choice</SelectItem>
                                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
                                  <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <FormLabel>Options</FormLabel>
                            {form.watch(`questions.${questionIndex}.type`) !== QuestionType.TRUE_FALSE && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(questionIndex)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Option
                              </Button>
                            )}
                          </div>

                          {form.watch(`questions.${questionIndex}.type`) === QuestionType.TRUE_FALSE ? (
                            <RadioGroup
                              onValueChange={(value) => {
                                const updatedQuestions = [...form.getValues("questions")]
                                updatedQuestions[questionIndex].options = [
                                  { id: "true", text: "True", isCorrect: value === "true" },
                                  { id: "false", text: "False", isCorrect: value === "false" },
                                ]
                                form.setValue("questions", updatedQuestions)
                              }}
                              defaultValue={
                                form.getValues(`questions.${questionIndex}.options`).find((o) => o.isCorrect)?.id ||
                                "true"
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id={`true-${questionIndex}`} />
                                <FormLabel htmlFor={`true-${questionIndex}`}>True</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id={`false-${questionIndex}`} />
                                <FormLabel htmlFor={`false-${questionIndex}`}>False</FormLabel>
                              </div>
                            </RadioGroup>
                          ) : form.watch(`questions.${questionIndex}.type`) === QuestionType.SINGLE_CHOICE ? (
                            <RadioGroup
                              onValueChange={(value) => {
                                const optionIndex = form
                                  .getValues(`questions.${questionIndex}.options`)
                                  .findIndex((o) => o.id === value)
                                handleSingleChoiceSelect(questionIndex, optionIndex)
                              }}
                              defaultValue={
                                form.getValues(`questions.${questionIndex}.options`).find((o) => o.isCorrect)?.id
                              }
                            >
                              {form.watch(`questions.${questionIndex}.options`).map((option, optionIndex) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.id} id={`${option.id}-radio`} />
                                  <FormField
                                    control={form.control}
                                    name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                    render={({ field }) => (
                                      <FormItem className="flex-grow">
                                        <FormControl>
                                          <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {form.watch(`questions.${questionIndex}.options`).length > 2 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOption(questionIndex, optionIndex)}
                                      className="text-destructive p-0 h-8 w-8"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            // Multiple choice
                            <div className="space-y-2">
                              {form.watch(`questions.${questionIndex}.options`).map((option, optionIndex) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                  <FormField
                                    control={form.control}
                                    name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                    render={({ field }) => (
                                      <FormItem className="flex-grow">
                                        <FormControl>
                                          <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {form.watch(`questions.${questionIndex}.options`).length > 2 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOption(questionIndex, optionIndex)}
                                      className="text-destructive p-0 h-8 w-8"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.explanation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Explanation (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain the correct answer"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                This will be shown to users after they answer the question
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Quiz
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="ai">
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(onGenerateQuiz)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Quiz with AI</CardTitle>
                    <CardDescription>Let AI create a quiz for you based on your specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={aiForm.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter quiz topic (e.g., World War II, Python Programming)" {...field} />
                          </FormControl>
                          <FormDescription>Be specific for better results</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiForm.control}
                      name="numberOfQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Questions</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 5)}
                            />
                          </FormControl>
                          <FormDescription>Maximum 20 questions</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiForm.control}
                      name="tags"
                      render={() => (
                        <FormItem>
                          <FormLabel>Tags (Optional)</FormLabel>
                          <div className="flex items-center space-x-2">
                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Add a tag"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  addAITag()
                                }
                              }}
                            />
                            <Button type="button" onClick={addAITag} size="sm">
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {aiForm.watch("tags").map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => removeAITag(tag)}
                                >
                                  ×
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiForm.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              {field.value ? (
                                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              ) : (
                                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                              )}
                              {field.value ? "Public" : "Private"}
                            </FormLabel>
                            <FormDescription>
                              {field.value
                                ? "Anyone can view and take this quiz"
                                : "Only you can view and take this quiz"}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
