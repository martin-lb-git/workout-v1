import { useRef } from 'react'
import styles from './ExerciseCard.module.css'
import { isRangeReps, type StrengthExercise } from '../../constants/program'
import { compressPhoto } from '../../lib/imageUtils'
import type { ExerciseData } from '../../hooks/useSession'

interface Props {
  exercise: StrengthExercise
  data: ExerciseData
  isGroupStart: boolean
  onUpdate: (patch: Partial<ExerciseData>) => void
  onHistoryOpen: () => void
}

const GROUP_LABELS: Record<string, string> = {
  superset: 'Superset',
  circuit: 'Circuit',
}

export default function ExerciseCard({ exercise, data, isGroupStart, onUpdate, onHistoryOpen }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const showReps = isRangeReps(exercise.reps)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressPhoto(file)
    onUpdate({ photo_url: compressed })
    e.target.value = ''
  }

  return (
    <div className={`${styles.card} ${exercise.group ? styles.grouped : ''}`}>
      {isGroupStart && exercise.group && (
        <span className={`${styles.groupBadge} ${styles[exercise.group]}`}>
          {GROUP_LABELS[exercise.group]}
        </span>
      )}

      <div className={styles.header}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{exercise.name}</span>
          <span className={styles.sets}>{exercise.sets} × {exercise.reps}</span>
        </div>
        <button className={styles.historyBtn} onClick={onHistoryOpen} aria-label="Voir historique">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </button>
      </div>

      <div className={styles.inputs}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`weight-${exercise.id}`}>Poids (kg)</label>
          <input
            id={`weight-${exercise.id}`}
            className={styles.input}
            type="number"
            min="0"
            step="0.5"
            value={data.weight ?? ''}
            onChange={(e) => onUpdate({ weight: e.target.value === '' ? undefined : Number(e.target.value) })}
            placeholder="—"
          />
        </div>

        {showReps && (
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor={`reps-${exercise.id}`}>Reps réalisées</label>
            <input
              id={`reps-${exercise.id}`}
              className={styles.input}
              type="number"
              min="0"
              step="1"
              value={data.reps_actual ?? ''}
              onChange={(e) => onUpdate({ reps_actual: e.target.value === '' ? undefined : Number(e.target.value) })}
              placeholder="—"
            />
          </div>
        )}
      </div>

      <div className={styles.photoRow}>
        {data.photo_url ? (
          <>
            <img src={data.photo_url} alt="Référence" className={styles.preview} />
            <button className={styles.removePhoto} onClick={() => onUpdate({ photo_url: undefined })}>
              Supprimer
            </button>
          </>
        ) : (
          <button className={styles.addPhoto} onClick={() => fileRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Photo de référence
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </div>
  )
}
