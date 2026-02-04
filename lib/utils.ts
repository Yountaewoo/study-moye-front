import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL을 링크로 변환하는 함수
export function linkifyText(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
  
  return text.replace(urlRegex, (url) => {
    const href = url.startsWith('http') ? url : `https://${url}`
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">${url}</a>`
  })
}
