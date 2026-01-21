"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react"
import { signup, type Gender } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    userLoginId: "",
    memberName: "",
    memberEmail: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    memberBirth: "",
    memberGender: "" as Gender | "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleGenderChange = (value: Gender) => {
    setFormData((prev) => ({
      ...prev,
      memberGender: value,
    }))
  }

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,20}$/
    return regex.test(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (!validatePassword(formData.password)) {
      setError("비밀번호는 8-20자이며, 영문, 숫자, 특수문자를 포함해야 합니다.")
      return
    }

    if (!formData.memberGender) {
      setError("성별을 선택해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const result = await signup({
        userLoginId: formData.userLoginId,
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        nickname: formData.nickname,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        memberBirth: formData.memberBirth,
        memberGender: formData.memberGender as Gender,
      })

      if (result.success) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.")
        router.push("/login")
      } else {
        setError(result.error || "회원가입에 실패했습니다.")
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.")
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
            <Link href="/" className="mx-auto flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">스터디모여</span>
            </Link>
            <div>
              <CardTitle className="text-xl text-foreground">회원가입</CardTitle>
              <CardDescription className="text-muted-foreground">
                스터디모여에 가입하고 함께 성장하세요
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
                  placeholder="로그인에 사용할 아이디"
                  value={formData.userLoginId}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberName" className="text-foreground">
                  이름 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="memberName"
                  type="text"
                  placeholder="홍길동"
                  value={formData.memberName}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-foreground">
                  닉네임 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="활동할 닉네임"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberEmail" className="text-foreground">
                  이메일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="memberEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.memberEmail}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  비밀번호 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8-20자, 영문+숫자+특수문자"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                  minLength={8}
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">
                  영문, 숫자, 특수문자를 포함한 8-20자
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  비밀번호 확인 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberBirth" className="text-foreground">
                  생년월일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="memberBirth"
                  type="date"
                  value={formData.memberBirth}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">
                  성별 <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.memberGender} onValueChange={handleGenderChange}>
                  <SelectTrigger className="border-border bg-background focus:ring-primary">
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">남성</SelectItem>
                    <SelectItem value="FEMALE">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed text-muted-foreground">
                  <Link href="/terms" className="text-primary hover:underline">
                    서비스 이용약관
                  </Link>
                  {" 및 "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    개인정보 처리방침
                  </Link>
                  에 동의합니다
                </Label>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!agreeTerms || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    가입 중...
                  </>
                ) : (
                  "회원가입"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <Link href="/login" className="font-medium text-primary hover:underline">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
