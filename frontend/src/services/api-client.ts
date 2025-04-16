import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

// Import environment configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

// Create a class to handle API requests
class ApiClient {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // If 401 and not already retrying, attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem("refreshToken")
            if (!refreshToken) {
              this.handleAuthError()
              return Promise.reject(error)
            }

            const response = await axios.post(`${API_URL}/auth/refresh-token`, {
              refreshToken,
            })

            const { token, refreshToken: newRefreshToken } = response.data
            localStorage.setItem("token", token)
            localStorage.setItem("refreshToken", newRefreshToken)

            // Retry the original request with new token
            this.api.defaults.headers.common.Authorization = `Bearer ${token}`
            return this.api(originalRequest)
          } catch (refreshError) {
            this.handleAuthError()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  // Handle authentication errors
  private handleAuthError() {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")

    // Redirect to login page if not already there
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login"
    }
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api(config)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  // GET request
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "get", url })
  }

  // POST request
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "post", url, data })
  }

  // PUT request
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "put", url, data })
  }

  // DELETE request
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "delete", url })
  }

  // Error handling
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data
      // You can customize error handling based on your API's error format
      throw new Error(serverError?.message || error.message || "An unexpected error occurred")
    }
    throw error
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()
export default apiClient
