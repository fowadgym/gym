'use client'

import { useState } from 'react'
import { UserPlus, X, Loader2 } from 'lucide-react'
import { inviteAthlete } from './actions'

export function AddAthleteModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await inviteAthlete(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setSuccess(false)
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-neutral-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
      >
        <UserPlus className="w-5 h-5" />
        <span>إضافة رياضي</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !loading && setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">إضافة رياضي جديد</h2>
              </div>
              <button 
                onClick={() => !loading && setIsOpen(false)}
                className="text-neutral-500 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold flex flex-col gap-1">
                  <span>تم إنشاء الحساب بنجاح!</span>
                  <span className="text-white bg-neutral-900 px-2 py-1 rounded w-fit border border-neutral-700">كلمة المرور الافتراضية: 123456</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">الاسم الكامل</label>
                <input 
                  type="text" 
                  name="fullName"
                  required 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" 
                  placeholder="مثال: أحمد محمد"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-left" 
                  placeholder="athlete@example.com"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">رقم الهاتف</label>
                <input 
                  type="tel" 
                  name="phone"
                  required 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-left" 
                  placeholder="+964..."
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 mt-2 border-t border-neutral-800">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-white text-sm font-semibold transition-all"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={loading || success}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-neutral-950 text-sm font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    'إنشاء الحساب'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
