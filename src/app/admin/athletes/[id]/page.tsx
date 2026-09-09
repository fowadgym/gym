import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Calendar, Activity } from 'lucide-react'

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
        Athlete not found. <Link href="/admin/athletes" className="text-amber-500">Go back</Link>
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
        <Link href="/admin/athletes" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Athletes
        </Link>
        <h1 className="text-3xl font-bold text-white">{athlete.full_name}</h1>
        <p className="text-neutral-400">{athlete.phone_number}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" /> Subscription Status
          </h2>
          
          {subscriptions && subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 border border-neutral-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize font-medium text-white">{sub.tier} Tier</span>
                    {sub.is_active ? (
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-full font-medium">Expired</span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No subscriptions found for this athlete.</p>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-500" /> Workout History
          </h2>
          <div className="text-center py-8 text-neutral-500">
            Workout assignment module coming soon.
          </div>
        </div>
      </div>
    </div>
  )
}
