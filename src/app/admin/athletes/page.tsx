import { createClient } from '@/lib/supabase/server'
import { Search, ChevronRight, UserPlus, FileDown, MoreVertical, Edit, Shield, Play, Badge, Eye, Users } from 'lucide-react'

export const metadata = {
  title: 'Athletes | Elite Admin',
}

export default async function AthletesPage() {
  const supabase = await createClient()

  // Fetch all profiles
  const { data: athletes } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-white">Athletes Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">{athletes?.length || 0} Total</span>
          </div>
          <p className="text-neutral-400">Roster management, membership tiers, RFID credentials, and biometric access tracking.</p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors active:scale-[0.98]">
            <FileDown className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-neutral-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.98] transition-all">
            <UserPlus className="w-5 h-5" />
            <span>Add Athlete</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Readout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total Registered</div>
            <div className="text-2xl font-black text-white mt-0.5">{athletes?.length || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-amber-500 border border-neutral-800">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <section className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-2.5 text-neutral-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Name, phone..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-neutral-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-sm">All</button>
          <button className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-medium hover:bg-neutral-800 transition-colors">Active</button>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-5" scope="col">Athlete</th>
                <th className="py-3.5 px-3" scope="col">ID / Phone</th>
                <th className="py-3.5 px-3" scope="col">Role</th>
                <th className="py-3.5 px-3" scope="col">Joined</th>
                <th className="py-3.5 pr-5 pl-3 text-right" scope="col">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-sm">
              {athletes?.map((athlete) => (
                <tr key={athlete.id} className="group hover:bg-neutral-800/50 transition-colors duration-150">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 ring-2 ring-amber-500/60 shadow-md shadow-amber-500/20 overflow-hidden flex-shrink-0 flex items-center justify-center text-amber-500 font-bold">
                          {athlete.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-neutral-950"></span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-amber-500 transition-colors">{athlete.full_name || 'Unknown User'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-white">{(athlete.id as string).substring(0, 8)}</span>
                      <span className="font-mono text-[11px] text-neutral-400">{athlete.phone_number || 'No Phone'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-500 text-xs font-bold tracking-wide">
                      <Shield className="w-3 h-3" />
                      <span>{athlete.role === 'admin' ? 'HQ Admin' : athlete.role === 'coach' ? 'Coach' : 'Athlete'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{new Date(athlete.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-5 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-500 transition-colors" title="View Profile">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-500 transition-colors" title="Edit Athlete">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="More Options">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!athletes || athletes.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    No athletes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
