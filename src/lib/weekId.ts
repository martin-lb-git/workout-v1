export function getCurrentWeekId(): string {
  const now = new Date()
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  const day = d.getUTCDay() || 7 // 1=Mon … 7=Sun
  d.setUTCDate(d.getUTCDate() + 4 - day) // Thursday of this ISO week
  const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

const JS_DAY_TO_ID = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
export type DayId = (typeof JS_DAY_TO_ID)[number]

export function getCurrentDayId(): DayId {
  return JS_DAY_TO_ID[new Date().getDay()]
}
