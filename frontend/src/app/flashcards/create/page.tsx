"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { v4 as uuidv4 } from "uuid"
import { Grid, Plus, Trash2, Save, ArrowLeft, Sparkles, Loader2, TagIcon, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import flashcardService from "@/services/flashcard-service"
import aiService from "@/services/ai-service"

// Form schema for manual flashcard creation
const flashcardSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  cards: z
    .array(
      z.object({
        id: z.string(),
        front: z.string().min(1, { message: "Front content is required" }),
        back: z.string().min(1, { message: "Back content is required" }),
        imageUrl: z.string().optional(),
        position: z.number(),
      }),
    )
    .min(1, { message: "At least 1 card is required" }),
})

// Form schema for AI flashcard generation
const aiFlashcardSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
  numberOfCards: z.number().min(1).max(20),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
})

type FlashcardFormValues = z.infer<typeof flashcardSchema>
type AIFlashcardFormValues = z.infer<typeof aiFlashcardSchema>

export default function CreateFlashcardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("manual")
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFlashcard, setGeneratedFlashcard] = useState<FlashcardFormValues | null>(null)

  // Form for manual flashcard creation
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      tags: [],
      cards: [
        {
          id: uuidv4(),
          front: "",
          back: "",
          imageUrl: "",
          position: 0,
        },
      ],
    },
  })

  // Form for AI flashcard generation
  const aiForm = useForm<AIFlashcardFormValues>({
    resolver: zodResolver(aiFlashcardSchema),
    defaultValues: {
      topic: "",
      numberOfCards: 5,
      tags: [],
      isPublic: true,
    },
  })

  // Add a new card to the form
  const addCard = () => {
    const currentCards = form.getValues("cards")
    form.setValue("cards", [
      ...currentCards,
      {
        id: uuidv4(),
        front: "",
        back: "",
        imageUrl: "",
        position: currentCards.length,
      },
    ])
  }

  // Remove a card from the form
  const removeCard = (index: number) => {
    const currentCards = form.getValues("cards")
    if (currentCards.length > 1) {
      const updatedCards = currentCards
        .filter((_, i) => i !== index)
        .map((card, i) => ({
          ...card,
          position: i,
        }))
      form.setValue("cards", updatedCards)
    }
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

  // Submit the manual flashcard form
  const onSubmit = async (data: FlashcardFormValues) => {
    try {
      setIsSubmitting(true)
      await flashcardService.createFlashcard(data)
      router.push("/flashcards")
    } catch (error) {
      console.error("Error creating flashcard:", error)
      alert("Failed to create flashcard. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Generate a flashcard using AI
  const onGenerateFlashcard = async (data: AIFlashcardFormValues) => {
    try {
      setIsGenerating(true)

      const generatedFlashcardData = await aiService.generateFlashcard({
        topic: data.topic,
        numberOfCards: data.numberOfCards,
        tags: data.tags,
      })

      // Convert the generated flashcard to the form format
      const formattedFlashcard: FlashcardFormValues = {
        title: generatedFlashcardData.title,
        description: generatedFlashcardData.description || "",
        isPublic: data.isPublic,
        tags: generatedFlashcardData.tags,
        cards: generatedFlashcardData.cards.map((card, index) => ({
          id: card.id,
          front: card.front,
          back: card.back,
          imageUrl: card.imageUrl || "",
          position: index,
        })),
      }

      setGeneratedFlashcard(formattedFlashcard)

      // Switch to manual tab to edit the generated flashcard
      setActiveTab("manual")

      // Update the form with the generated flashcard
      form.reset(formattedFlashcard)
    } catch (error) {
      console.error("Error generating flashcard:", error)
      alert("Failed to generate flashcard. Please try again.")
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
            <h1 className="text-3xl font-bold">Create Flashcards</h1>
            <p className="text-muted-foreground">Create a new flashcard set manually or with AI assistance</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="manual" disabled={isGenerating}>
              <Grid className="h-4 w-4 mr-2" />
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
                    <CardTitle>Flashcard Set Details</CardTitle>
                    <CardDescription>Enter the basic information about your flashcard set</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter flashcard set title" {...field} />
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
                            <Textarea
                              placeholder="Enter flashcard set description"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
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
                            <CardDescription>
                              {field.value
                                ? "Anyone can view and study these flashcards"
                                : "Only you can view and study these flashcards"}
                            </CardDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

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
                    <h2 className="text-xl font-bold">Cards</h2>
                    <Button type="button" onClick={addCard} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>

                  {form.watch("cards").map((card, cardIndex) => (
                    <Card key={card.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Card {cardIndex + 1}</CardTitle>
                          {form.watch("cards").length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCard(cardIndex)}
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
                          name={`cards.${cardIndex}.front`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Front</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter front content" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.back`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Back</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter back content" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.imageUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter image URL" {...field} value={field.value || ""} />
                              </FormControl>
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
                        Save Flashcards
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="ai">
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(onGenerateFlashcard)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Flashcards with AI</CardTitle>
                    <CardDescription>Let AI create flashcards for you based on your specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={aiForm.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter flashcard topic (e.g., Biology, Spanish Vocabulary)" {...field} />
                          </FormControl>
                          <CardDescription>Be specific for better results</CardDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiForm.control}
                      name="numberOfCards"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Cards</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 5)}
                            />
                          </FormControl>
                          <CardDescription>Maximum 20 cards</CardDescription>
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
                            <CardDescription>
                              {field.value
                                ? "Anyone can view and study these flashcards"
                                : "Only you can view and study these flashcards"}
                            </CardDescription>
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
                          Generate Flashcards
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
