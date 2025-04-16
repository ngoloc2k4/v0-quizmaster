"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, BookOpen, Grid, AlertTriangle, CheckCircle, XCircle, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DashboardLayout from "@/components/layouts/dashboard-layout"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQuizzes: 0,
    totalFlashcards: 0,
    totalReports: 0,
    pendingReports: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])

  // Fetch admin dashboard data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real implementation, these would be API calls
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock stats
        setStats({
          totalUsers: 125,
          activeUsers: 98,
          totalQuizzes: 342,
          totalFlashcards: 187,
          totalReports: 15,
          pendingReports: 7,
        })

        // Mock users
        setUsers([
          {
            id: "1",
            username: "johndoe",
            email: "john.doe@example.com",
            fullName: "John Doe",
            avatarUrl: "",
            isActive: true,
            isLocked: false,
            role: "USER",
            createdAt: "2023-05-15T10:30:00Z",
          },
          {
            id: "2",
            username: "janedoe",
            email: "jane.doe@example.com",
            fullName: "Jane Doe",
            avatarUrl: "",
            isActive: true,
            isLocked: false,
            role: "USER",
            createdAt: "2023-06-20T14:45:00Z",
          },
          {
            id: "3",
            username: "bobsmith",
            email: "bob.smith@example.com",
            fullName: "Bob Smith",
            avatarUrl: "",
            isActive: false,
            isLocked: true,
            role: "USER",
            createdAt: "2023-04-10T09:15:00Z",
          },
          {
            id: "4",
            username: "alicejones",
            email: "alice.jones@example.com",
            fullName: "Alice Jones",
            avatarUrl: "",
            isActive: true,
            isLocked: false,
            role: "ADMIN",
            createdAt: "2023-03-05T11:20:00Z",
          },
          {
            id: "5",
            username: "mikebrown",
            email: "mike.brown@example.com",
            fullName: "Mike Brown",
            avatarUrl: "",
            isActive: true,
            isLocked: false,
            role: "USER",
            createdAt: "2023-07-12T16:30:00Z",
          },
        ])

        // Mock quizzes
        setQuizzes([
          {
            id: "1",
            title: "World History Basics",
            createdBy: "johndoe",
            tags: ["History", "Education"],
            isPublic: true,
            questionCount: 10,
            createdAt: "2023-06-15T10:30:00Z",
          },
          {
            id: "2",
            title: "Advanced Mathematics",
            createdBy: "janedoe",
            tags: ["Math", "Education"],
            isPublic: true,
            questionCount: 15,
            createdAt: "2023-07-20T14:45:00Z",
          },
          {
            id: "3",
            title: "Programming Basics",
            createdBy: "bobsmith",
            tags: ["Programming", "Computer Science"],
            isPublic: true,
            questionCount: 12,
            createdAt: "2023-05-10T09:15:00Z",
          },
          {
            id: "4",
            title: "English Literature",
            createdBy: "alicejones",
            tags: ["Literature", "Education"],
            isPublic: false,
            questionCount: 8,
            createdAt: "2023-04-05T11:20:00Z",
          },
          {
            id: "5",
            title: "Biology 101",
            createdBy: "mikebrown",
            tags: ["Biology", "Science"],
            isPublic: true,
            questionCount: 20,
            createdAt: "2023-08-12T16:30:00Z",
          },
        ])

        // Mock flashcards
        setFlashcards([
          {
            id: "1",
            title: "Spanish Vocabulary",
            createdBy: "johndoe",
            tags: ["Spanish", "Language"],
            isPublic: true,
            cardCount: 50,
            createdAt: "2023-06-18T10:30:00Z",
          },
          {
            id: "2",
            title: "Chemistry Elements",
            createdBy: "janedoe",
            tags: ["Chemistry", "Science"],
            isPublic: true,
            cardCount: 118,
            createdAt: "2023-07-25T14:45:00Z",
          },
          {
            id: "3",
            title: "JavaScript Concepts",
            createdBy: "bobsmith",
            tags: ["Programming", "JavaScript"],
            isPublic: true,
            cardCount: 35,
            createdAt: "2023-05-12T09:15:00Z",
          },
          {
            id: "4",
            title: "Literary Terms",
            createdBy: "alicejones",
            tags: ["Literature", "Education"],
            isPublic: false,
            cardCount: 42,
            createdAt: "2023-04-08T11:20:00Z",
          },
          {
            id: "5",
            title: "Anatomy Basics",
            createdBy: "mikebrown",
            tags: ["Anatomy", "Medicine"],
            isPublic: true,
            cardCount: 75,
            createdAt: "2023-08-15T16:30:00Z",
          },
        ])

        // Mock reports
        setReports([
          {
            id: "1",
            type: "QUIZ",
            contentId: "3",
            contentTitle: "Programming Basics",
            reportedBy: "alicejones",
            reason: "Inappropriate content",
            status: "PENDING",
            createdAt: "2023-08-10T10:30:00Z",
          },
          {
            id: "2",
            type: "USER",
            contentId: "3",
            contentTitle: "bobsmith",
            reportedBy: "johndoe",
            reason: "Spam",
            status: "PENDING",
            createdAt: "2023-08-12T14:45:00Z",
          },
          {
            id: "3",
            type: "FLASHCARD",
            contentId: "2",
            contentTitle: "Chemistry Elements",
            reportedBy: "mikebrown",
            reason: "Incorrect information",
            status: "RESOLVED",
            createdAt: "2023-08-05T09:15:00Z",
          },
          {
            id: "4",
            type: "QUIZ",
            contentId: "5",
            contentTitle: "Biology 101",
            reportedBy: "janedoe",
            reason: "Copyright violation",
            status: "PENDING",
            createdAt: "2023-08-08T11:20:00Z",
          },
          {
            id: "5",
            type: "USER",
            contentId: "5",
            contentTitle: "mikebrown",
            reportedBy: "bobsmith",
            reason: "Harassment",
            status: "REJECTED",
            createdAt: "2023-08-07T16:30:00Z",
          },
        ])
      } catch (err) {
        console.error("Error fetching admin data:", err)
        setError("Failed to load admin dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Handle user status toggle
  const handleUserStatusToggle = async (userId: string, field: "isActive" | "isLocked", value: boolean) => {
    try {
      // In a real implementation, this would be an API call
      console.log(`Updating user ${userId} ${field} to ${value}`)

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                [field]: value,
              }
            : user,
        ),
      )
    } catch (err) {
      console.error(`Error updating user ${field}:`, err)
      setError(`Failed to update user ${field}. Please try again.`)
    }
  }

  // Handle content deletion
  const handleDeleteContent = async (type: "QUIZ" | "FLASHCARD", contentId: string) => {
    if (!confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) return

    try {
      // In a real implementation, this would be an API call
      console.log(`Deleting ${type} ${contentId}`)

      // Update local state
      if (type === "QUIZ") {
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== contentId))
      } else {
        setFlashcards((prevFlashcards) => prevFlashcards.filter((flashcard) => flashcard.id !== contentId))
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err)
      setError(`Failed to delete ${type}. Please try again.`)
    }
  }

  // Handle report resolution
  const handleReportResolution = async (reportId: string, resolution: "RESOLVED" | "REJECTED") => {
    try {
      // In a real implementation, this would be an API call
      console.log(`Resolving report ${reportId} as ${resolution}`)

      // Update local state
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: resolution,
              }
            : report,
        ),
      )
    } catch (err) {
      console.error("Error resolving report:", err)
      setError("Failed to resolve report. Please try again.")
    }
  }

  // Open user details dialog
  const openUserDialog = (user: any) => {
    setSelectedUser(user)
    setIsUserDialogOpen(true)
  }

  // Filter users by search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter quizzes by search query
  const filteredQuizzes = quizzes.filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Filter flashcards by search query
  const filteredFlashcards = flashcards.filter((flashcard) =>
    flashcard.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Loading admin dashboard...</h2>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.activeUsers} active ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                  <p className="text-3xl font-bold">{stats.totalQuizzes + stats.totalFlashcards}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.totalQuizzes} quizzes, {stats.totalFlashcards} flashcards
                  </p>
                </div>
                <div className="bg-secondary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reports</p>
                  <p className="text-3xl font-bold">{stats.totalReports}</p>
                  <p className="text-sm text-muted-foreground">{stats.pendingReports} pending</p>
                </div>
                <div className="bg-destructive/10 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users, quizzes, or flashcards..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {user.avatarUrl ? (
                                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.username} />
                                ) : null}
                                <AvatarFallback>
                                  {user.fullName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.fullName}</div>
                                <div className="text-sm text-muted-foreground">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "ADMIN" ? "secondary" : "outline"}>{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={user.isActive ? "success" : "destructive"}
                                className={`${
                                  user.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {user.isLocked && (
                                <Badge
                                  variant="outline"
                                  className="border-yellow-200 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                >
                                  Locked
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => openUserDialog(user)}>
                                Details
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleUserStatusToggle(user.id, "isActive", !user.isActive)}
                                  >
                                    {user.isActive ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUserStatusToggle(user.id, "isLocked", !user.isLocked)}
                                  >
                                    {user.isLocked ? "Unlock" : "Lock"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quizzes</CardTitle>
                  <CardDescription>Manage quizzes created by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No quizzes found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredQuizzes.map((quiz) => (
                          <TableRow key={quiz.id}>
                            <TableCell>
                              <div className="font-medium">{quiz.title}</div>
                            </TableCell>
                            <TableCell>@{quiz.createdBy}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {quiz.tags.map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{quiz.questionCount}</TableCell>
                            <TableCell>
                              <Badge
                                variant={quiz.isPublic ? "outline" : "secondary"}
                                className={quiz.isPublic ? "" : "bg-muted"}
                              >
                                {quiz.isPublic ? "Public" : "Private"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(quiz.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/quizzes/${quiz.id}`)}>
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleDeleteContent("QUIZ", quiz.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flashcards</CardTitle>
                  <CardDescription>Manage flashcards created by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Cards</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFlashcards.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No flashcards found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredFlashcards.map((flashcard) => (
                          <TableRow key={flashcard.id}>
                            <TableCell>
                              <div className="font-medium">{flashcard.title}</div>
                            </TableCell>
                            <TableCell>@{flashcard.createdBy}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {flashcard.tags.map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{flashcard.cardCount}</TableCell>
                            <TableCell>
                              <Badge
                                variant={flashcard.isPublic ? "outline" : "secondary"}
                                className={flashcard.isPublic ? "" : "bg-muted"}
                              >
                                {flashcard.isPublic ? "Public" : "Private"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(flashcard.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/flashcards/${flashcard.id}`)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleDeleteContent("FLASHCARD", flashcard.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Content Reports</CardTitle>
                <CardDescription>Review and resolve reported content</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No reports found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Badge variant="outline">
                              {report.type === "QUIZ" ? (
                                <BookOpen className="h-3 w-3 mr-1" />
                              ) : report.type === "FLASHCARD" ? (
                                <Grid className="h-3 w-3 mr-1" />
                              ) : (
                                <Users className="h-3 w-3 mr-1" />
                              )}
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{report.contentTitle}</div>
                            <div className="text-xs text-muted-foreground">ID: {report.contentId}</div>
                          </TableCell>
                          <TableCell>@{report.reportedBy}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === "PENDING"
                                  ? "outline"
                                  : report.status === "RESOLVED"
                                    ? "success"
                                    : "destructive"
                              }
                              className={
                                report.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : report.status === "RESOLVED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(report.createdAt)}</TableCell>
                          <TableCell>
                            {report.status === "PENDING" ? (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => handleReportResolution(report.id, "RESOLVED")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => handleReportResolution(report.id, "REJECTED")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/${report.type.toLowerCase()}s/${report.contentId}`)}
                              >
                                View Content
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Details Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>Detailed information about the user</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {selectedUser.avatarUrl ? (
                      <AvatarImage src={selectedUser.avatarUrl || "/placeholder.svg"} alt={selectedUser.username} />
                    ) : null}
                    <AvatarFallback className="text-lg">
                      {selectedUser.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{selectedUser.fullName}</h3>
                    <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                    <p>{selectedUser.role}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                    <p>{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={selectedUser.isActive ? "success" : "destructive"}
                        className={`${
                          selectedUser.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {selectedUser.isLocked && (
                        <Badge
                          variant="outline"
                          className="border-yellow-200 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="active-toggle" className="text-sm font-medium">
                      Active
                    </label>
                    <Switch
                      id="active-toggle"
                      checked={selectedUser.isActive}
                      onCheckedChange={(checked) => {
                        handleUserStatusToggle(selectedUser.id, "isActive", checked)
                        setSelectedUser({ ...selectedUser, isActive: checked })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="locked-toggle" className="text-sm font-medium">
                      Locked
                    </label>
                    <Switch
                      id="locked-toggle"
                      checked={selectedUser.isLocked}
                      onCheckedChange={(checked) => {
                        handleUserStatusToggle(selectedUser.id, "isLocked", checked)
                        setSelectedUser({ ...selectedUser, isLocked: checked })
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
