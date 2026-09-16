'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, ArrowRight } from 'lucide-react'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.')
      return
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.')
      return
    }

    try {
      setLoading(true)
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: { requires_password_change: false }
      })

      if (updateError) {
        throw updateError
      }

      // Password updated successfully, redirect to dashboard/portal
      router.push('/portal/dashboard')
      
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تعيين كلمة المرور.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-amber-500/20 blur-[100px] rounded-full opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">إعداد كلمة المرور</h1>
          <p className="text-sm text-neutral-400">
            مرحباً بك في أيرون كور! يرجى إعداد كلمة مرور خاصة بك لتتمكن من تسجيل الدخول لاحقاً.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider ps-1">
              كلمة المرور الجديدة
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-left" 
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider ps-1">
              تأكيد كلمة المرور
            </label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-left" 
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full px-4 py-3.5 rounded-xl bg-amber-500 text-neutral-950 text-sm font-black shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                حفظ والمتابعة
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
