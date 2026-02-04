"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Users, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchPosts, getCategoryIdByName, getLocationIdByName, getCategoryNameById, getLocationNameById, type PostResponse, type FilterParams } from "@/lib/api"
import { isAdmin } from "@/lib/auth"

export default function AdminPage() {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [studies, setStudies] = useState<PostResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchWord, setSearchWord] = useState("")
  const [minNumber, setMinNumber] = useState("")
  const [maxNumber, setMaxNumber] = useState("")

  // 관리자 권한 확인
  useEffect(() => {
    if (!isAdmin()) {
      alert("관리자 권한이 필요합니다.")
      router.push("/")
    }
  }, [router])

  // 필터를 API 파라미터로 변환
  const buildFilterParams = useCallback((filters: Record<string, string[]>): FilterParams => {
    const params: FilterParams = {}

    if (filters["카테고리"]?.length > 0) {
      params.categoryIds = filters["카테고리"]
        .map((name) => getCategoryIdByName(name))
        .filter((id): id is number => id !== undefined)
    }

    if (filters["지역"]?.length > 0) {
      params.locationIds = filters["지역"]
        .map((name) => getLocationIdByName(name))
        .filter((id): id is number => id !== undefined)
    }

    if (filters["진행 방식"]?.length > 0) {
      const hasOnline = filters["진행 방식"].includes("온라인")
      const hasOffline = filters["진행 방식"].includes("오프라인") || filters["진행 방식"].includes("온/오프라인")
      
      if (hasOnline && !hasOffline) {
        params.isOnline = true
      } else if (!hasOnline && hasOffline) {
        params.isOnline = false
      }
    }

    if (filters["모집 상태"]?.length > 0) {
      const wantActive = filters["모집 상태"].includes("모집중")
      const wantInactive = filters["모집 상태"].includes("모집완료")
      
      if (wantActive && !wantInactive) {
        params.isActive = true
      } else if (!wantActive && wantInactive) {
        params.isActive = false
      }
    }

    if (searchWord.trim()) {
      params.searchWord = searchWord.trim()
    }

    if (minNumber) {
      params.minNumber = Number.parseInt(minNumber, 10)
    }
    if (maxNumber) {
      params.maxNumber = Number.parseInt(maxNumber, 10)
    }

    return params
  }, [searchWord, minNumber, maxNumber])

  // API 호출
  const loadStudies = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = buildFilterParams(selectedFilters)
      const response = await fetchPosts(params)
      setStudies(response.postResponseList)
    } catch (error) {
      console.error("Failed to fetch studies:", error)
      setStudies([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedFilters, buildFilterParams])

  useEffect(() => {
    loadStudies()
  }, [loadStudies])

  const handleFilterChange = (section: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[section] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [section]: newValues,
      }
    })
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
    setSearchWord("")
    setMinNumber("")
    setMaxNumber("")
  }

  const handleDeletePost = async (postId: number) => {
    if (!confirm("정말로 이 스터디를 삭제하시겠습니까?")) return
    
    // TODO: 삭제 API 호출
    alert(`스터디 ID ${postId} 삭제 (API 구현 필요)`)
    loadStudies() // 목록 새로고침
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-xl bg-destructive/10 p-6 md:p-10 border-2 border-destructive/20">
          <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            🛡️ 관리자 페이지
          </h1>
          <p className="mt-2 text-muted-foreground">
            스터디 관리 페이지입니다. 게시글과 댓글을 삭제할 수 있습니다.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            searchWord={searchWord}
            onSearchChange={setSearchWord}
            minNumber={minNumber}
            maxNumber={maxNumber}
            onMinNumberChange={setMinNumber}
            onMaxNumberChange={setMaxNumber}
          />
        </div>

        {/* Study Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{studies.length}</span>개의 스터디
          </p>
        </div>

        {/* Study Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : studies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => {
              const categoryName = getCategoryNameById(study.categoryId)
              const locationName = study.locationId ? getLocationNameById(study.locationId) : null
              const isOnline = study.locationId === null

              return (
                <Card key={study.postId} className="relative h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant={study.isActive ? "default" : "secondary"}
                        className={study.isActive ? "bg-primary text-primary-foreground" : ""}
                      >
                        {study.isActive ? "모집중" : "모집완료"}
                      </Badge>
                      <Badge variant="outline">{categoryName}</Badge>
                    </div>

                    <Link href={`/posts/${study.postId}`}>
                      <h3 className="mb-2 line-clamp-2 font-semibold text-foreground cursor-pointer hover:text-primary">
                        {study.title}
                      </h3>
                    </Link>

                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {study.content}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{study.minNumber}~{study.maxNumber}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{isOnline ? "온라인" : locationName || "오프라인"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{study.startDate} ~ {study.endDate}</span>
                      </div>
                    </div>

                    {/* 관리자 삭제 버튼 */}
                    <Button
                      onClick={() => handleDeletePost(study.postId)}
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      스터디 삭제
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
