"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Grid, Search, Plus, Tag, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Flashcard } from "@/types/flashcard"
import flashcardService from "@/services/flashcard-service"
import DashboardLayout from "@/components/layouts/dashboard-layout"

export default function FlashcardsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [publicFlashcards, setPublicFlashcards] = useState<Flashcard[]>([])
  const [myFlashcards, setMyFlashcards] = useState<Flashcard[]>([])
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch flashcards on component mount
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true)
        setError(null)

        const [publicData, myData] = await Promise.all([
          flashcardService.getPublicFlashcards(),
          flashcardService.getMyFlashcards(),
        ])

        setPublicFlashcards(publicData)
        setMyFlashcards(myData)

        // Extract all unique tags
        const tagsSet = new Set<string>()
        ;[...publicData, ...myData].forEach((flashcard) => {
          flashcard.tags.forEach((tag) => tagsSet.add(tag))
        })
        setAllTags(Array.from(tagsSet))
      } catch (err) {
        console.error("Error fetching flashcards:", err)
        setError("Failed to load flashcards. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcards()
  }, [])

  // Filter flashcards based on active tab, search query, and selected tag
  useEffect(() => {
    let flashcardsToFilter: Flashcard[] = []

    if (activeTab === "all") {
      flashcardsToFilter = [...publicFlashcards]
    } else if (activeTab === "my") {
      flashcardsToFilter = [...myFlashcards]
    }

    // Apply search filter
    if (searchQuery) {
      flashcardsToFilter = flashcardsToFilter.filter(
        (flashcard) =>
          flashcard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (flashcard.description && flashcard.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply tag filter
    if (selectedTag) {
      flashcardsToFilter = flashcardsToFilter.filter((flashcard) => flashcard.tags.includes(selectedTag))
    }

    setFilteredFlashcards(flashcardsToFilter)
  }, [activeTab, searchQuery, selectedTag, publicFlashcards, myFlashcards])

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
            <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
            <p className="text-muted-foreground">Create and study flashcards to improve your knowledge</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/flashcards/create">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Flashcards
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
                placeholder="Search flashcards..."
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
                <TabsTrigger value="all">All Flashcards</TabsTrigger>
                <TabsTrigger value="my">My Flashcards</TabsTrigger>
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
                ) : filteredFlashcards.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <Grid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No flashcards found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedTag
                        ? "Try adjusting your search or filters"
                        : "Be the first to create flashcards!"}
                    </p>
                    <Link href="/flashcards/create">
                      <Button>Create Flashcards</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFlashcards.map((flashcard) => (
                      <FlashcardCard key={flashcard.id} flashcard={flashcard} />
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
                ) : myFlashcards.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <Grid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">You haven't created any flashcards yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first flashcard set to start studying!</p>
                    <Link href="/flashcards/create">
                      <Button>Create Flashcards</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myFlashcards
                      .filter(
                        (flashcard) =>
                          (!searchQuery || flashcard.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
                          (!selectedTag || flashcard.tags.includes(selectedTag)),
                      )
                      .map((flashcard) => (
                        <FlashcardCard key={flashcard.id} flashcard={flashcard} isOwner={true} />
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

interface FlashcardCardProps {
  flashcard: Flashcard
  isOwner?: boolean
}

function FlashcardCard({ flashcard, isOwner = false }: FlashcardCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleStudyFlashcard = () => {
    router.push(`/flashcards/${flashcard.id}/study`)
  }

  const handleEditFlashcard = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/flashcards/${flashcard.id}/edit`)
  }

  const handleDeleteFlashcard = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this flashcard set? This action cannot be undone.")) {
      try {
        setDeleting(true)
        await flashcardService.deleteFlashcard(flashcard.id)
        window.location.reload()
      } catch (error) {
        console.error("Error deleting flashcard:", error)
        alert("Failed to delete flashcard. Please try again.")
      } finally {
        setDeleting(false)
      }
    }
  }

  return (
    <Card
      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleStudyFlashcard}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{flashcard.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {flashcard.description || "No description provided."}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {flashcard.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Grid className="h-3.5 w-3.5 mr-1" />
          <span>{flashcard.cards.length} cards</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <User className="h-3.5 w-3.5 mr-1" />
          <span className="text-muted-foreground">{flashcard.createdBy}</span>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actions"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditFlashcard}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteFlashcard} className="text-destructive" disabled={deleting}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  )
}
