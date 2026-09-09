import Link from 'next/link'
import { Dumbbell, Activity, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'athlete') {
    // If not athlete, middleware should have redirected, but checking here for safety
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-200">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 sticky top-0 z-10">
          <Link href="/portal/dashboard" className="flex items-center gap-2 text-white font-bold text-lg">
            <Dumbbell className="h-5 w-5 text-amber-500" />
            <span>Member Portal</span>
          </Link>
          <form action="/auth/signout" method="post">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-lg mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-neutral-900 border-t border-neutral-800 flex items-center justify-around pb-safe z-20">
        <Link href="/portal/dashboard" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500 w-full h-full justify-center">
          <Activity className="h-5 w-5" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Dashboard</span>
        </Link>
        <Link href="/portal/workout" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500 w-full h-full justify-center">
          <Dumbbell className="h-5 w-5" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Workout</span>
        </Link>
      </nav>
    </div>
  )
}
