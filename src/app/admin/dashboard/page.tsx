import { createClient } from '@/lib/supabase/server'
import { TrendingUp, AlertCircle, Terminal, Download, ArrowRight, ShieldCheck, Thermometer, Users, CreditCard } from 'lucide-react'

export const metadata = {
  title: 'Dashboard | Elite Admin',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch aggregated KPIs from the high-performance RPC
  const { data: kpiData, error } = await supabase.rpc('get_dashboard_kpis')
  
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
    <div className="space-y-6">
      {/* Command Overview Hero Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs uppercase tracking-wider mb-1 font-semibold">
            <Terminal className="w-4 h-4" />
            <span>Real-time Operational Matrix</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Command Overview</h2>
        </div>
        {/* Live Action Cluster */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-semibold text-neutral-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Online</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-amber-500 text-white text-sm font-semibold transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </section>

      {/* Hero KPI Metrics Row */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Card 1: Total Athletes */}
        <div className="relative p-6 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 hover:border-amber-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] group overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm text-neutral-400 font-semibold">Total Athletes</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +15% this month
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-4 relative z-10">
            <span className="text-5xl font-black text-white tracking-tight">{kpis.total_athletes}</span>
            <span className="text-sm text-neutral-400">registered</span>
          </div>
          {/* Micro Sparkline */}
          <div className="pt-2 border-t border-neutral-800/50 relative z-10">
            <div className="flex items-end gap-1.5 h-9 w-full">
              {[30, 45, 40, 60, 50, 75, 65, 85, 100].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t transition-colors ${h === 100 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-neutral-800 hover:bg-amber-500/60'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-2 text-right">Peak onboarding streak: 12d</p>
          </div>
        </div>

        {/* KPI Card 2: Active Subscriptions */}
        <div className="relative p-6 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 hover:border-amber-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] group overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm text-neutral-400 font-semibold">Active Subscriptions</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +8.2% vs last mo
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-4 relative z-10">
            <span className="text-5xl font-black text-white tracking-tight">{kpis.total_active}</span>
            <span className="text-sm text-neutral-400">{kpis.total_athletes > 0 ? Math.round((kpis.total_active / kpis.total_athletes) * 100) : 0}% rate</span>
          </div>
          {/* Tier Breakdown Indicator */}
          <div className="pt-2 border-t border-neutral-800/50 space-y-2 relative z-10">
            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden flex">
              <div className="bg-amber-500 h-full" style={{ width: '58%' }}></div>
              <div className="bg-amber-700 h-full" style={{ width: '27%' }}></div>
              <div className="bg-neutral-600 h-full" style={{ width: '15%' }}></div>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Iron 58%</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span> Black 27%</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span> Base 15%</span>
            </div>
          </div>
        </div>

        {/* KPI Card 3: Expiring Soon */}
        <div className="relative p-6 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 hover:border-red-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] group overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm text-neutral-400 font-semibold">Expiring Soon</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-900/40 border border-red-500/50 text-red-500 text-xs font-bold animate-pulse">
              <AlertCircle className="w-3 h-3" />
              Action Required
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-4 relative z-10">
            <span className="text-5xl font-black text-red-500 tracking-tight">{kpis.expiring_soon}</span>
            <span className="text-sm text-neutral-400">memberships</span>
          </div>
          <div className="pt-2 border-t border-neutral-800/50 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-neutral-400">Next 7 Days Critical</span>
            </div>
            <button className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1">
              Review List <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Contextual Quick Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white">Access Gates</span>
            <span className="text-xs font-semibold text-amber-500">All 4 Operational</span>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white">Facility Climate</span>
            <span className="text-xs font-semibold text-neutral-400">68.2°F • 42% Humidity</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white">On-Duty Coaches</span>
            <span className="text-xs font-semibold text-amber-500">6 Active On Floor</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white">Pro Shop POS</span>
            <span className="text-xs font-semibold text-neutral-400">$2,840 Today</span>
          </div>
        </div>
      </section>
    </div>
  )
}
