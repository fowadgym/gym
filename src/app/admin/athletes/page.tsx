import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Athletes | Elite Admin',
}

export default async function AthletesPage() {
  const supabase = await createClient()

  // Fetch all profiles. In a real app we'd paginate and filter.
  const { data: athletes } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Athlete Roster</h1>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search athletes..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950 text-neutral-300 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Athlete Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {athletes?.map((athlete) => (
              <tr key={athlete.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{athlete.full_name}</td>
                <td className="px-6 py-4">{athlete.phone_number || 'N/A'}</td>
                <td className="px-6 py-4">{new Date(athlete.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/athletes/${athlete.id}`} className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 font-medium">
                    View <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {(!athletes || athletes.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  No athletes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
