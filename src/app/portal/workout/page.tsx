import { createClient } from '@/lib/supabase/server'
import { ExerciseList } from './exercise-list'

export const metadata = {
  title: 'Today\'s Workout | Elite Gym',
}

export default async function WorkoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const todayStr = new Date().toISOString().split('T')[0]
  
  // Fetch today's workout
  const { data: workouts } = await supabase
    .from('workouts')
    .select(`
      id, 
      notes, 
      workout_exercises (
        id,
        sets,
        reps,
        weight_target,
        completed,
        order_index,
        exercises (
          title,
          video_url
        )
      )
    `)
    .eq('athlete_id', user?.id)
    .eq('date', todayStr)
    .limit(1)
  
  const todayWorkout = workouts?.[0]
  
  if (!todayWorkout) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-2xl mb-2">
          🧘
        </div>
        <h1 className="text-2xl font-bold text-white">No Workout Today</h1>
        <p className="text-neutral-400">Enjoy your rest day! Proper recovery is just as important as the training itself.</p>
      </div>
    )
  }

  // Sort exercises by order_index
  const sortedExercises = [...(todayWorkout.workout_exercises || [])].sort(
    (a, b) => (a.order_index || 0) - (b.order_index || 0)
  )

  const completedCount = sortedExercises.filter(ex => ex.completed).length
  const totalCount = sortedExercises.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Today's Routine</h1>
        {todayWorkout.notes && (
          <p className="text-neutral-400 text-sm">{todayWorkout.notes}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-400 font-medium">Progress</span>
          <span className="text-amber-500 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Exercise List */}
      <ExerciseList initialExercises={sortedExercises as any} />
    </div>
  )
}
