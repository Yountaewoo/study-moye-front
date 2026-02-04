// 로그인 상태 저장 키
const AUTH_KEY = "studymoyeo_auth"

export type Role = "USER" | "ADMIN"

export interface UserInfo {
  memberId: number
  nickname: string
  memberEmail: string
  role: Role
}

// 로그인 정보 저장
export function setAuthInfo(userInfo: UserInfo): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userInfo))
  }
}

// 로그인 정보 가져오기
export function getAuthInfo(): UserInfo | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(AUTH_KEY)
    if (data) {
      try {
        return JSON.parse(data) as UserInfo
      } catch {
        return null
      }
    }
  }
  return null
}

// 로그인 정보 삭제 (로그아웃)
export function clearAuthInfo(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
  }
}

// 로그인 여부 확인
export function isLoggedIn(): boolean {
  return getAuthInfo() !== null
}

// 관리자 권한 확인
export function isAdmin(): boolean {
  const userInfo = getAuthInfo()
  return userInfo !== null && userInfo.role === "ADMIN"
}

// 기존 함수들 (하위 호환성)
export function setToken(token: string): void {
  // 쿠키 기반으로 변경되어 더 이상 토큰을 직접 저장하지 않음
}

export function getToken(): string | null {
  // 쿠키는 자동으로 전송되므로 null 반환
  return null
}

export function removeToken(): void {
  clearAuthInfo()
}
