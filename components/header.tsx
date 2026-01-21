"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Plus, User, LogOut } from "lucide-react"
import { isLoggedIn, getAuthInfo, type UserInfo } from "@/lib/auth"
import { logout } from "@/lib/api"

export function Header() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 클라이언트에서만 로그인 상태 확인
    setUserInfo(getAuthInfo())
    setIsLoading(false)
  }, [])

  const handleCreateClick = () => {
    if (isLoggedIn()) {
      router.push("/create")
    } else {
      alert("로그인이 필요합니다.")
      router.push("/login")
    }
  }

  const handleLogout = async () => {
    await logout()
    setUserInfo(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">스터디모여</span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="group gap-2 text-sm font-medium cursor-pointer !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-transparent hover:text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-transform duration-200 group-hover:scale-110">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline">{userInfo.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {userInfo.memberEmail}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-studies" className="cursor-pointer">
                    내 스터디
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    프로필 설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
