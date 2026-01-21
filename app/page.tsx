"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { StudyGrid } from "@/components/study-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { fetchPosts, getCategoryIdByName, getLocationIdByName, type PostResponse, type FilterParams } from "@/lib/api"
import { isLoggedIn } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [studies, setStudies] = useState<PostResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchWord, setSearchWord] = useState("")
  const [minNumber, setMinNumber] = useState("")
  const [maxNumber, setMaxNumber] = useState("")
  const [showCreateButton, setShowCreateButton] = useState(false)

  // 클라이언트에서만 로그인 상태 확인
  useEffect(() => {
    setShowCreateButton(isLoggedIn())
  }, [])

  const handleCreateClick = () => {
    router.push("/create")
  }

  // 필터를 API 파라미터로 변환
  const buildFilterParams = useCallback((filters: Record<string, string[]>): FilterParams => {
    const params: FilterParams = {}

    // 카테고리 필터
    if (filters["카테고리"]?.length > 0) {
      params.categoryIds = filters["카테고리"]
        .map((name) => getCategoryIdByName(name))
        .filter((id): id is number => id !== undefined)
    }

    // 지역 필터
    if (filters["지역"]?.length > 0) {
      params.locationIds = filters["지역"]
        .map((name) => getLocationIdByName(name))
        .filter((id): id is number => id !== undefined)
    }

    // 진행 방식 필터 (온라인/오프라인)
    if (filters["진행 방식"]?.length > 0) {
      const hasOnline = filters["진행 방식"].includes("온라인")
      const hasOffline = filters["진행 방식"].includes("오프라인") || filters["진행 방식"].includes("온/오프라인")
      
      // 온라인만 선택된 경우
      if (hasOnline && !hasOffline) {
        params.isOnline = true
      }
      // 오프라인만 선택된 경우
      else if (!hasOnline && hasOffline) {
        params.isOnline = false
      }
      // 둘 다 선택되면 필터 적용하지 않음 (모든 결과)
    }

    // 모집 상태 필터
    if (filters["모집 상태"]?.length > 0) {
      const wantActive = filters["모집 상태"].includes("모집중")
      const wantInactive = filters["모집 상태"].includes("모집완료")
      
      if (wantActive && !wantInactive) {
        params.isActive = true
      } else if (!wantActive && wantInactive) {
        params.isActive = false
      }
      // 둘 다 선택되면 필터 적용하지 않음 (모든 결과)
    }

    // 검색어 필터
    if (searchWord.trim()) {
      params.searchWord = searchWord.trim()
    }

    // 인원수 필터
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
  }, [selectedFilters, buildFilterParams, searchWord, minNumber, maxNumber])

  // 필터 변경 시 API 재호출
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-xl bg-primary/5 p-6 md:p-10">
          <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            함께 성장하는 스터디를 찾아보세요
          </h1>
          <p className="mt-2 text-muted-foreground">
            관심 분야의 스터디에 참여하거나, 직접 스터디를 만들어 팀원을 모집해보세요.
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

        {/* Study Count & Grid */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{studies.length}</span>개의 스터디
          </p>
        </div>
        <StudyGrid studies={studies} isLoading={isLoading} />
      </main>

      {/* 플로팅 액션 버튼 (스터디 생성) - 로그인 시에만 표시 */}
      {showCreateButton && (
        <Button
          onClick={handleCreateClick}
          className="fixed bottom-6 right-80 z-50 h-14 w-14 rounded-full bg-primary p-0 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:bg-primary/90 hover:shadow-xl"
          aria-label="스터디 생성"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
