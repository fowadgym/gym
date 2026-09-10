'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Dumbbell, Calendar, Save, Moon } from 'lucide-react'
import { assignCourseToAthlete } from '../actions'

interface Exercise {
  id: string
  title: string
}

interface CourseDay {
  id: string
  name: string
  isRest: boolean
  exercises: {
    id: string
    exerciseId: string
    sets: number
    reps: number
    weight_target: number | ''
  }[]
}

export default function CourseBuilder({ athleteId, exercises }: { athleteId: string, exercises: Exercise[] }) {
  const router = useRouter()
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [days, setDays] = useState<CourseDay[]>([
    { id: '1', name: 'اليوم الأول', isRest: false, exercises: [] }
  ])

  const addDay = () => {
    setDays([...days, { id: Math.random().toString(), name: `اليوم ${days.length + 1}`, isRest: false, exercises: [] }])
  }

  const removeDay = (index: number) => {
    setDays(days.filter((_, i) => i !== index))
  }

  const toggleRestDay = (index: number) => {
    const newDays = [...days]
    newDays[index].isRest = !newDays[index].isRest
    if (newDays[index].isRest) {
      newDays[index].exercises = []
    }
    setDays(newDays)
  }

  const updateDayName = (index: number, name: string) => {
    const newDays = [...days]
    newDays[index].name = name
    setDays(newDays)
  }

  const addExercise = (dayIndex: number) => {
    const newDays = [...days]
    newDays[dayIndex].exercises.push({
      id: Math.random().toString(),
      exerciseId: exercises[0]?.id || '',
      sets: 3,
      reps: 10,
      weight_target: ''
    })
    setDays(newDays)
  }

  const updateExercise = (dayIndex: number, exIndex: number, field: string, value: any) => {
    const newDays = [...days]
    newDays[dayIndex].exercises[exIndex] = { ...newDays[dayIndex].exercises[exIndex], [field]: value }
    setDays(newDays)
  }

  const removeExercise = (dayIndex: number, exIndex: number) => {
    const newDays = [...days]
    newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, i) => i !== exIndex)
    setDays(newDays)
  }

  const handleSave = async () => {
    setError(null)
    setLoading(true)

    // Validate
    for (const day of days) {
      if (!day.isRest && day.exercises.length === 0) {
        setError(`الرجاء إضافة تمارين لـ ${day.name} أو تعيينه كيوم راحة.`)
        setLoading(false)
        return
      }
    }

    const payload = {
      startDate,
      days: days.map(d => ({
        name: d.name,
        isRest: d.isRest,
        exercises: d.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weight_target: ex.weight_target ? Number(ex.weight_target) : null
        }))
      }))
    }

    const res = await assignCourseToAthlete(athleteId, payload)
    
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push(`/admin/athletes/${athleteId}`)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Settings */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-2">تاريخ البداية (اليوم الأول)</label>
        <div className="relative max-w-xs">
          <Calendar className="absolute end-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {days.map((day, dIdx) => (
          <div key={day.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl transition-all">
            {/* Day Header */}
            <div className={`p-4 flex items-center justify-between border-b ${day.isRest ? 'border-neutral-800/30 bg-neutral-900/50' : 'border-neutral-800 bg-neutral-800/30'}`}>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">اليوم {dIdx + 1}</span>
                <input 
                  type="text" 
                  value={day.name}
                  onChange={(e) => updateDayName(dIdx, e.target.value)}
                  placeholder="اسم اليوم (مثال: دفع، سحب، أرجل)"
                  className="bg-transparent border-none text-white font-bold text-lg focus:outline-none focus:ring-0 flex-1 placeholder:text-neutral-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleRestDay(dIdx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${day.isRest ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'}`}
                >
                  <Moon className="w-3 h-3" /> {day.isRest ? 'يوم راحة' : 'تعيين كراحة'}
                </button>
                {days.length > 1 && (
                  <button onClick={() => removeDay(dIdx)} className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Day Exercises */}
            {!day.isRest && (
              <div className="p-4 space-y-3 bg-neutral-950/30">
                {day.exercises.map((ex, eIdx) => (
                  <div key={ex.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                    <div className="flex-1 min-w-[200px]">
                      <select 
                        value={ex.exerciseId}
                        onChange={(e) => updateExercise(dIdx, eIdx, 'exerciseId', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        {exercises.map(exercise => (
                          <option key={exercise.id} value={exercise.id}>{exercise.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 px-1">مجموعات</span>
                        <input type="number" min="1" value={ex.sets} onChange={(e) => updateExercise(dIdx, eIdx, 'sets', e.target.value)} className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-sm text-center text-white focus:outline-none focus:border-amber-500" />
                      </div>
                      <span className="text-neutral-600 mt-4">×</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 px-1">تكرارات</span>
                        <input type="number" min="1" value={ex.reps} onChange={(e) => updateExercise(dIdx, eIdx, 'reps', e.target.value)} className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-sm text-center text-white focus:outline-none focus:border-amber-500" />
                      </div>
                      <div className="flex flex-col ms-2">
                        <span className="text-[10px] text-neutral-500 px-1">الوزن المستهدف (كغ)</span>
                        <input type="number" placeholder="--" value={ex.weight_target} onChange={(e) => updateExercise(dIdx, eIdx, 'weight_target', e.target.value)} className="w-20 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-sm text-center text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-700" />
                      </div>
                    </div>
                    <button onClick={() => removeExercise(dIdx, eIdx)} className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ms-auto mt-4 md:mt-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addExercise(dIdx)}
                  className="flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 rounded-xl transition-colors w-full justify-center border border-amber-500/20 border-dashed"
                >
                  <Plus className="w-4 h-4" /> إضافة تمرين
                </button>
              </div>
            )}
            
            {day.isRest && (
              <div className="p-8 text-center text-indigo-400/50 font-bold flex flex-col items-center justify-center gap-2 bg-indigo-950/10">
                <Moon className="w-8 h-8 opacity-50" />
                <span>يوم راحة واستشفاء</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={addDay}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 font-bold transition-all shadow-sm"
      >
        <Calendar className="w-5 h-5" />
        إضافة يوم جديد للكورس
      </button>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl">{error}</div>}

      <div className="pt-4 border-t border-neutral-800">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-amber-500 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-neutral-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all text-lg"
        >
          <Save className="w-5 h-5" />
          {loading ? 'جاري الحفظ والجدولة...' : 'حفظ الكورس وجدولته'}
        </button>
      </div>

    </div>
  )
}
