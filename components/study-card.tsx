import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Users, MapPin, Calendar } from "lucide-react"
import { getCategoryNameById, getLocationNameById, type PostResponse } from "@/lib/api"

interface StudyCardProps {
  study: PostResponse
}

export function StudyCard({ study }: StudyCardProps) {
  const categoryName = getCategoryNameById(study.categoryId)
  const locationName = getLocationNameById(study.locationId)
  
  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
  }

  return (
    <Link href={`/posts/${study.postId}`}>
      <Card className="group flex h-full cursor-pointer flex-col border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge
              variant={study.isActive ? "default" : "secondary"}
              className={
                study.isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }
            >
              {study.isActive ? "모집중" : "모집완료"}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">
              {categoryName}
            </Badge>
          </div>
          <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
            {study.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-1 pb-3">
          <p className="line-clamp-3 text-sm text-muted-foreground">{study.content}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>
                {study.minNumber}~{study.maxNumber}명
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{locationName || "온라인"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(study.endDate)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
