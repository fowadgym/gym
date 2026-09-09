import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Dumbbell, Calendar, Clock } from 'lucide-react'

export const metadata = {
  title: 'My Portal | Elite Gym',
}

export default async function PortalDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch active subscription
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('athlete_id', user?.id)
    .eq('is_active', true)
    .limit(1)

  const activeSub = subscriptions?.[0]
  
  let daysLeft = 0
  if (activeSub) {
    const end = new Date(activeSub.end_date)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)))
  }

  // Fetch today's workout
  const todayStr = new Date().toISOString().split('T')[0]
  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, notes, workout_exercises(id)')
    .eq('athlete_id', user?.id)
    .eq('date', todayStr)
    .limit(1)
  
  const todayWorkout = workouts?.[0]
  const totalExercises = todayWorkout?.workout_exercises?.length || 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
      
      {/* Subscription Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center gap-2 text-neutral-400 mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium uppercase tracking-wider">Subscription</span>
        </div>
        
        {activeSub ? (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-black text-white">{daysLeft}</p>
              <p className="text-neutral-400 font-medium">Days Remaining</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-neutral-950 border border-amber-500/30 text-amber-500 text-xs rounded-full font-bold uppercase">
                {activeSub.tier} Tier
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-red-400 font-semibold mb-2">No active subscription found.</p>
            <p className="text-sm text-neutral-500">Contact the front desk to renew your membership and access workouts.</p>
          </div>
        )}
      </div>

      {/* Workout Quick Launch */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center gap-2 text-neutral-400 mb-4">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium uppercase tracking-wider">Today's Schedule</span>
        </div>

        {todayWorkout ? (
          <div className="space-y-4">
            <p className="text-white font-medium">You have a workout scheduled for today.</p>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Dumbbell className="h-4 w-4" />
              <span>{totalExercises} Exercises</span>
            </div>
            {todayWorkout.notes && (
              <p className="text-sm text-neutral-500 italic bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                "{todayWorkout.notes}"
              </p>
            )}
            
            <Link 
              href="/portal/workout" 
              className="mt-2 block w-full py-4 text-center bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-colors"
            >
              Start Workout
            </Link>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-neutral-500">Rest day! No workouts scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  )
}
