import apiClient from "./api-client"
import type { User } from "@/types/user"

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user?: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials)
      this.setSession(response.token, response.refreshToken)

      // Fetch user profile if not included in response
      const user = response.user || (await this.getCurrentUser())
      localStorage.setItem("user", JSON.stringify(user))

      return user
    } catch (error) {
      throw error
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", userData)
      this.setSession(response.token, response.refreshToken)

      // Fetch user profile if not included in response
      const user = response.user || (await this.getCurrentUser())
      localStorage.setItem("user", JSON.stringify(user))

      return user
    } catch (error) {
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      this.clearSession()
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>("/users/me")
    } catch (error) {
      throw error
    }
  }

  // Request password reset
  async forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>("/auth/forgot-password", request)
    } catch (error) {
      throw error
    }
  }

  // Reset password with token
  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>("/auth/reset-password", request)
    } catch (error) {
      throw error
    }
  }

  // Change password (authenticated)
  async changePassword(request: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>("/auth/change-password", request)
    } catch (error) {
      throw error
    }
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>("/auth/verify-email", { token })
    } catch (error) {
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  }

  // Get current user from localStorage
  getUser(): User | null {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }

  // Set auth session
  private setSession(token: string, refreshToken: string): void {
    localStorage.setItem("token", token)
    localStorage.setItem("refreshToken", refreshToken)
  }

  // Clear auth session
  private clearSession(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }
}

// Create and export a singleton instance
const authService = new AuthService()
export default authService
