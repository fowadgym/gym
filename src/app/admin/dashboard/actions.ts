'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function inviteAthlete(formData: FormData) {
  const email = formData.get('email') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  if (!email || !fullName || !phone) {
    return { error: 'جميع الحقول مطلوبة.' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dosfttltvxhwqvbnqzdn.supabase.co'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    return { error: 'يرجى تكوين SUPABASE_SERVICE_ROLE_KEY في إعدادات البيئة لإضافة مستخدمين.' }
  }

  // Create an admin client bypassing RLS
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Check if the user already exists (optional, but inviteUserByEmail handles this if they exist but aren't confirmed)
  // We will just send the invite
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
      phone_number: phone,
      role: 'athlete'
    }
  })

  if (error) {
    console.error('Error inviting user:', error.message)
    return { error: 'فشل إرسال الدعوة. تأكد من أن البريد الإلكتروني غير مسجل مسبقاً.' }
  }

  // The user is created in auth.users, now we need to ensure their profile is created
  // if not automatically created by triggers. Assuming you have a trigger on auth.users -> profiles.
  // If not, we can insert into profiles manually:
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: data.user.id,
      full_name: fullName,
      phone_number: phone,
      role: 'athlete',
      email: email
    })

  if (profileError) {
    console.error('Error creating profile:', profileError.message)
    // We don't fail the request completely since auth user is created
  }

  revalidatePath('/admin/dashboard')
  return { success: true }
}
