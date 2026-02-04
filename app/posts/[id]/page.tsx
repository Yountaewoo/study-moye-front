"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Tag,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react"
import { Header } from "@/components/header"
import {
  fetchPostDetail,
  createComment,
  closePost,
  getCategoryNameById,
  getLocationNameById,
  type PostDetailResponse,
} from "@/lib/api"
import { isLoggedIn, getAuthInfo } from "@/lib/auth"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.id)

  const [post, setPost] = useState<PostDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isClosingPost, setIsClosingPost] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true)
      const result = await fetchPostDetail(postId)

      if (result.success && result.data) {
        setPost(result.data)
      } else {
        setError(result.error || "게시글을 불러올 수 없습니다.")
      }
      setIsLoading(false)
    }

    if (postId) {
      loadPost()
    }
  }, [postId])

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      return
    }

    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    setIsSubmittingComment(true)
    const result = await createComment(postId, commentContent.trim())

    if (result.success) {
      setCommentContent("")
      // 댓글 목록 새로고침
      const postResult = await fetchPostDetail(postId)
      if (postResult.success && postResult.data) {
        setPost(postResult.data)
      }
    } else {
      alert(result.error || "댓글 작성에 실패했습니다.")
    }
    setIsSubmittingComment(false)
  }

  const handleClosePost = async () => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    const confirmed = window.confirm("정말로 모집을 종료하시겠습니까?")
    if (!confirmed) return

    setIsClosingPost(true)
    const result = await closePost(postId)

    if (result.success) {
      alert("모집이 종료되었습니다.")
      // 게시글 새로고침
      const postResult = await fetchPostDetail(postId)
      if (postResult.success && postResult.data) {
        setPost(postResult.data)
      }
    } else {
      alert(result.error || "모집 종료에 실패했습니다.")
    }
    setIsClosingPost(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 백엔드 상세조회 CommentResponse에 createdAt이 없어져서 시간 표시는 제거

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="mb-4 text-lg text-muted-foreground">{error || "게시글을 찾을 수 없습니다."}</p>
              <Button onClick={() => router.push("/")} variant="outline">
                홈으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const categoryName = getCategoryNameById(post.categoryId)
  const locationName = getLocationNameById(post.locationId)
  const isOnline = post.locationId === null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 뒤로가기 */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Link>

        {/* 메인 카드 */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            {/* 배지 및 모집 종료 버튼 */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={post.isActive ? "default" : "secondary"}
                  className={post.isActive ? "bg-primary" : ""}
                >
                  {post.isActive ? "모집중" : "모집완료"}
                </Badge>
                <Badge variant="outline">{categoryName}</Badge>
                <Badge variant="outline">{isOnline ? "온라인" : "오프라인"}</Badge>
              </div>
              {post.isActive && post.isAuthor && (
                <Button
                  onClick={handleClosePost}
                  disabled={isClosingPost}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  {isClosingPost ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리중...
                    </>
                  ) : (
                    "모집 종료"
                  )}
                </Button>
              )}
            </div>

            {/* 제목 */}
            <CardTitle className="text-2xl font-bold text-foreground">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 정보 그리드 */}
            <div className="grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">모집 인원</p>
                  <p className="font-medium text-foreground">
                    {post.minNumber}명 ~ {post.maxNumber}명
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">진행 기간</p>
                  <p className="font-medium text-foreground">
                    {formatDate(post.startDate)} ~ {formatDate(post.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">카테고리</p>
                  <p className="font-medium text-foreground">{categoryName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">진행 방식</p>
                  <p className="font-medium text-foreground">
                    {isOnline ? "온라인" : `오프라인 (${locationName})`}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* 내용 */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">스터디 소개</h3>
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {post.content}
              </div>
            </div>

            
          </CardContent>
        </Card>

        {/* 댓글 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              댓글 ({post.commentResponses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {post.commentResponses.length > 0 ? (
              <div className="space-y-4">
                {post.commentResponses.map((comment) => {
                  const nickname = comment.memberNickname?.trim() || "익명"
                  return (
                    <div key={comment.commentId} className="flex gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {nickname.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{nickname}</span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </p>
            )}

            {/* 댓글 작성 */}
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex gap-3">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="min-h-20 resize-none"
                />
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentContent.trim() || isSubmittingComment}
                  className="gap-2"
                >
                  {isSubmittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  댓글 작성
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
