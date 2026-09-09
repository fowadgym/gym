'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth-guard'

export async function toggleExerciseCompletion(workoutExerciseId: string, completed: boolean) {
  const supabase = await createClient()
  const user = await requireAuth()

  // The RLS policy ensures athletes can only update their own workout exercises
  const { error } = await supabase
    .from('workout_exercises')
    .update({ completed })
    .eq('id', workoutExerciseId)

  if (error) {
    console.error('Error toggling completion:', error)
    throw new Error('Failed to update status')
  }

  revalidatePath('/portal/workout')
}
