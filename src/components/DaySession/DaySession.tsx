import { useState } from 'react'
import styles from './DaySession.module.css'
import type { ProgramDay, StrengthDay, StrengthExercise } from '../../constants/program'
import { useSession } from '../../hooks/useSession'
import ExerciseCard from '../ExerciseCard/ExerciseCard'
import RunCard from '../RunCard/RunCard'
import SessionNotes from '../SessionNotes/SessionNotes'
import HistoryModal from '../HistoryModal/HistoryModal'

interface Props {
  day: ProgramDay
  week: string
  onSaved: () => void
}

export default function DaySession({ day, week, onSaved }: Props) {
  const { state, loading, saving, savedOk, setExercise, setNotes, save } = useSession(day.id, week)
  const [historyExercise, setHistoryExercise] = useState<StrengthExercise | null>(null)

  async function handleSave() {
    if (day.type === 'strength') {
      await save(day.exercises)
      onSaved()
    }
  }

  if (loading) {
    return <div className={styles.loading}>Chargement…</div>
  }

  if (day.type === 'run') {
    return (
      <div className={styles.wrapper}>
        <RunCard lines={day.lines} />
        <SessionNotes value={state.notes} onChange={setNotes} />
        <SaveBar saving={saving} savedOk={savedOk} onSave={async () => {
          await save([])
          onSaved()
        }} />
      </div>
    )
  }

  const strengthDay = day as StrengthDay

  function isGroupStart(i: number): boolean {
    const ex = strengthDay.exercises[i]
    if (!ex.group) return false
    return i === 0 || strengthDay.exercises[i - 1].group !== ex.group
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.exerciseList}>
        {strengthDay.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            data={state.exercises[ex.id] ?? {}}
            isGroupStart={isGroupStart(i)}
            onUpdate={(patch) => setExercise(ex.id, patch)}
            onHistoryOpen={() => setHistoryExercise(ex)}
          />
        ))}
      </div>

      {strengthDay.run && (
        <RunCard label={strengthDay.run.label} lines={[strengthDay.run.detail]} />
      )}

      <SessionNotes value={state.notes} onChange={setNotes} />

      <SaveBar saving={saving} savedOk={savedOk} onSave={handleSave} />

      {historyExercise && (
        <HistoryModal
          exerciseName={historyExercise.name}
          exerciseId={historyExercise.id}
          onClose={() => setHistoryExercise(null)}
        />
      )}
    </div>
  )
}

function SaveBar({ saving, savedOk, onSave }: { saving: boolean; savedOk: boolean; onSave: () => void }) {
  return (
    <div className={styles.saveBar}>
      <button
        className={`${styles.saveBtn} ${savedOk ? styles.savedOk : ''}`}
        onClick={onSave}
        disabled={saving}
      >
        {saving ? 'Enregistrement…' : savedOk ? 'Enregistré ✓' : 'Enregistrer'}
      </button>
    </div>
  )
}
