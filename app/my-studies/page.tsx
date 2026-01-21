"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Calendar, Users, MapPin } from "lucide-react"
import { fetchMyPosts, getCategoryNameById, getLocationNameById, type PostResponse } from "@/lib/api"
import { isLoggedIn } from "@/lib/auth"

export default function MyStudiesPage() {
  const router = useRouter()
  const [studies, setStudies] = useState<PostResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    const loadMyStudies = async () => {
      setIsLoading(true)
      const result = await fetchMyPosts()
      
      if (result.success && result.data) {
        setStudies(result.data.postResponses)
      } else {
        setError(result.error || "스터디 목록을 불러올 수 없습니다.")
      }
      setIsLoading(false)
    }

    loadMyStudies()
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">내 스터디</h1>
            <p className="mt-1 text-muted-foreground">내가 생성한 스터디 목록입니다.</p>
          </div>
          <Link href="/create">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              새 스터디 만들기
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/login")}
            >
              로그인하기
            </Button>
          </div>
        ) : studies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">아직 생성한 스터디가 없습니다.</p>
            <Link href="/create">
              <Button className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                첫 스터디 만들기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => {
              const categoryName = getCategoryNameById(study.categoryId)
              const locationName = study.locationId ? getLocationNameById(study.locationId) : null
              const isOnline = study.locationId === null

              return (
                <Link key={study.postId} href={`/posts/${study.postId}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
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

                      <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">
                        {study.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {study.content}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
