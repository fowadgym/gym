import { login, resetPassword } from './actions'
import Image from 'next/image'

export const metadata = {
  title: 'تسجيل الدخول | فؤاد جيم',
  description: 'سجل الدخول أو أنشئ حساباً جديداً لإدارة عضويتك.',
}

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden" dir="rtl">
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

      <div className="relative z-10 w-full max-w-md bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            بوابة <span className="text-amber-500">الأعضاء</span>
          </h1>
          <p className="text-neutral-400 font-medium text-lg">سجل الدخول لإدارة حسابك</p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm text-center font-medium">
            {message}
          </div>
        )}

        <form className="flex flex-col gap-5 text-right">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold text-neutral-300 px-1">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-5 py-4 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-neutral-600 text-left"
              placeholder="you@example.com"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className="text-sm font-bold text-neutral-300">
                كلمة المرور
              </label>
              <button
                formAction={resetPassword}
                formNoValidate
                className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline transition-all"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-5 py-4 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-neutral-600 text-left"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              formAction={login}
              className="w-full py-4 px-6 bg-amber-500 text-neutral-950 font-black text-lg rounded-2xl hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
