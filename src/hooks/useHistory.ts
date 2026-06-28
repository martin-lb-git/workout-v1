import { useState } from 'react'
import { supabase } from '../lib/supabase'

export type WeekWeight = { week: string; weight: number }

export function useHistory(exerciseId: string) {
  const [history, setHistory] = useState<WeekWeight[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('sessions')
      .select('week, weight')
      .eq('exercise_id', exerciseId)
      .not('weight', 'is', null)
      .order('week', { ascending: true })

    const byWeek = new Map<string, number>()
    for (const r of data ?? []) {
      const prev = byWeek.get(r.week) ?? 0
      if (r.weight > prev) byWeek.set(r.week, r.weight)
    }

    setHistory(
      Array.from(byWeek.entries())
        .map(([week, weight]) => ({ week, weight }))
        .slice(-10)
    )
    setLoading(false)
  }

  return { history, loading, load }
}
