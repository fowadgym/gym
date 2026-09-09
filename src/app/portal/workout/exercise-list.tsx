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
        alert('Failed to save progress. Please try again.')
      }
    })
  }

  if (exercises.length === 0) {
    return <div className="text-center text-neutral-500 py-8">No exercises found for this workout.</div>
  }

  return (
    <div className="space-y-4">
      {exercises.map((item) => (
        <div 
          key={item.id} 
          className={`bg-neutral-900 border rounded-2xl overflow-hidden transition-colors ${item.completed ? 'border-green-500/30 bg-green-500/5' : 'border-neutral-800'}`}
        >
          {item.exercises?.video_url && (
            <div className="aspect-video bg-neutral-950 relative border-b border-neutral-800/50 group">
              <video 
                src={item.exercises.video_url} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity ${item.completed ? 'opacity-30' : 'opacity-70'}`}
                preload="none"
                controls
                playsInline
                poster="" // Could add a poster here
              />
            </div>
          )}
          
          <div className="p-4 sm:p-5 flex items-start gap-4">
            <button 
              onClick={() => handleToggle(item.id, item.completed)}
              className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full"
            >
              {item.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-neutral-500 hover:text-amber-500 transition-colors" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${item.completed ? 'text-neutral-400 line-through' : 'text-white'}`}>
                {item.exercises?.title || 'Unknown Exercise'}
              </h3>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-300">
                  <span className="text-neutral-500 mr-1">Sets</span>
                  <span className="font-bold">{item.sets}</span>
                </div>
                <div className="px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-300">
                  <span className="text-neutral-500 mr-1">Reps</span>
                  <span className="font-bold">{item.reps}</span>
                </div>
                {item.weight_target && (
                  <div className="px-3 py-1 bg-neutral-950 border border-amber-500/20 text-amber-500 rounded-lg text-sm font-medium">
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
