'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignSubscription(formData: FormData) {
  const supabase = await createClient()

  const athleteId = formData.get('athleteId') as string
  const tier = formData.get('tier') as 'basic' | 'pro' | 'vip'
  const endDate = formData.get('endDate') as string

  if (!athleteId || !tier || !endDate) {
    return { error: 'جميع الحقول مطلوبة.' }
  }

  try {
    // Check for an active subscription
    const { data: activeSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('is_active', true)
      .single()

    if (activeSub) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          end_date: endDate,
          tier: tier
        })
        .eq('id', activeSub.id)

      if (updateError) throw updateError
    } else {
      // Insert new subscription
      const startDate = new Date().toISOString()
      
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          athlete_id: athleteId,
          tier,
          start_date: startDate,
          end_date: endDate,
          is_active: true
        })

      if (insertError) throw insertError
    }

    revalidatePath(`/admin/athletes/${athleteId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Subscription error:', err)
    return { error: 'حدث خطأ أثناء حفظ الاشتراك.' }
  }
}

export async function assignCourseToAthlete(athleteId: string, courseData: any) {
  const supabase = await createClient()

  try {
    const { startDate, days } = courseData
    const start = new Date(startDate)

    for (let i = 0; i < days.length; i++) {
      const day = days[i]
      const current = new Date(start)
      current.setDate(start.getDate() + i)
      const dateString = current.toISOString().split('T')[0]

      // Insert Workout
      const { data: workout, error: wError } = await supabase
        .from('workouts')
        .insert({
          athlete_id: athleteId,
          date: dateString,
          notes: day.name || (day.isRest ? 'يوم راحة' : 'يوم تدريب')
        })
        .select()
        .single()

      if (wError) throw wError

      // Insert Exercises if not a rest day
      if (!day.isRest && day.exercises && day.exercises.length > 0) {
        const exercisesToInsert = day.exercises.map((ex: any, idx: number) => ({
          workout_id: workout.id,
          exercise_id: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          weight_target: ex.weight_target || null,
          order_index: idx
        }))

        const { error: eError } = await supabase
          .from('workout_exercises')
          .insert(exercisesToInsert)

        if (eError) throw eError
      }
    }

    revalidatePath(`/admin/athletes/${athleteId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Course Assignment Error:', err)
    return { error: 'حدث خطأ أثناء حفظ الكورس.' }
  }
}
