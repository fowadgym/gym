import { login, signup } from './actions'

export const metadata = {
  title: 'Authentication | Elite Gym',
  description: 'Log in or sign up to manage your Elite Gym membership.',
}

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Member Portal</h1>
        <p className="text-neutral-400 text-center mb-8">Sign in to manage your account</p>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm text-center">
            {message}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              formAction={login}
              className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              Log In
            </button>
            <button
              formAction={signup}
              className="w-full py-3 px-4 bg-transparent border border-neutral-700 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
