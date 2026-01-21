"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"
import { CATEGORIES, getParentLocations } from "@/lib/constants"

interface FilterSection {
  title: string
  options: string[]
}

const filterSections: FilterSection[] = [
  {
    title: "카테고리",
    options: CATEGORIES.map((c) => c.name),
  },
  {
    title: "진행 방식",
    options: ["온라인", "오프라인", "온/오프라인"],
  },
  {
    title: "모집 상태",
    options: ["모집중", "모집완료"],
  },
  {
    title: "지역",
    options: getParentLocations().map((loc) => loc.name),
  },
]

interface FilterSidebarProps {
  selectedFilters: Record<string, string[]>
  onFilterChange: (section: string, value: string) => void
}

export function FilterSidebar({ selectedFilters, onFilterChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    filterSections.map((s) => s.title)
  )

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  return (
    <aside className="w-full rounded-lg bg-card p-4 lg:w-64">
      <h2 className="mb-4 text-lg font-bold text-foreground">필터</h2>
      <div className="space-y-4">
        {filterSections.map((section) => (
          <div key={section.title} className="border-b border-border pb-4 last:border-0">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground"
            >
              {section.title}
              {expandedSections.includes(section.title) ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.includes(section.title) && (
              <div className="mt-2 space-y-2">
                {section.options.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`${section.title}-${option}`}
                      checked={selectedFilters[section.title]?.includes(option) || false}
                      onCheckedChange={() => onFilterChange(section.title, option)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`${section.title}-${option}`}
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
