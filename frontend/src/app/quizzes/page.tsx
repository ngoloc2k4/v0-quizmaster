"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Search, Plus, Tag, Clock, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Quiz } from "@/types/quiz"
import quizService from "@/services/quiz-service"
import DashboardLayout from "@/components/layouts/dashboard-layout"

export default function QuizzesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([])
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        setError(null)

        const [publicData, myData] = await Promise.all([quizService.getPublicQuizzes(), quizService.getMyQuizzes()])

        setPublicQuizzes(publicData)
        setMyQuizzes(myData)

        // Extract all unique tags
        const tagsSet = new Set<string>()
        ;[...publicData, ...myData].forEach((quiz) => {
          quiz.tags.forEach((tag) => tagsSet.add(tag))
        })
        setAllTags(Array.from(tagsSet))
      } catch (err) {
        console.error("Error fetching quizzes:", err)
        setError("Failed to load quizzes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  // Filter quizzes based on active tab, search query, and selected tag
  useEffect(() => {
    let quizzesToFilter: Quiz[] = []

    if (activeTab === "all") {
      quizzesToFilter = [...publicQuizzes]
    } else if (activeTab === "my") {
      quizzesToFilter = [...myQuizzes]
    }

    // Apply search filter
    if (searchQuery) {
      quizzesToFilter = quizzesToFilter.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply tag filter
    if (selectedTag) {
      quizzesToFilter = quizzesToFilter.filter((quiz) => quiz.tags.includes(selectedTag))
    }

    setFilteredQuizzes(quizzesToFilter)
  }, [activeTab, searchQuery, selectedTag, publicQuizzes, myQuizzes])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
            <p className="text-muted-foreground">Browse, create, and take quizzes</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/quizzes/create">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search quizzes..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allTags.length === 0 && <span className="text-sm text-muted-foreground">No tags available</span>}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div>
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="my">My Quizzes</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                  </div>
                ) : filteredQuizzes.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedTag
                        ? "Try adjusting your search or filters"
                        : "Be the first to create a quiz!"}
                    </p>
                    <Link href="/quizzes/create">
                      <Button>Create Quiz</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                  </div>
                ) : myQuizzes.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">You haven't created any quizzes yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first quiz to share with others!</p>
                    <Link href="/quizzes/create">
                      <Button>Create Quiz</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myQuizzes
                      .filter(
                        (quiz) =>
                          (!searchQuery || quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
                          (!selectedTag || quiz.tags.includes(selectedTag)),
                      )
                      .map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} isOwner={true} />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface QuizCardProps {
  quiz: Quiz
  isOwner?: boolean
}

function QuizCard({ quiz, isOwner = false }: QuizCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleStartQuiz = () => {
    router.push(`/quizzes/${quiz.id}/take`)
  }

  const handleEditQuiz = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/quizzes/${quiz.id}/edit`)
  }

  const handleDeleteQuiz = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      try {
        setDeleting(true)
        await quizService.deleteQuiz(quiz.id)
        window.location.reload()
      } catch (error) {
        console.error("Error deleting quiz:", error)
        alert("Failed to delete quiz. Please try again.")
      } finally {
        setDeleting(false)
      }
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartQuiz}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {quiz.description || "No description provided."}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {quiz.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{quiz.timeLimit > 0 ? `${quiz.timeLimit} min` : "No time limit"}</span>
          <span className="mx-2">•</span>
          <span>{quiz.questions.length} questions</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <User className="h-3.5 w-3.5 mr-1" />
          <span className="text-muted-foreground">{quiz.createdBy}</span>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actions"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditQuiz}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteQuiz} className="text-destructive" disabled={deleting}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  )
}
