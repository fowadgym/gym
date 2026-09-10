import Link from 'next/link'
import Image from 'next/image'
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
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-200 overflow-hidden relative" dir="rtl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.webp"
          alt="Gym facility background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[6px]"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 relative z-10">
        <header className="h-16 bg-neutral-900/40 backdrop-blur-xl border-b border-neutral-800/50 flex items-center justify-between px-4 sticky top-0 z-10">
          <Link href="/portal/dashboard" className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
            <Dumbbell className="h-6 w-6 text-amber-500" />
            <span>بوابة <span className="text-amber-500">الأعضاء</span></span>
          </Link>
          <form action="/auth/signout" method="post">
            <button className="p-2 text-neutral-400 hover:text-amber-500 transition-colors">
              <LogOut className="h-6 w-6" />
            </button>
          </form>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-lg mx-auto w-full relative z-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-neutral-900/40 backdrop-blur-xl border-t border-neutral-800/50 flex items-center justify-around pb-safe z-20">
        <Link href="/portal/dashboard" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500 w-full h-full justify-center transition-colors">
          <Activity className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider">الرئيسية</span>
        </Link>
        <Link href="/portal/workout" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500 w-full h-full justify-center transition-colors">
          <Dumbbell className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider">التمارين</span>
        </Link>
      </nav>
    </div>
  )
}
