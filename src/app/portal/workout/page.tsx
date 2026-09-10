import { createClient } from '@/lib/supabase/server'
import { ExerciseList } from './exercise-list'

export const metadata = {
  title: 'تمرين اليوم | فؤاد جيم',
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
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-full flex items-center justify-center text-4xl mb-2 shadow-2xl">
          🧘
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">لا يوجد تمرين اليوم</h1>
        <p className="text-neutral-400 font-medium max-w-xs leading-relaxed">استمتع بيوم الراحة! التعافي السليم لا يقل أهمية عن التدريب نفسه.</p>
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
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">روتين اليوم</h1>
        {todayWorkout.notes && (
          <p className="text-neutral-300 font-medium bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 p-4 rounded-2xl leading-relaxed">
            {todayWorkout.notes}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-5 shadow-lg">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-neutral-300 font-bold">التقدم</span>
          <span className="text-amber-500 font-black">{progressPercent}%</span>
        </div>
        <div className="h-4 w-full bg-neutral-950/60 rounded-full overflow-hidden border border-neutral-800/30">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-700 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Exercise List */}
      <ExerciseList initialExercises={sortedExercises as any} />
    </div>
  )
}
