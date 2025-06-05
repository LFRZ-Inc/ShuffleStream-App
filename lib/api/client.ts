import { 
  ApiResponse, 
  User, 
  Content, 
  ShuffleRequest, 
  ShuffleResult,
  UserList,
  ShufflePack,
  ViewingSession,
  WatchHistory,
  LeaderboardEntry,
  Achievement,
  SearchRequest,
  SearchResult,
  PaginatedResponse,
  UserPreferences,
  TMDBMovie,
  TMDBTVShow,
  TMDBGenre
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Authentication Endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: {
    username: string
    email: string
    password: string
    displayName: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.request<null>('/auth/logout', { method: 'POST' })
    this.clearToken()
    return response
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request('/auth/refresh', { method: 'POST' })
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  }

  // User Endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/users/me')
  }

  async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async updatePreferences(preferences: UserPreferences): Promise<ApiResponse<UserPreferences>> {
    return this.request('/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${userId}`)
  }

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`)
  }

  // Content Endpoints
  async getContent(contentId: string): Promise<ApiResponse<Content>> {
    return this.request(`/content/${contentId}`)
  }

  async searchContent(searchRequest: SearchRequest): Promise<ApiResponse<SearchResult>> {
    return this.request('/content/search', {
      method: 'POST',
      body: JSON.stringify(searchRequest),
    })
  }

  async getTrendingContent(): Promise<ApiResponse<Content[]>> {
    return this.request('/content/trending')
  }

  async getRecommendations(userId?: string): Promise<ApiResponse<Content[]>> {
    const endpoint = userId ? `/content/recommendations/${userId}` : '/content/recommendations'
    return this.request(endpoint)
  }

  async getContentByPlatform(platform: string): Promise<ApiResponse<PaginatedResponse<Content>>> {
    return this.request(`/content/platform/${platform}`)
  }

  async getContentByGenre(genre: string): Promise<ApiResponse<PaginatedResponse<Content>>> {
    return this.request(`/content/genre/${genre}`)
  }

  // Shuffle Endpoints
  async shuffle(request: ShuffleRequest): Promise<ApiResponse<ShuffleResult>> {
    return this.request('/shuffle', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getShuffleHistory(userId: string): Promise<ApiResponse<ShuffleResult[]>> {
    return this.request(`/shuffle/history/${userId}`)
  }

  // User Lists Endpoints
  async getUserLists(userId?: string): Promise<ApiResponse<UserList[]>> {
    const endpoint = userId ? `/lists/user/${userId}` : '/lists/me'
    return this.request(endpoint)
  }

  async createUserList(listData: Omit<UserList, 'id' | 'createdDate' | 'updatedDate'>): Promise<ApiResponse<UserList>> {
    return this.request('/lists', {
      method: 'POST',
      body: JSON.stringify(listData),
    })
  }

  async updateUserList(listId: string, listData: Partial<UserList>): Promise<ApiResponse<UserList>> {
    return this.request(`/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify(listData),
    })
  }

  async deleteUserList(listId: string): Promise<ApiResponse<null>> {
    return this.request(`/lists/${listId}`, { method: 'DELETE' })
  }

  async addToList(listId: string, contentId: string): Promise<ApiResponse<UserList>> {
    return this.request(`/lists/${listId}/content`, {
      method: 'POST',
      body: JSON.stringify({ contentId }),
    })
  }

  async removeFromList(listId: string, contentId: string): Promise<ApiResponse<UserList>> {
    return this.request(`/lists/${listId}/content/${contentId}`, { method: 'DELETE' })
  }

  // Shuffle Packs Endpoints
  async getShufflePacks(userId?: string): Promise<ApiResponse<ShufflePack[]>> {
    const endpoint = userId ? `/shuffle-packs/user/${userId}` : '/shuffle-packs/me'
    return this.request(endpoint)
  }

  async createShufflePack(packData: Omit<ShufflePack, 'id' | 'createdDate' | 'updatedDate' | 'likes' | 'uses'>): Promise<ApiResponse<ShufflePack>> {
    return this.request('/shuffle-packs', {
      method: 'POST',
      body: JSON.stringify(packData),
    })
  }

  async updateShufflePack(packId: string, packData: Partial<ShufflePack>): Promise<ApiResponse<ShufflePack>> {
    return this.request(`/shuffle-packs/${packId}`, {
      method: 'PUT',
      body: JSON.stringify(packData),
    })
  }

  async deleteShufflePack(packId: string): Promise<ApiResponse<null>> {
    return this.request(`/shuffle-packs/${packId}`, { method: 'DELETE' })
  }

  async likeShufflePack(packId: string): Promise<ApiResponse<ShufflePack>> {
    return this.request(`/shuffle-packs/${packId}/like`, { method: 'POST' })
  }

  async useShufflePack(packId: string): Promise<ApiResponse<ShuffleResult>> {
    return this.request(`/shuffle-packs/${packId}/use`, { method: 'POST' })
  }

  // Viewing History Endpoints
  async startViewingSession(sessionData: Omit<ViewingSession, 'id' | 'endTime'>): Promise<ApiResponse<ViewingSession>> {
    return this.request('/viewing/session/start', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  }

  async endViewingSession(sessionId: string, endData: { endTime: Date; progress: number }): Promise<ApiResponse<ViewingSession>> {
    return this.request(`/viewing/session/${sessionId}/end`, {
      method: 'PUT',
      body: JSON.stringify(endData),
    })
  }

  async getWatchHistory(userId?: string): Promise<ApiResponse<WatchHistory[]>> {
    const endpoint = userId ? `/viewing/history/${userId}` : '/viewing/history/me'
    return this.request(endpoint)
  }

  async markAsWatched(contentId: string, watchData: Partial<WatchHistory>): Promise<ApiResponse<WatchHistory>> {
    return this.request('/viewing/watched', {
      method: 'POST',
      body: JSON.stringify({ contentId, ...watchData }),
    })
  }

  async rateContent(contentId: string, rating: number, review?: string): Promise<ApiResponse<WatchHistory>> {
    return this.request(`/viewing/rate/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    })
  }

  // Social Endpoints
  async getFriends(): Promise<ApiResponse<User[]>> {
    return this.request('/social/friends')
  }

  async sendFriendRequest(userId: string): Promise<ApiResponse<null>> {
    return this.request('/social/friend-request', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async acceptFriendRequest(requestId: string): Promise<ApiResponse<null>> {
    return this.request(`/social/friend-request/${requestId}/accept`, { method: 'PUT' })
  }

  async rejectFriendRequest(requestId: string): Promise<ApiResponse<null>> {
    return this.request(`/social/friend-request/${requestId}/reject`, { method: 'PUT' })
  }

  async getFriendActivity(): Promise<ApiResponse<any[]>> {
    return this.request('/social/activity')
  }

  // Leaderboard Endpoints
  async getLeaderboard(type: 'weekly' | 'monthly' | 'alltime' = 'monthly'): Promise<ApiResponse<LeaderboardEntry[]>> {
    return this.request(`/leaderboard?type=${type}`)
  }

  async getUserRank(userId: string, type: 'weekly' | 'monthly' | 'alltime' = 'monthly'): Promise<ApiResponse<LeaderboardEntry>> {
    return this.request(`/leaderboard/user/${userId}?type=${type}`)
  }

  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return this.request('/achievements')
  }

  async getUserAchievements(userId?: string): Promise<ApiResponse<Achievement[]>> {
    const endpoint = userId ? `/achievements/user/${userId}` : '/achievements/me'
    return this.request(endpoint)
  }

  // Analytics Endpoints
  async getUserStats(userId?: string): Promise<ApiResponse<any>> {
    const endpoint = userId ? `/analytics/user/${userId}` : '/analytics/me'
    return this.request(endpoint)
  }

  async getViewingRecap(year: number, userId?: string): Promise<ApiResponse<any>> {
    const endpoint = userId ? `/analytics/recap/${year}/${userId}` : `/analytics/recap/${year}`
    return this.request(endpoint)
  }

  // Admin Endpoints
  async getAdminStats(): Promise<ApiResponse<any>> {
    return this.request('/admin/stats')
  }

  async getUsers(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.request(`/admin/users?page=${page}&limit=${limit}`)
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async getContentReports(): Promise<ApiResponse<any[]>> {
    return this.request('/admin/reports/content')
  }

  async getUserReports(): Promise<ApiResponse<any[]>> {
    return this.request('/admin/reports/users')
  }

  // TMDB Integration
  async searchTMDB(query: string, type: 'movie' | 'tv' = 'movie'): Promise<TMDBMovie[] | TMDBTVShow[]> {
    const url = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    const response = await fetch(url)
    const data = await response.json()
    return data.results || []
  }

  async getTMDBGenres(type: 'movie' | 'tv' = 'movie'): Promise<TMDBGenre[]> {
    const url = `${TMDB_BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data.genres || []
  }

  async getTMDBDetails(id: number, type: 'movie' | 'tv' = 'movie'): Promise<TMDBMovie | TMDBTVShow> {
    const url = `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
    const response = await fetch(url)
    return response.json()
  }

  async getTMDBTrending(type: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<(TMDBMovie | TMDBTVShow)[]> {
    const url = `${TMDB_BASE_URL}/trending/${type}/${timeWindow}?api_key=${TMDB_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()
    return data.results || []
  }
}

export const apiClient = new ApiClient()
export default apiClient 