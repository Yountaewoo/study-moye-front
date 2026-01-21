"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react"
import { login } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [userLoginId, setUserLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState(""); // Declare email variable

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login({ userLoginId, password })
      
      if (result.success) {
        router.push("/")
        router.refresh()
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
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="space-y-4 text-center">
            <Link href="/" className="mx-auto flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">스터디모여</span>
            </Link>
            <div>
              <CardTitle className="text-xl text-foreground">로그인</CardTitle>
              <CardDescription className="text-muted-foreground">
                계정에 로그인하고 스터디를 시작하세요
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userLoginId" className="text-foreground">아이디</Label>
                <Input
                  id="userLoginId"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={userLoginId}
                  onChange={(e) => setUserLoginId(e.target.value)}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">아직 계정이 없으신가요? </span>
              <Link href="/signup" className="font-medium text-primary hover:underline">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
