import { useEffect } from 'react'
import styles from './HistoryModal.module.css'
import { useHistory, type WeekWeight } from '../../hooks/useHistory'

interface Props {
  exerciseName: string
  exerciseId: string
  onClose: () => void
}

export default function HistoryModal({ exerciseName, exerciseId, onClose }: Props) {
  const { history, loading, load } = useHistory(exerciseId)

  useEffect(() => { load() }, [exerciseId])

  const lastWeight = history.length > 0 ? history[history.length - 1].weight : null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{exerciseName}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {loading ? (
          <p className={styles.empty}>Chargement…</p>
        ) : history.length === 0 ? (
          <p className={styles.empty}>Aucun historique</p>
        ) : (
          <>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Dernier poids</span>
              <span className={styles.statValue}>{lastWeight} kg</span>
            </div>
            <HistoryChart data={history} />
          </>
        )}
      </div>
    </div>
  )
}

function HistoryChart({ data }: { data: WeekWeight[] }) {
  const W = 280, H = 110
  const PAD = { top: 12, right: 12, bottom: 28, left: 38 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom

  const weights = data.map((d) => d.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const range = maxW - minW || 1

  const xScale = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * cW
  const yScale = (w: number) => PAD.top + cH - ((w - minW) / range) * cH

  const points = data.map((d, i) => `${xScale(i).toFixed(1)},${yScale(d.weight).toFixed(1)}`).join(' ')

  const yLabels = [minW, maxW]
  if (minW !== maxW) yLabels.splice(1, 0, Math.round((minW + maxW) / 2))

  const xShowLabel = (i: number) => data.length <= 5 || i === 0 || i === data.length - 1

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-label="Courbe de progression">
      {yLabels.map((w, i) => (
        <g key={i}>
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={yScale(w)} y2={yScale(w)}
            stroke="var(--border)" strokeWidth="1"
          />
          <text x={PAD.left - 5} y={yScale(w) + 4} textAnchor="end" fontSize="9" fill="var(--text-muted)">
            {w}
          </text>
        </g>
      ))}
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(d.weight)} r="3.5" fill="var(--accent)" />
      ))}
      {data.map((d, i) =>
        xShowLabel(i) ? (
          <text key={i} x={xScale(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="var(--text-muted)">
            {d.week.replace(/^\d{4}-/, '')}
          </text>
        ) : null
      )}
    </svg>
  )
}
