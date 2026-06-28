import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { StrengthExercise } from '../constants/program'

export type ExerciseData = {
  weight?: number
  reps_actual?: number
  photo_url?: string
}

type SessionState = {
  exercises: Record<string, ExerciseData>
  notes: string
}

export function useSession(dayId: string, week: string) {
  const [state, setState] = useState<SessionState>({ exercises: {}, notes: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  useEffect(() => {
    setState({ exercises: {}, notes: '' })
    setLoading(true)
    setSavedOk(false)

    Promise.all([
      supabase.from('sessions').select('*').eq('day_id', dayId).eq('week', week),
      supabase.from('session_notes').select('*').eq('day_id', dayId).eq('week', week).maybeSingle(),
    ]).then(([{ data: rows }, { data: noteRow }]) => {
      const exercises: Record<string, ExerciseData> = {}
      for (const r of rows ?? []) {
        exercises[r.exercise_id] = {
          weight: r.weight ?? undefined,
          reps_actual: r.reps_actual ?? undefined,
          photo_url: r.photo_url ?? undefined,
        }
      }
      setState({ exercises, notes: noteRow?.notes ?? '' })
      setLoading(false)
    })
  }, [dayId, week])

  function setExercise(id: string, patch: Partial<ExerciseData>) {
    setSavedOk(false)
    setState((prev) => ({
      ...prev,
      exercises: { ...prev.exercises, [id]: { ...prev.exercises[id], ...patch } },
    }))
  }

  function setNotes(notes: string) {
    setSavedOk(false)
    setState((prev) => ({ ...prev, notes }))
  }

  async function save(exercises: StrengthExercise[]) {
    setSaving(true)
    try {
      await Promise.all([
        supabase.from('sessions').delete().eq('day_id', dayId).eq('week', week),
        supabase.from('session_notes').delete().eq('day_id', dayId).eq('week', week),
      ])

      const rows = exercises
        .filter((e) => state.exercises[e.id]?.weight != null)
        .map((e) => ({
          day_id: dayId,
          week,
          exercise_id: e.id,
          exercise_name: e.name,
          weight: state.exercises[e.id].weight,
          reps_actual: state.exercises[e.id].reps_actual ?? null,
          photo_url: state.exercises[e.id].photo_url ?? null,
        }))

      if (rows.length > 0) await supabase.from('sessions').insert(rows)

      if (state.notes.trim()) {
        await supabase.from('session_notes').insert({ day_id: dayId, week, notes: state.notes })
      }

      setSavedOk(true)
    } finally {
      setSaving(false)
    }
  }

  return { state, loading, saving, savedOk, setExercise, setNotes, save }
}
