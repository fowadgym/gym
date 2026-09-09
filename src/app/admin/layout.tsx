import Link from 'next/link'
import { Dumbbell, Users, Activity, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || (user.app_metadata?.role !== 'admin' && user.app_metadata?.role !== 'coach')) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Dumbbell className="h-6 w-6 text-amber-500" />
            <span>Elite Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors">
            <Activity className="h-5 w-5 text-neutral-400" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/athletes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors">
            <Users className="h-5 w-5 text-neutral-400" />
            <span className="font-medium">Athletes</span>
          </Link>
          <Link href="/admin/exercises" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors">
            <Dumbbell className="h-5 w-5 text-neutral-400" />
            <span className="font-medium">Exercises</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-neutral-800 transition-colors text-left text-neutral-400 hover:text-white">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Dumbbell className="h-6 w-6 text-amber-500" />
            <span>Elite Admin</span>
          </Link>
          <form action="/auth/signout" method="post">
            <button className="p-2 text-neutral-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
