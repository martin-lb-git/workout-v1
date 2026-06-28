import { useState } from 'react'
import appStyles from './App.module.css'
import { PROGRAM } from './constants/program'
import { getCurrentWeekId, getCurrentDayId } from './lib/weekId'
import { useDaysWithData } from './hooks/useDaysWithData'
import WeekNav from './components/WeekNav/WeekNav'
import DaySession from './components/DaySession/DaySession'

const currentWeek = getCurrentWeekId()
const todayId = getCurrentDayId()

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState<string>(todayId)
  const { days: daysWithData, refresh } = useDaysWithData(currentWeek)

  const selectedDay = PROGRAM.find((d) => d.id === selectedDayId) ?? PROGRAM[0]

  return (
    <div className={appStyles.app}>
      <header className={appStyles.header}>
        <div className={appStyles.headerInner}>
          <p className={appStyles.title}>{currentWeek}</p>
        </div>
        <WeekNav
          days={PROGRAM}
          selectedId={selectedDayId}
          todayId={todayId}
          daysWithData={daysWithData}
          onSelect={setSelectedDayId}
        />
      </header>

      <main className={appStyles.content}>
        <DaySession
          key={selectedDayId}
          day={selectedDay}
          week={currentWeek}
          onSaved={refresh}
        />
      </main>
    </div>
  )
}
