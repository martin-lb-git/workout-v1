import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDaysWithData(week: string) {
  const [days, setDays] = useState<Set<string>>(new Set())

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('sessions').select('day_id').eq('week', week)
    setDays(new Set(data?.map((r) => r.day_id) ?? []))
  }, [week])

  useEffect(() => { refresh() }, [refresh])

  return { days, refresh }
}
