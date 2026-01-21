"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ArrowLeft } from "lucide-react"
import { CATEGORIES, getParentLocations, getChildLocations } from "@/lib/constants"
import { createPost, type CreatePostRequest } from "@/lib/api"
import { isLoggedIn } from "@/lib/auth"

export default function CreateStudyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.")
      router.push("/login")
    }
  }, [router])
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    content: "",
    isOnline: "",
    locationParent: "",
    locationId: "",
    minNumber: "",
    maxNumber: "",
    startDate: "",
    endDate: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 오프라인일 때 구/군이 있는 시/도를 선택했으면 구/군도 필수
    if (formData.isOnline === "false" && formData.locationParent) {
      const childLocations = getChildLocations(Number(formData.locationParent))
      if (childLocations.length > 0 && !formData.locationId) {
        alert("구/군을 선택해주세요.")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const requestData: CreatePostRequest = {
        categoryId: Number(formData.categoryId),
        locationId: formData.isOnline === "true" ? null : (formData.locationId ? Number(formData.locationId) : (formData.locationParent ? Number(formData.locationParent) : null)),
        title: formData.title,
        content: formData.content,
        maxNumber: Number(formData.maxNumber),
        minNumber: Number(formData.minNumber),
        isOnline: formData.isOnline === "true",
        startDate: formData.startDate,
        endDate: formData.endDate,
      }

      const result = await createPost(requestData)
      
      if (result.success) {
        alert("스터디가 생성되었습니다!")
        router.push("/")
      } else {
        alert(result.error || "스터디 생성에 실패했습니다.")
      }
    } catch {
      alert("스터디 생성 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">스터디모여</span>
          </Link>
          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">스터디 생성</CardTitle>
            <CardDescription className="text-muted-foreground">
              새로운 스터디를 만들고 함께할 팀원을 모집하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  스터디 제목 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="예: React 스터디 모집합니다"
                  value={formData.title}
                  onChange={handleChange}
                  className="border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-foreground">
                  스터디 소개 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="스터디 목표, 진행 방식, 일정 등을 자세히 적어주세요"
                  value={formData.content}
                  onChange={handleChange}
                  className="min-h-32 border-border bg-background focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-foreground">
                    카테고리 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                    required
                  >
                    <SelectTrigger className="border-border bg-background focus:ring-primary">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    진행 방식 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.isOnline}
                    onValueChange={(value) => {
                      handleSelectChange("isOnline", value)
                      if (value === "true") {
                        handleSelectChange("locationParent", "")
                        handleSelectChange("locationId", "")
                      }
                    }}
                    required
                  >
                    <SelectTrigger className="border-border bg-background focus:ring-primary">
                      <SelectValue placeholder="진행 방식 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">온라인</SelectItem>
                      <SelectItem value="false">오프라인</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.isOnline === "false" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-foreground">
                      시/도 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.locationParent}
                      onValueChange={(value) => {
                        handleSelectChange("locationParent", value)
                        handleSelectChange("locationId", "")
                      }}
                      required
                    >
                      <SelectTrigger className="border-border bg-background focus:ring-primary">
                        <SelectValue placeholder="시/도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {getParentLocations().map((loc) => (
                          <SelectItem key={loc.id} value={String(loc.id)}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.locationParent && getChildLocations(Number(formData.locationParent)).length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-foreground">
                        구/군 <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.locationId}
                        onValueChange={(value) => handleSelectChange("locationId", value)}
                        required
                      >
                        <SelectTrigger className="border-border bg-background focus:ring-primary">
                          <SelectValue placeholder="구/군 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {getChildLocations(Number(formData.locationParent)).map((loc) => (
                            <SelectItem key={loc.id} value={String(loc.id)}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minNumber" className="text-foreground">
                    최소 인원 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="minNumber"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="예: 2"
                    value={formData.minNumber}
                    onChange={handleChange}
                    className="border-border bg-background focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxNumber" className="text-foreground">
                    최대 인원 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="maxNumber"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="예: 6"
                    value={formData.maxNumber}
                    onChange={handleChange}
                    className="border-border bg-background focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-foreground">
                    시작일 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="border-border bg-background focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-foreground">
                    종료일 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="border-border bg-background focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border text-muted-foreground hover:text-foreground bg-transparent"
                  asChild
                >
                  <Link href="/">취소</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "생성 중..." : "스터디 생성"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
