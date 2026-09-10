'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?message=' + encodeURIComponent('الرجاء إدخال البريد الإلكتروني وكلمة المرور'))
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // We use a generic message for security, or we could translate specific Supabase errors
    redirect('/login?message=' + encodeURIComponent('البريد الإلكتروني أو كلمة المرور غير صحيحة'))
  }

  revalidatePath('/', 'layout')

  const role = data.user?.app_metadata?.role

  if (role === 'admin') {
    redirect('/admin/dashboard')
  } else if (role === 'coach') {
    redirect('/coach/dashboard')
  } else if (role === 'athlete') {
    redirect('/portal/dashboard')
  }

  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    redirect('/login?message=' + encodeURIComponent('الرجاء إدخال البريد الإلكتروني لإرسال رابط إعادة التعيين'))
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    redirect('/login?message=' + encodeURIComponent('حدث خطأ أثناء محاولة إرسال رابط إعادة التعيين'))
  }

  redirect('/login?message=' + encodeURIComponent('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'))
}
