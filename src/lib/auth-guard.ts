import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

/**
 * Asserts that the current request has a valid authenticated session.
 * Throws an explicit error if unauthorized.
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('UNAUTHORIZED: Valid session required to perform this action.')
  }
  
  return user
}

/**
 * Asserts that the current request has a valid authenticated session
 * and the user holds one of the specified roles in their app_metadata.
 */
export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth()
  const role = user.app_metadata?.role

  if (!allowedRoles.includes(role)) {
    throw new Error(`FORBIDDEN: Required role [${allowedRoles.join(' | ')}] not found on caller.`)
  }

  return user
}
