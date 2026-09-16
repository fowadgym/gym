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

  // Fetch ALL workouts for this athlete across all time
  const { data: allWorkouts } = await supabase
    .from('workouts')
    .select('id, date, notes, workout_exercises(id)')
    .eq('athlete_id', user?.id)
    .order('date', { ascending: true })
    
  const workouts = allWorkouts || []

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

      {/* Course Workouts List */}
      <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-neutral-400 mb-6">
          <Dumbbell className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-bold uppercase tracking-wider">جدول الكورس الخاص بك</span>
        </div>
        
        {workouts && workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.map((w, index) => {
              const hasExercises = w.workout_exercises && w.workout_exercises.length > 0;
              const title = w.notes || `اليوم ${index + 1}`;
              
              const InnerContent = (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className={`font-black text-xl mb-1 ${hasExercises ? 'text-white group-hover:text-amber-500 transition-colors' : 'text-neutral-400'}`}>
                      {title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      {hasExercises ? 'اضغط للبدء' : 'يوم راحة - للتعافي'}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {hasExercises ? (
                      <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                        {w.workout_exercises.length} تمارين
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                        يوم راحة
                      </span>
                    )}
                    
                    {hasExercises && (
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
              
              if (hasExercises) {
                return (
                  <Link 
                    key={w.id} 
                    href={`/portal/workout?id=${w.id}`} 
                    className="flex flex-col bg-neutral-950/50 p-5 rounded-2xl border border-neutral-800/80 hover:bg-neutral-900 hover:border-amber-500/50 transition-all cursor-pointer group hover:scale-[1.02] shadow-lg"
                  >
                    {InnerContent}
                  </Link>
                );
              }
              
              return (
                <div key={w.id} className="flex flex-col bg-neutral-950/30 p-5 rounded-2xl border border-neutral-800/40 opacity-70">
                  {InnerContent}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-400 font-bold text-lg mb-2">لا يوجد كورس مفعل حالياً.</p>
            <p className="text-sm text-neutral-500">يرجى التواصل مع المدرب لتخصيص جدول لك.</p>
          </div>
        )}
      </div>
    </div>
  )
}
