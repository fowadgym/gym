import { createClient } from '@/lib/supabase/server'
import { Users, TrendingUp, AlertCircle } from 'lucide-react'
import { Database } from '@/types/database'

export const metadata = {
  title: 'Dashboard | Elite Admin',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch aggregated KPIs from the high-performance RPC
  const { data: kpiData, error } = await supabase.rpc('get_dashboard_kpis')
  
  // Safely parse the JSONB result
  let kpis = {
    total_active: 0,
    expiring_soon: 0,
    expired: 0,
    total_athletes: 0
  }

  if (kpiData && !error) {
    kpis = kpiData as any
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-400 font-medium">Total Athletes</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{kpis.total_athletes}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-400 font-medium">Active Subscriptions</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{kpis.total_active}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-400 font-medium">Expiring Soon</h3>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{kpis.expiring_soon}</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6 text-center text-neutral-500">
          No recent activity to show.
        </div>
      </div>
    </div>
  )
}
