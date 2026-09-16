import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TrendingUp, AlertCircle, Terminal, ArrowLeft, Search, UserPlus, FileDown, Shield, Eye, Edit, MoreVertical, Users } from 'lucide-react'
import { AddAthleteModal } from './add-athlete-modal'

export const metadata = {
  title: 'لوحة القيادة | إدارة أيرون كور',
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

  // Fetch all profiles for the athletes list
  const { data: athletes } = await supabase
    .from('profiles')
    .select('*, subscriptions(end_date, is_active)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Command Overview Hero Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs uppercase tracking-wider mb-1 font-semibold">
            <Terminal className="w-4 h-4" />
            <span>مصفوفة العمليات المباشرة</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">نظرة عامة على النظام</h2>
        </div>
      </section>

      {/* Hero KPI Metrics Row */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI Card 1: Total Athletes */}
        <div className="relative p-6 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 hover:border-amber-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] group overflow-hidden">
          <div className="absolute -end-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm text-neutral-400 font-semibold">إجمالي الرياضيين</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4 relative z-10">
            <span className="text-5xl font-black text-white tracking-tight">{kpis.total_athletes}</span>
            <span className="text-sm text-neutral-400">مسجل</span>
          </div>
        </div>

        {/* KPI Card 2: Expiring Soon */}
        <div className="relative p-6 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 hover:border-red-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] group overflow-hidden">
          <div className="absolute -end-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm text-neutral-400 font-semibold">تنتهي قريباً</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-900/40 border border-red-500/50 text-red-500 text-xs font-bold animate-pulse">
              <AlertCircle className="w-3 h-3" />
              إجراء مطلوب
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-4 relative z-10">
            <span className="text-5xl font-black text-red-500 tracking-tight">{kpis.expiring_soon}</span>
            <span className="text-sm text-neutral-400">اشتراكات</span>
          </div>
          <div className="pt-2 border-t border-neutral-800/50 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-neutral-400">حرج: الأيام الـ 7 القادمة</span>
            </div>
            <button className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1">
              مراجعة القائمة <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* --- Athletes Section --- */}
      <div className="pt-8 space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-white">سجل الرياضيين</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">إجمالي {athletes?.length || 0}</span>
            </div>
            <p className="text-neutral-400">إدارة السجل، باقات العضوية، بيانات الدخول، والتتبع المباشر للنشاط.</p>
          </div>
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors active:scale-[0.98]">
              <FileDown className="w-4 h-4" />
              <span>تصدير CSV</span>
            </button>
            <AddAthleteModal />
          </div>
        </div>

        {/* Filter & Search */}
        <section className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
          <div className="relative w-full md:w-96">
            <Search className="absolute end-3.5 top-2.5 text-neutral-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو الهاتف..." 
              className="w-full pe-10 ps-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-neutral-500"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-sm">الكل</button>
            <button className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-medium hover:bg-neutral-800 transition-colors">نشط</button>
          </div>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-5 text-start" scope="col">الرياضي</th>
                  <th className="py-3.5 px-3 text-start" scope="col">المعرف / الهاتف</th>
                  <th className="py-3.5 px-3 text-start" scope="col">الدور</th>
                  <th className="py-3.5 px-3 text-start" scope="col">تاريخ الانضمام</th>
                  <th className="py-3.5 ps-5 pe-3 text-end" scope="col">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {athletes?.map((athlete: any) => {
                  let isExpiringSoon = false
                  let isExpired = false
                  const activeSub = athlete.subscriptions?.find((s: any) => s.is_active)
                  
                  if (activeSub) {
                    const now = new Date()
                    const nextWeek = new Date()
                    nextWeek.setDate(now.getDate() + 7)
                    const endDate = new Date(activeSub.end_date)
                    if (endDate <= nextWeek && endDate >= now) {
                      isExpiringSoon = true
                    } else if (endDate < now) {
                      isExpired = true
                    }
                  }

                  return (
                  <tr key={athlete.id} className={`group transition-colors duration-150 ${isExpiringSoon ? 'bg-red-500/10 hover:bg-red-500/20 shadow-[inset_4px_0_0_0_rgba(239,68,68,1)]' : isExpired ? 'bg-neutral-900/80 hover:bg-neutral-800/80 opacity-70' : 'hover:bg-neutral-800/50'}`}>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full bg-neutral-800 ring-2 ${isExpiringSoon ? 'ring-red-500/60 shadow-red-500/20 text-red-500' : 'ring-amber-500/60 shadow-amber-500/20 text-amber-500'} shadow-md overflow-hidden flex-shrink-0 flex items-center justify-center font-bold`}>
                            {athlete.full_name?.charAt(0) || 'م'}
                          </div>
                          <span className={`absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ${isExpiringSoon ? 'bg-red-500 animate-pulse' : activeSub ? 'bg-green-500' : 'bg-neutral-600'} ring-2 ring-neutral-950`}></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-amber-500 transition-colors">{athlete.full_name || 'مستخدم غير معروف'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-white">{(athlete.id as string).substring(0, 8)}</span>
                        <span className="font-mono text-[11px] text-neutral-400">{athlete.phone_number || 'لا يوجد هاتف'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-500 text-xs font-bold tracking-wide">
                        <Shield className="w-3 h-3" />
                        <span>{athlete.role === 'admin' ? 'مدير عام' : athlete.role === 'coach' ? 'مدرب' : 'رياضي'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{new Date(athlete.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3.5 ps-5 pe-3 text-end">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/athletes/${athlete.id}`} className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-500 transition-colors" title="عرض الملف الشخصي">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link href={`/admin/athletes/${athlete.id}/edit`} className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-500 transition-colors" title="تعديل الرياضي">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="خيارات إضافية">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
                {(!athletes || athletes.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      لم يتم العثور على رياضيين.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
