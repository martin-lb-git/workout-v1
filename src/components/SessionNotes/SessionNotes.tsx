import styles from './SessionNotes.module.css'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SessionNotes({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="session-notes">Notes de séance</label>
      <textarea
        id="session-notes"
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ressentis, remarques, contexte…"
        rows={4}
      />
    </div>
  )
}
