import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dosfttltvxhwqvbnqzdn.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_TF7-mKZ9CUihKhIp2d8xTQ_kKQGeFON'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }

    const role = user.app_metadata?.role

    if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'coach') {
      const portalUrl = request.nextUrl.clone()
      portalUrl.pathname = '/portal/dashboard'
      return NextResponse.redirect(portalUrl)
    }

    if (pathname.startsWith('/portal') && role !== 'athlete') {
      // If an admin tries to access the athlete portal, we might allow it or redirect them.
      // Standard RBAC usually keeps them separate. Let's redirect admins to /admin.
      if (role === 'admin' || role === 'coach') {
        const adminUrl = request.nextUrl.clone()
        adminUrl.pathname = '/admin/dashboard'
        return NextResponse.redirect(adminUrl)
      }
      
      const errorUrl = request.nextUrl.clone()
      errorUrl.pathname = '/error'
      errorUrl.searchParams.set('message', 'Unauthorized role access.')
      return NextResponse.redirect(errorUrl)
    }
  }

  return supabaseResponse
}
