import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'safe': return 'text-emerald-400'
    case 'low': return 'text-teal-400'
    case 'moderate': return 'text-amber-400'
    case 'high': return 'text-orange-400'
    case 'critical': return 'text-danger'
    default: return 'text-graphite-400'
  }
}

export function getRiskBg(risk: string): string {
  switch (risk) {
    case 'safe': return 'bg-emerald-500/10 border-emerald-500/30'
    case 'low': return 'bg-teal-500/10 border-teal-500/30'
    case 'moderate': return 'bg-amber-500/10 border-amber-500/30'
    case 'high': return 'bg-orange-500/10 border-orange-500/30'
    case 'critical': return 'bg-danger/10 border-danger/30'
    default: return 'bg-graphite-500/10 border-graphite-500/30'
  }
}
