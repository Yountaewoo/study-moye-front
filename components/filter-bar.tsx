"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronDown, X, Search } from "lucide-react"
import { CATEGORIES, getParentLocations, getChildLocations } from "@/lib/constants"

interface FilterSection {
  title: string
  key: string
  options: string[]
}

const filterSections: FilterSection[] = [
  {
    title: "카테고리",
    key: "카테고리",
    options: CATEGORIES.map((c) => c.name),
  },
  {
    title: "진행 방식",
    key: "진행 방식",
    options: ["온라인", "오프라인"],
  },
  {
    title: "모집 상태",
    key: "모집 상태",
    options: ["모집중", "모집완료"],
  },
]

const parentLocations = getParentLocations()

interface FilterBarProps {
  selectedFilters: Record<string, string[]>
  onFilterChange: (section: string, value: string) => void
  onClearFilters: () => void
  searchWord: string
  onSearchChange: (value: string) => void
  minNumber: string
  maxNumber: string
  onMinNumberChange: (value: string) => void
  onMaxNumberChange: (value: string) => void
}

export function FilterBar({
  selectedFilters,
  onFilterChange,
  onClearFilters,
  searchWord,
  onSearchChange,
  minNumber,
  maxNumber,
  onMinNumberChange,
  onMaxNumberChange,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedParentLocation, setSelectedParentLocation] = useState<number | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const activeFilterCount = Object.values(selectedFilters).flat().length
  const locationFilterCount = (selectedFilters["지역"]?.length || 0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown]
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdown])

  const getSelectedCount = (key: string) => {
    return selectedFilters[key]?.length || 0
  }

  const hasNumberFilter = minNumber !== "" || maxNumber !== ""
  const hasSearchFilter = searchWord !== ""

  const handleClearAll = () => {
    onClearFilters()
    onSearchChange("")
    onMinNumberChange("")
    onMaxNumberChange("")
  }

  return (
    <div className="space-y-3 rounded-lg bg-card p-4">
      {/* 검색바 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="스터디 제목, 내용으로 검색"
          value={searchWord}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 필터 버튼들 */}
      <div className="flex flex-wrap items-center gap-2">
        {filterSections.map((section) => {
          const selectedCount = getSelectedCount(section.key)
          return (
            <div
              key={section.key}
              className="relative"
              ref={(el) => {
                dropdownRefs.current[section.key] = el
              }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenDropdown(openDropdown === section.key ? null : section.key)}
                className={`gap-1 ${selectedCount > 0 ? "border-primary bg-primary/5 text-primary" : ""}`}
              >
                {section.title}
                {selectedCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {selectedCount}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === section.key ? "rotate-180" : ""}`} />
              </Button>

              {openDropdown === section.key && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-48 rounded-lg border border-border bg-card p-3 shadow-lg">
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {section.options.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          id={`filter-${section.key}-${option}`}
                          checked={selectedFilters[section.key]?.includes(option) || false}
                          onCheckedChange={() => onFilterChange(section.key, option)}
                          className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                        <Label
                          htmlFor={`filter-${section.key}-${option}`}
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* 지역 필터 드롭다운 */}
        <div
          className="relative"
          ref={(el) => {
            dropdownRefs.current["지역"] = el
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpenDropdown(openDropdown === "지역" ? null : "지역")
              setSelectedParentLocation(null)
            }}
            className={`gap-1 ${locationFilterCount > 0 ? "border-primary bg-primary/5 text-primary" : ""}`}
          >
            지역
            {locationFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {locationFilterCount}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "지역" ? "rotate-180" : ""}`} />
          </Button>

          {openDropdown === "지역" && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-72 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex">
                {/* 시/도 목록 */}
                <div className="w-1/2 border-r border-border">
                  <div className="border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                    시/도
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {parentLocations.map((loc) => {
                      const childLocs = getChildLocations(loc.id)
                      const hasChildren = childLocs.length > 0
                      return (
                        <button
                          key={loc.id}
                          onClick={() => {
                            if (hasChildren) {
                              setSelectedParentLocation(loc.id)
                            } else {
                              onFilterChange("지역", loc.name)
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors ${
                            selectedParentLocation === loc.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          } ${selectedFilters["지역"]?.includes(loc.name) ? "font-medium text-primary" : ""}`}
                        >
                          <span>{loc.name}</span>
                          {hasChildren && <ChevronDown className="h-3 w-3 -rotate-90" />}
                          {selectedFilters["지역"]?.includes(loc.name) && !hasChildren && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 구/군 목록 */}
                <div className="w-1/2">
                  <div className="border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                    구/군
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {selectedParentLocation ? (
                      getChildLocations(selectedParentLocation).map((loc) => (
                        <div key={loc.id} className="flex items-center gap-2 py-1">
                          <Checkbox
                            id={`filter-location-${loc.id}`}
                            checked={selectedFilters["지역"]?.includes(loc.name) || false}
                            onCheckedChange={() => onFilterChange("지역", loc.name)}
                            className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                          />
                          <Label
                            htmlFor={`filter-location-${loc.id}`}
                            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                          >
                            {loc.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                        시/도를 선택하세요
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 인원수 필터 드롭다운 */}
        <div
          className="relative"
          ref={(el) => {
            dropdownRefs.current["인원수"] = el
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDropdown(openDropdown === "인원수" ? null : "인원수")}
            className={`gap-1 ${hasNumberFilter ? "border-primary bg-primary/5 text-primary" : ""}`}
          >
            인원수
            {hasNumberFilter && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "인원수" ? "rotate-180" : ""}`} />
          </Button>

          {openDropdown === "인원수" && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-56 rounded-lg border border-border bg-card p-4 shadow-lg">
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">모집 인원</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="최소"
                    value={minNumber}
                    onChange={(e) => onMinNumberChange(e.target.value)}
                    className="w-20 text-center"
                    min="1"
                  />
                  <span className="text-muted-foreground">~</span>
                  <Input
                    type="number"
                    placeholder="최대"
                    value={maxNumber}
                    onChange={(e) => onMaxNumberChange(e.target.value)}
                    className="w-20 text-center"
                    min="1"
                  />
                  <span className="text-sm text-muted-foreground">명</span>
                </div>
                {hasNumberFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onMinNumberChange("")
                      onMaxNumberChange("")
                    }}
                    className="w-full text-muted-foreground"
                  >
                    초기화
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {(activeFilterCount > 0 || hasNumberFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* Selected Filter Tags */}
      {(activeFilterCount > 0 || hasNumberFilter) && (
        <div className="flex flex-wrap gap-2">
          {/* 인원수 태그 */}
          {hasNumberFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              인원: {minNumber || "0"}~{maxNumber || "무제한"}명
              <button
                onClick={() => {
                  onMinNumberChange("")
                  onMaxNumberChange("")
                }}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {/* 기타 필터 태그 */}
          {Object.entries(selectedFilters).map(([section, values]) =>
            values.map((value) => (
              <span
                key={`${section}-${value}`}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {value}
                <button onClick={() => onFilterChange(section, value)} className="hover:text-primary/70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
      )}
    </div>
  )
}
