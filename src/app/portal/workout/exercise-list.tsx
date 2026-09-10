'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import { toggleExerciseCompletion } from './actions'

type ExerciseItem = {
  id: string
  sets: number
  reps: string
  weight_target: string | null
  completed: boolean
  exercises: {
    title: string
    video_url: string | null
  } | null
}

export function ExerciseList({ initialExercises }: { initialExercises: ExerciseItem[] }) {
  const [exercises, setExercises] = useState(initialExercises)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setExercises(prev => 
      prev.map(ex => ex.id === id ? { ...ex, completed: !currentStatus } : ex)
    )

    // Server update
    startTransition(async () => {
      try {
        await toggleExerciseCompletion(id, !currentStatus)
      } catch (error) {
        // Revert on error
        setExercises(initialExercises)
        alert('فشل في حفظ التقدم. يرجى المحاولة مرة أخرى.')
      }
    })
  }

  if (exercises.length === 0) {
    return <div className="text-center font-bold text-neutral-400 py-10 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl">لا توجد تمارين لهذا الروتين.</div>
  }

  return (
    <div className="space-y-4">
      {exercises.map((item) => (
        <div 
          key={item.id} 
          className={`backdrop-blur-xl overflow-hidden transition-all duration-300 ${item.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-900/40 border-neutral-800/50 hover:bg-neutral-900/60 hover:border-amber-500/30'} border rounded-3xl shadow-lg`}
        >
          {item.exercises?.video_url && (
            <div className="aspect-video bg-neutral-950/80 relative border-b border-neutral-800/50 group">
              <video 
                src={item.exercises.video_url} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity ${item.completed ? 'opacity-30' : 'opacity-80 group-hover:opacity-100'}`}
                preload="none"
                controls
                playsInline
                poster="" // Could add a poster here
              />
            </div>
          )}
          
          <div className="p-5 flex items-start gap-4">
            <button 
              onClick={() => handleToggle(item.id, item.completed)}
              className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full transition-transform hover:scale-110 active:scale-95"
            >
              {item.completed ? (
                <CheckCircle2 className="h-7 w-7 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
              ) : (
                <Circle className="h-7 w-7 text-neutral-500 hover:text-amber-500 transition-colors" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-black text-xl tracking-tight transition-colors ${item.completed ? 'text-neutral-500 line-through' : 'text-white'}`}>
                {item.exercises?.title || 'تمرين غير معروف'}
              </h3>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="px-4 py-1.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-sm font-medium text-neutral-300 flex items-center gap-1.5 shadow-inner">
                  <span className="text-neutral-500">مجموعات</span>
                  <span className="font-black text-white">{item.sets}</span>
                </div>
                <div className="px-4 py-1.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-sm font-medium text-neutral-300 flex items-center gap-1.5 shadow-inner">
                  <span className="text-neutral-500">تكرارات</span>
                  <span className="font-black text-white">{item.reps}</span>
                </div>
                {item.weight_target && (
                  <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-sm font-black shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                    {item.weight_target}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
