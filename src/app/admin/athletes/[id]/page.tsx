import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SubscriptionManager from './subscription-manager'
import { ArrowRight, Calendar, Activity, Dumbbell } from 'lucide-react'

export default async function AthleteDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: athlete } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!athlete) {
    return (
      <div className="p-8 text-center text-neutral-400">
        لم يتم العثور على الرياضي. <Link href="/admin/dashboard" className="text-amber-500 hover:underline">العودة</Link>
      </div>
    )
  }

  // Fetch subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('athlete_id', params.id)
    .order('end_date', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4">
          <ArrowRight className="h-4 w-4" /> العودة إلى سجل الرياضيين
        </Link>
        <h1 className="text-3xl font-bold text-white">{athlete.full_name}</h1>
        <p className="text-neutral-400 font-mono mt-1">{athlete.phone_number || 'لا يوجد رقم هاتف'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" /> حالة الاشتراك
          </h2>
          
          {subscriptions && subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize font-medium text-white">فئة {sub.tier}</span>
                    {sub.is_active ? (
                      <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-full font-bold">نشط</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs rounded-full font-bold">منتهي</span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-400 font-mono">
                    {new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/50">
              <p className="text-sm font-semibold text-neutral-500">لم يتم العثور على اشتراكات لهذا الرياضي.</p>
            </div>
          )}

          <SubscriptionManager 
            athleteId={athlete.id} 
            activeSub={subscriptions?.find((s) => s.is_active) as any} 
          />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl lg:col-span-2 flex flex-col items-center justify-center min-h-[400px]">
          <Dumbbell className="w-12 h-12 text-neutral-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">البرامج التدريبية</h3>
          <p className="text-neutral-500 text-sm text-center max-w-sm mb-6">قم ببناء وجدولة كورسات تدريبية مخصصة لهذا الرياضي على تقويمه الخاص.</p>
          <Link href={`/admin/athletes/${athlete.id}/assign-course`} className="px-6 py-3 rounded-xl bg-amber-500 text-neutral-950 hover:brightness-110 font-black shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
            بناء كورس تدريبي جديد
          </Link>
        </div>
      </div>
    </div>
  )
}
