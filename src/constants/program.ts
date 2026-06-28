export type RepsSpec = string

export function isRangeReps(reps: RepsSpec): boolean {
  return /^\d+-\d+$/.test(reps)
}

export interface StrengthExercise {
  id: string
  name: string
  sets: number
  reps: RepsSpec
  group?: 'superset' | 'circuit'
}

export interface RunInfo {
  label: string
  detail: string
}

export interface StrengthDay {
  type: 'strength'
  id: string
  label: string
  exercises: StrengthExercise[]
  run?: RunInfo
}

export interface RunDay {
  type: 'run'
  id: string
  label: string
  lines: string[]
}

export type ProgramDay = StrengthDay | RunDay

export const PROGRAM: ProgramDay[] = [
  {
    type: 'strength',
    id: 'mon',
    label: 'Lun',
    exercises: [
      { id: 'bench_press', name: 'Bench press', sets: 5, reps: '5' },
      { id: 'weighted_pullup', name: 'Weighted pull-up', sets: 5, reps: '5' },
      { id: 'landmine_press', name: 'Kneeling landmine press', sets: 3, reps: '6-8' },
      { id: 'chest_supported_row', name: 'Chest supported row', sets: 3, reps: '6-8' },
      { id: 'weighted_dips', name: 'Weighted dips', sets: 2, reps: '6-8', group: 'superset' },
      { id: 'cable_face_pull', name: 'Cable face pull', sets: 2, reps: '15-20', group: 'superset' },
      { id: 'hammer_curl', name: 'Hammer curl', sets: 2, reps: '10-12', group: 'superset' },
      { id: 'pallof_press', name: 'Pallof press', sets: 2, reps: '10-12', group: 'superset' },
    ],
  },
  {
    type: 'strength',
    id: 'tue',
    label: 'Mar',
    exercises: [
      { id: 'deadlift', name: 'Deadlift', sets: 5, reps: '5' },
      { id: 'hip_thrusts', name: 'Barbell hip thrusts', sets: 4, reps: '5-8' },
      { id: 'bss', name: 'Bulgarian split squat', sets: 3, reps: '6-8' },
      { id: 'nordic_curl', name: 'Nordic curl', sets: 3, reps: '6-8' },
      { id: 'cable_hip_abduction_tue', name: 'Cable hip abduction', sets: 2, reps: '12', group: 'circuit' },
      { id: 'soleus_raise', name: 'Soleus raise', sets: 2, reps: '15', group: 'circuit' },
      { id: 'tibialis_raise', name: 'Tibialis raise', sets: 2, reps: '20', group: 'circuit' },
      { id: 'copenhagen_plank_tue', name: 'Copenhagen plank', sets: 2, reps: '20 sec', group: 'circuit' },
    ],
    run: { label: 'Course', detail: '4 miles — Zone 1' },
  },
  {
    type: 'run',
    id: 'wed',
    label: 'Mer',
    lines: [
      'Warm up : 5 min Z1 + 10 min Z2',
      'Main set : 6 × 1 min Z4 / 2 min Z2',
      'Cool down : 15 min Z1',
    ],
  },
  {
    type: 'strength',
    id: 'thu',
    label: 'Jeu',
    exercises: [
      { id: 'incline_db_press', name: 'Incline DB press', sets: 4, reps: '8-10' },
      { id: 'lat_pulldown', name: 'Lat pulldown', sets: 4, reps: '8-10' },
      { id: 'military_press', name: 'Military press', sets: 3, reps: '8-10', group: 'superset' },
      { id: 'single_arm_row', name: 'Single arm row', sets: 3, reps: '8-10', group: 'superset' },
      { id: 'cable_fly', name: 'Cable fly', sets: 2, reps: '12-15', group: 'superset' },
      { id: 'rear_delt_fly', name: 'Rear delt fly', sets: 2, reps: '15-20', group: 'superset' },
      { id: 'lateral_raise', name: 'DB lateral raise', sets: 2, reps: '12-20', group: 'superset' },
      { id: 'db_curl', name: 'DB curl', sets: 2, reps: '10-12', group: 'superset' },
      { id: 'cable_press_down', name: 'Cable press down', sets: 2, reps: '12-15', group: 'superset' },
    ],
    run: { label: 'Course', detail: '4 miles — Zone 1' },
  },
  {
    type: 'strength',
    id: 'fri',
    label: 'Ven',
    exercises: [
      { id: 'squat', name: 'Squat', sets: 4, reps: '8-12' },
      { id: 'single_leg_rdl', name: 'Single leg RDL', sets: 3, reps: '8/side' },
      { id: 'box_step_up', name: 'Box step up', sets: 3, reps: '8-10' },
      { id: 'hamstring_curl', name: 'Hamstring curl', sets: 3, reps: '10-12', group: 'superset' },
      { id: 'calf_raise', name: 'Standing calf raise', sets: 3, reps: '8-12', group: 'superset' },
      { id: 'cable_hip_abduction_fri', name: 'Cable hip abduction', sets: 2, reps: '12/side', group: 'superset' },
      { id: 'copenhagen_plank_fri', name: 'Copenhagen plank', sets: 2, reps: '30 sec', group: 'superset' },
      { id: 'cable_march', name: 'Cable march', sets: 2, reps: '10/side', group: 'superset' },
    ],
    run: { label: 'Course', detail: '5 min Z1 → 30 min Z2 → 10 min Z3' },
  },
  {
    type: 'run',
    id: 'sat',
    label: 'Sam',
    lines: ['4 miles — Zone 1'],
  },
  {
    type: 'run',
    id: 'sun',
    label: 'Dim',
    lines: ['10 miles — Zone 2'],
  },
]
