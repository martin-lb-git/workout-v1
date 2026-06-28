import styles from './WeekNav.module.css'
import type { ProgramDay } from '../../constants/program'

interface Props {
  days: ProgramDay[]
  selectedId: string
  todayId: string
  daysWithData: Set<string>
  onSelect: (id: string) => void
}

export default function WeekNav({ days, selectedId, todayId, daysWithData, onSelect }: Props) {
  return (
    <nav className={styles.nav} aria-label="Navigation jours">
      <div className={styles.track}>
        {days.map((day) => {
          const isSelected = day.id === selectedId
          const isToday = day.id === todayId
          const hasData = daysWithData.has(day.id)
          return (
            <button
              key={day.id}
              className={`${styles.pill} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
              onClick={() => onSelect(day.id)}
              aria-current={isSelected ? 'page' : undefined}
            >
              <span className={styles.label}>{day.label}</span>
              <span className={styles.type}>{day.type === 'strength' ? 'S' : 'R'}</span>
              {hasData && <span className={styles.dot} aria-label="données enregistrées" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
