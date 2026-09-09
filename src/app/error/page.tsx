import Link from 'next/link'

export default async function ErrorPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams?.message || 'Sorry, something went wrong.'

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-neutral-400 mb-8">{message}</p>
        
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </main>
  )
}
