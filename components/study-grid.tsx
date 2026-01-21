"use client"

import { StudyCard } from "./study-card"
import type { PostResponse } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface StudyGridProps {
  studies: PostResponse[]
  isLoading?: boolean
}

export function StudyGrid({ studies, isLoading }: StudyGridProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (studies.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-card">
        <p className="text-muted-foreground">조건에 맞는 스터디가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {studies.map((study) => (
        <StudyCard key={study.postId} study={study} />
      ))}
    </div>
  )
}
