import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Dumbbell, Calendar, Clock } from 'lucide-react'

export const metadata = {
  title: 'بوابة الأعضاء | فؤاد جيم',
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
      <h1 className="text-3xl font-black text-white tracking-tight">مرحباً بك مجدداً</h1>
      
      {/* Subscription Card */}
      <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -me-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center gap-2 text-neutral-400 mb-2">
          <Calendar className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-bold uppercase tracking-wider">الاشتراك</span>
        </div>
        
        {activeSub ? (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-black text-white">{daysLeft}</p>
              <p className="text-neutral-400 font-bold text-sm">أيام متبقية</p>
            </div>
            <div className="text-end">
              <span className="inline-block px-4 py-1.5 bg-neutral-950/60 border border-amber-500/30 text-amber-500 text-xs rounded-full font-black uppercase shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                باقة {activeSub.tier}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-red-400 font-semibold mb-2">لا يوجد اشتراك نشط.</p>
            <p className="text-sm text-neutral-400">يرجى التواصل مع الإدارة لتجديد اشتراكك والوصول إلى التمارين.</p>
          </div>
        )}
      </div>

      {/* Workout Quick Launch */}
      <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-neutral-400 mb-4">
          <Clock className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-bold uppercase tracking-wider">جدول اليوم</span>
        </div>

        {todayWorkout ? (
          <div className="space-y-5">
            <p className="text-white font-bold text-lg">لديك تمرين مخصص لليوم.</p>
            <div className="flex items-center gap-2 text-sm text-neutral-300 font-medium">
              <Dumbbell className="h-4 w-4 text-amber-500" />
              <span>{totalExercises} تمارين</span>
            </div>
            {todayWorkout.notes && (
              <p className="text-sm text-neutral-400 italic bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 leading-relaxed">
                "{todayWorkout.notes}"
              </p>
            )}
            
            <Link 
              href="/portal/workout" 
              className="mt-2 block w-full py-4 text-center bg-amber-500 text-black font-black text-lg rounded-2xl hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              ابدأ التمرين
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-400 font-bold text-lg">يوم راحة! لا توجد تمارين مجدولة لليوم.</p>
          </div>
        )}
      </div>
    </div>
  )
}
