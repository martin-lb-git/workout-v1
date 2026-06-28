import styles from './RunCard.module.css'

interface Props {
  label?: string
  lines: string[]
}

export default function RunCard({ label = 'Course', lines }: Props) {
  return (
    <div className={styles.card}>
      <span className={styles.badge}>{label}</span>
      <ul className={styles.list}>
        {lines.map((line, i) => (
          <li key={i} className={styles.line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
