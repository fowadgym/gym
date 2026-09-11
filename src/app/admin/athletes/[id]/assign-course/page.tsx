import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CourseBuilder from './course-builder'

export const metadata = {
  title: 'تعيين كورس تدريبي | إدارة أيرون كور',
}

export default async function AssignCoursePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: athlete } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: false })

  // Find the active course for this athlete
  const { data: latestWorkout } = await supabase
    .from('workouts')
    .select('course_id')
    .eq('athlete_id', params.id)
    .not('course_id', 'is', null)
    .order('date', { ascending: false })
    .limit(1)

  let initialCourse = null

  if (latestWorkout?.[0]?.course_id) {
    const { data: courseWorkouts } = await supabase
      .from('workouts')
      .select(`
        id,
        date,
        notes,
        workout_exercises (
          id,
          exercise_id,
          sets,
          reps,
          weight_target,
          order_index
        )
      `)
      .eq('course_id', latestWorkout[0].course_id)
      .order('date', { ascending: true })

    if (courseWorkouts && courseWorkouts.length > 0) {
      initialCourse = {
        courseId: latestWorkout[0].course_id,
        startDate: courseWorkouts[0].date,
        days: courseWorkouts.map(w => ({
          id: w.id,
          name: w.notes,
          isRest: !w.workout_exercises || w.workout_exercises.length === 0,
          exercises: (w.workout_exercises || [])
            .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            .map((ex: any) => ({
              id: ex.id,
              exerciseId: ex.exercise_id,
              sets: ex.sets,
              reps: ex.reps,
              weight_target: ex.weight_target || ''
            }))
        }))
      }
    }
  }

  if (!athlete) return <div className="text-center p-10 text-white">لم يتم العثور على الرياضي</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-neutral-800/50 pb-6">
        <Link href={`/admin/athletes/${athlete.id}`} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">بناء كورس تدريبي</h2>
          <p className="text-neutral-400 text-sm mt-1">للرياضي: <span className="text-amber-500 font-bold">{athlete.full_name}</span></p>
        </div>
      </div>

      <CourseBuilder athleteId={athlete.id} exercises={exercises || []} initialCourse={initialCourse} />
    </div>
  )
}
