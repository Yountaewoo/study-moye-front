import { CATEGORIES, LOCATIONS } from "./constants"
import { setAuthInfo, clearAuthInfo, type UserInfo, getToken } from "./auth"

// API 응답 타입
export interface PostResponse {
  postId: number
  categoryId: number
  locationId: number | null
  title: string
  content: string
  maxNumber: number
  minNumber: number
  isActive: boolean
  startDate: string
  endDate: string
}

export interface FilterPostResponse {
  postResponseList: PostResponse[]
}

// API 요청 파라미터 타입
export interface FilterParams {
  locationIds?: number[]
  categoryIds?: number[]
  minNumber?: number
  maxNumber?: number
  isOnline?: boolean
  searchWord?: string
  isActive?: boolean
}

const API_BASE_URL = "http://localhost:8080/api"

// 스터디 목록 조회 API
export async function fetchPosts(params: FilterParams = {}): Promise<FilterPostResponse> {
  const searchParams = new URLSearchParams()

  if (params.locationIds && params.locationIds.length > 0) {
    params.locationIds.forEach((id) => searchParams.append("locationIds", String(id)))
  }
  if (params.categoryIds && params.categoryIds.length > 0) {
    params.categoryIds.forEach((id) => searchParams.append("categoryIds", String(id)))
  }
  if (params.minNumber !== undefined) {
    searchParams.append("minNumber", String(params.minNumber))
  }
  if (params.maxNumber !== undefined) {
    searchParams.append("maxNumber", String(params.maxNumber))
  }
  if (params.isOnline !== undefined) {
    searchParams.append("isOnline", String(params.isOnline))
  }
  if (params.searchWord) {
    searchParams.append("searchWord", params.searchWord)
  }
  if (params.isActive !== undefined) {
    searchParams.append("isActive", String(params.isActive))
  }

  const url = `${API_BASE_URL}/posts${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    return response.json()
  } catch {
    // mock 데이터 제거: API 실패 시 빈 목록을 숨기지 않고 호출측에서 처리하도록 에러를 던짐
    throw new Error("Failed to fetch posts")
  }
}

// 카테고리 ID로 이름 가져오기
export function getCategoryNameById(categoryId: number): string {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  return category?.name || "기타"
}

// 지역 ID로 이름 가져오기
export function getLocationNameById(locationId: number | null): string | null {
  if (locationId === null) return null
  const location = LOCATIONS.find((l) => l.id === locationId)
  return location?.name || null
}

// 카테고리 이름으로 ID 가져오기
export function getCategoryIdByName(name: string): number | undefined {
  const category = CATEGORIES.find((c) => c.name === name)
  return category?.id
}

// 지역 이름으로 ID 가져오기
export function getLocationIdByName(name: string): number | undefined {
  const location = LOCATIONS.find((l) => l.name === name)
  return location?.id
}

// 성별 타입
export type Gender = "MALE" | "FEMALE"

// 회원가입 요청 타입
export interface SignupRequest {
  userLoginId: string
  memberName: string
  memberEmail: string
  nickname: string
  password: string
  confirmPassword: string
  memberBirth: string // "YYYY-MM-DD" 형식
  memberGender: Gender
}

// 회원가입 API
export async function signup(data: SignupRequest): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "회원가입에 실패했습니다.")
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "회원가입에 실패했습니다." }
  }
}

// 로그인 요청 타입
export interface LoginRequest {
  userLoginId: string
  password: string
}

// 로그인 응답 타입 (서버에서 쿠키로 토큰 설정)
export interface LoginResponse {
  memberId: number
  nickname: string
  memberEmail: string
}

// 로그인 API
export async function login(data: LoginRequest): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함
      // 백엔드가 identifier 필드를 기대하는 케이스 대응
      body: JSON.stringify({ identifier: data.userLoginId, password: data.password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "로그인에 실패했습니다.")
    }

    const result = await response.json()
    const loginData: LoginResponse = result.data || result
    
    // 로그인 정보 저장
    setAuthInfo({
      memberId: loginData.memberId,
      nickname: loginData.nickname,
      memberEmail: loginData.memberEmail,
    })
    
    return { success: true, data: loginData }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "로그인에 실패했습니다." }
  }
}

// 로그아웃 API
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // 쿠키 포함
    })

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다.")
    }

    // 로컬 인증 정보 삭제
    clearAuthInfo()
    return { success: true }
  } catch {
    // API 연결 실패해도 로컬 정보는 삭제
    clearAuthInfo()
    return { success: true }
  }
}

// 댓글 타입
export interface Comment {
  commentId: number
  postId: number
  userId: number
  content: string
  memberNickname: string
}

// 게시글 상세 응답 타입
export interface PostDetailResponse {
  postId: number
  categoryId: number
  locationId: number | null
  title: string
  content: string
  maxNumber: number
  minNumber: number
  commentResponses: Comment[]
  isActive: boolean
  startDate: string
  endDate: string
}

// 게시글 상세 조회 API
export async function fetchPostDetail(postId: number): Promise<{ success: boolean; data?: PostDetailResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`)

    if (!response.ok) {
      throw new Error("게시글을 찾을 수 없습니다.")
    }

    const data: PostDetailResponse = await response.json()
    return { success: true, data }
  } catch {
    return { success: false, error: "게시글을 찾을 수 없습니다." }
  }
}

// 댓글 생성 API
export interface CreateCommentResponse {
  commentId: number
  postId: number
  userId: number
  content: string
}

export async function createComment(
  postId: number,
  content: string,
): Promise<{ success: boolean; data?: CreateCommentResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키로 인증
      body: JSON.stringify({ postId, content }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.")
      }
      throw new Error("댓글 작성에 실패했습니다.")
    }

    const result = await response.json().catch(() => null)
    const data: CreateCommentResponse | undefined = result?.data ?? result ?? undefined

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "댓글 작성에 실패했습니다." }
  }
}

// 내 스터디 목록 응답 타입
export interface PostListResponse {
  postResponses: PostResponse[]
}

// 내 스터디 목록 조회 API
export async function fetchMyPosts(): Promise<{ success: boolean; data?: PostListResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/myPosts`, {
      credentials: "include", // 쿠키로 인증
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.")
      }
      throw new Error("스터디 목록을 불러올 수 없습니다.")
    }

    const data: PostListResponse = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "스터디 목록을 불러올 수 없습니다." }
  }
}

// 스터디 생성 요청 타입
export interface CreatePostRequest {
  categoryId: number
  locationId: number | null
  title: string
  content: string
  maxNumber: number
  minNumber: number
  isOnline: boolean
  startDate: string // "YYYY-MM-DD" 형식
  endDate: string // "YYYY-MM-DD" 형식
}

// 스터디 생성 응답 타입
export interface CreatePostResponse {
  postId: number
  categoryId: number
  locationId: number | null
  title: string
  content: string
  minNumber: number
  maxNumber: number
  isActive: boolean
  startDate: string
  endDate: string
}

// 스터디 생성 API
export async function createPost(data: CreatePostRequest): Promise<{ success: boolean; data?: CreatePostResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키로 인증
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create post")
    }

    const result: CreatePostResponse = await response.json()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create post" }
  }
}

// 게시글 모집 종료 API
export async function closePost(postId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "PUT",
      credentials: "include", // 쿠키로 인증
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.")
      }
      if (response.status === 403) {
        throw new Error("게시글 작성자만 모집을 종료할 수 있습니다.")
      }
      throw new Error("모집 종료에 실패했습니다.")
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "모집 종료에 실패했습니다." }
  }
}
