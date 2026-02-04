"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, Settings, Shield, LogOut } from "lucide-react"
import { isLoggedIn, clearAuthInfo } from "@/lib/auth"

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.")
      router.push("/admin/login")
    }
    // TODO: 관리자 권한 확인 로직 추가
  }, [router])

  const handleLogout = () => {
    clearAuthInfo()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">관리자 페이지</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                일반 페이지로
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
          <p className="mt-2 text-muted-foreground">스터디모여 관리자 대시보드입니다</p>
        </div>

        {/* 통계 카드 */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 스터디</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">+45 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 스터디</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">60% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">관리자</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* 관리 메뉴 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                사용자 관리
              </CardTitle>
              <CardDescription>사용자 목록 조회 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                바로가기
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                스터디 관리
              </CardTitle>
              <CardDescription>스터디 목록 조회 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                바로가기
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                댓글 관리
              </CardTitle>
              <CardDescription>댓글 목록 조회 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                바로가기
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                카테고리 관리
              </CardTitle>
              <CardDescription>카테고리 설정 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                바로가기
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                권한 관리
              </CardTitle>
              <CardDescription>관리자 권한 설정</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                바로가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
