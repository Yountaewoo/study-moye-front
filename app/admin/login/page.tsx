"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Loader2, Shield } from "lucide-react"
import { login } from "@/lib/api"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    userLoginId: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login({
        userLoginId: formData.userLoginId,
        password: formData.password,
      })

      if (result.success) {
        // TODO: 관리자 권한 확인 로직 추가
        // 임시로 모든 로그인 성공 시 대시보드로 이동
        alert("관리자 로그인 성공!")
        router.push("/admin/dashboard")
      } else {
        setError(result.error || "로그인에 실패했습니다.")
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">홈으로</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive">
                <Shield className="h-6 w-6 text-destructive-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">관리자 로그인</CardTitle>
              <CardDescription className="text-muted-foreground">
                관리자 계정으로 로그인하세요
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userLoginId" className="text-foreground">
                  아이디 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="userLoginId"
                  type="text"
                  placeholder="관리자 아이디"
                  value={formData.userLoginId}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-destructive"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  비밀번호 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-destructive"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "관리자 로그인"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">일반 사용자이신가요? </span>
              <Link href="/login" className="font-medium text-primary hover:underline">
                일반 로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
