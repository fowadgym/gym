'use client';

import Link from 'next/link'
import { Dumbbell, Users, Activity, LogOut, Settings, Bell, Search, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', icon: Activity, label: 'Dashboard' },
    { href: '/admin/athletes', icon: Users, label: 'Athletes' },
    { href: '/admin/exercises', icon: Dumbbell, label: 'Exercises' },
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 antialiased min-h-screen flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Floating Sticky Sidebar (Desktop) */}
      <aside className="fixed top-0 left-0 h-screen w-64 m-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl z-50 hidden lg:flex flex-col justify-between p-4">
        <div>
          {/* Top Brand & Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500 shadow-inner">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-amber-500 tracking-wider leading-tight text-sm">IRONCORE ADMIN</h1>
              <p className="text-xs text-neutral-400 opacity-75">Control Center</p>
            </div>
          </div>
          
          {/* Quick Action CTA */}
          <button className="w-full mb-6 py-2.5 px-4 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(245,158,11,0.3)] hover:bg-amber-600 active:scale-[0.98] transition-all duration-150">
            <Plus className="w-4 h-4" />
            New Check-In
          </button>
          
          {/* Primary Nav List */}
          <nav aria-label="Main Navigation" className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                    isActive 
                      ? 'bg-neutral-800 text-amber-500 border-l-4 border-amber-500 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)] hover:bg-neutral-700' 
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white active:scale-[0.98]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Secondary Area */}
        <div className="space-y-4 pt-4 border-t border-neutral-800">
          <div className="space-y-1">
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-neutral-400 font-semibold text-sm hover:bg-neutral-900 hover:text-white active:scale-[0.98] transition-colors duration-150">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <form action="/auth/signout" method="post">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-neutral-400 font-semibold text-sm hover:bg-neutral-900 hover:text-red-400 active:scale-[0.98] transition-colors duration-150">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
          
          <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-xs text-white">Floor Active</span>
            </div>
            <span className="font-bold text-xs text-amber-500">L4 Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-xl shadow-sm border-b border-neutral-900/50">
          <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto w-full gap-4">
            {/* Left: Search Bar & Product Identity */}
            <div className="flex items-center gap-6 flex-1 max-w-xl">
              <div className="lg:hidden flex items-center gap-2">
                <span className="font-black text-sm tracking-widest text-amber-500">IRONCORE ADMIN</span>
              </div>
              <div className="relative w-full hidden sm:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="search" 
                  placeholder="Search athletes by name, badge, or RFID plan..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Center: Live Gym Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-semibold text-xs text-neutral-400">Live Occupancy:</span>
              <span className="font-extrabold text-xs text-amber-500">84% Capacity</span>
            </div>

            {/* Right: Actions Cluster */}
            <div className="flex items-center gap-3">
              <button aria-label="Notifications" className="relative p-2 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-900 active:scale-[0.98] transition-colors duration-150">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-neutral-950"></span>
              </button>
              
              <div className="h-6 w-px bg-neutral-800 mx-1 hidden sm:block"></div>
              
              <div className="relative">
                <div className="w-9 h-9 rounded-lg border border-amber-500/50 bg-neutral-800 flex items-center justify-center p-0.5">
                  <span className="font-bold text-amber-500 text-xs">AD</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-neutral-950"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Nav Bar */}
      <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-xl py-2 px-6 flex items-center justify-around shadow-2xl border-t border-neutral-800/50">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className={`flex flex-col items-center gap-1 ${isActive ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}>
              <Icon className="w-6 h-6" />
              <span className="font-semibold text-[10px]">{link.label}</span>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
