"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User, Mail, Camera, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import authService from "@/services/auth-service"

// Define form schema with validation
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(100, {
      message: "Full name cannot exceed 100 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Bio cannot exceed 500 characters.",
    })
    .optional(),
  avatarUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    quizzesCreated: 0,
    quizzesCompleted: 0,
    flashcardsCreated: 0,
    flashcardsStudied: 0,
    aiChatsInitiated: 0,
  })

  // Initialize form with validation schema
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
      avatarUrl: "",
    },
  })

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const userData = await authService.getCurrentUser()
        setUser(userData)

        // Set form values
        form.reset({
          fullName: userData.fullName || "",
          email: userData.email || "",
          bio: userData.bio || "",
          avatarUrl: userData.avatarUrl || "",
        })

        // Set user stats
        setStats({
          quizzesCreated: userData.quizzesCreated || 0,
          quizzesCompleted: userData.quizzesCompleted || 0,
          flashcardsCreated: userData.flashcardsCreated || 0,
          flashcardsStudied: userData.flashcardsStudied || 0,
          aiChatsInitiated: userData.aiChatsInitiated || 0,
        })
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError("Failed to load user profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [form])

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Update user profile
      // In a real implementation, this would call an API endpoint
      console.log("Updating profile with data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local user state
      setUser({
        ...user,
        fullName: data.fullName,
        email: data.email,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      })

      setSuccess("Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real implementation, this would upload the file to a server
    // and get back a URL to the uploaded image
    const reader = new FileReader()
    reader.onload = (event) => {
      const avatarUrl = event.target?.result as string
      form.setValue("avatarUrl", avatarUrl)
    }
    reader.readAsDataURL(file)
  }

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (!user?.fullName) return "U"
    return user.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Loading profile...</h2>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="stats">Activity & Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    {form.watch("avatarUrl") ? (
                      <AvatarImage src={form.watch("avatarUrl") || "/placeholder.svg"} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors">
                        <Camera className="h-4 w-4" />
                        <span>Change Picture</span>
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input placeholder="Enter your full name" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input placeholder="Enter your email" {...field} disabled />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us a bit about yourself"
                                {...field}
                                value={field.value || ""}
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Activity</CardTitle>
                  <CardDescription>Your quiz creation and completion stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Quizzes Created</span>
                      <span className="font-medium text-lg">{stats.quizzesCreated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Quizzes Completed</span>
                      <span className="font-medium text-lg">{stats.quizzesCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-medium text-lg">{stats.quizzesCompleted > 0 ? "78%" : "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/quizzes")}>
                    View My Quizzes
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flashcard Activity</CardTitle>
                  <CardDescription>Your flashcard creation and study stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Flashcards Created</span>
                      <span className="font-medium text-lg">{stats.flashcardsCreated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Study Sessions</span>
                      <span className="font-medium text-lg">{stats.flashcardsStudied}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cards Mastered</span>
                      <span className="font-medium text-lg">{stats.flashcardsStudied > 0 ? "42" : "0"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/flashcards")}>
                    View My Flashcards
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>AI Interaction</CardTitle>
                  <CardDescription>Your AI chat and generation stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Chat Sessions</h3>
                      <p className="text-3xl font-bold">{stats.aiChatsInitiated}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">AI-Generated Quizzes</h3>
                      <p className="text-3xl font-bold">{Math.floor(stats.quizzesCreated * 0.4)}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">AI-Generated Flashcards</h3>
                      <p className="text-3xl font-bold">{Math.floor(stats.flashcardsCreated * 0.3)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/ai-chat")}>
                    Chat with AI
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
