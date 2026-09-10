'use client'

import { useState } from 'react'
import { assignSubscription } from './actions'
import { Calendar, Plus, Clock } from 'lucide-react'

interface SubscriptionManagerProps {
  athleteId: string
  activeSub?: {
    id: string
    end_date: string
    tier: 'basic' | 'pro' | 'vip'
  }
}

export default function SubscriptionManager({ athleteId, activeSub }: SubscriptionManagerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Default tier to active or 'basic'
  const [tier, setTier] = useState<'basic' | 'pro' | 'vip'>(activeSub?.tier || 'basic')
  
  // Base date for extensions: either the active end date or today
  const baseDate = activeSub ? new Date(activeSub.end_date) : new Date()
  
  // Keep date picker value
  const [customDate, setCustomDate] = useState<string>('')

  const handlePreset = (months: number) => {
    const d = new Date(baseDate)
    d.setMonth(d.getMonth() + months)
    setCustomDate(d.toISOString().split('T')[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    
    if (!customDate) {
      setError('يرجى تحديد تاريخ الانتهاء.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('athleteId', athleteId)
    formData.append('tier', tier)
    formData.append('endDate', customDate)

    const res = await assignSubscription(formData)
    
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-semibold text-white">إدارة وتمديد الاشتراك</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Tier Selection */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">الفئة</label>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
            {['basic', 'pro', 'vip'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t as any)}
                className={`py-2 rounded-md text-xs font-bold transition-all ${
                  tier === t ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Presets */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>إضافة مدة سريعة</span>
            {activeSub && <span className="text-amber-500 text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full">يبدأ من تاريخ الانتهاء الحالي</span>}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => handlePreset(1)} className="py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors">
              + 1 شهر
            </button>
            <button type="button" onClick={() => handlePreset(4)} className="py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors flex items-center justify-center gap-1">
              <Plus className="w-3 h-3 text-amber-500" /> 4 أشهر
            </button>
            <button type="button" onClick={() => handlePreset(12)} className="py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors">
              + 1 سنة
            </button>
          </div>
        </div>

        {/* Custom Date Picker */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">تاريخ الانتهاء المخصص</label>
          <div className="relative">
            <Calendar className="absolute end-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input 
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Messages */}
        {error && <div className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
        {success && <div className="text-green-500 text-xs font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20">تم تحديث الاشتراك بنجاح!</div>}

        <button 
          type="submit" 
          disabled={loading || !customDate}
          className="w-full py-3 rounded-xl bg-amber-500 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-neutral-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
        >
          {loading ? 'جاري الحفظ...' : activeSub ? 'تمديد الاشتراك' : 'تعيين اشتراك جديد'}
        </button>
      </form>
    </div>
  )
}
