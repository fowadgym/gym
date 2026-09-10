'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignSubscription(formData: FormData) {
  const supabase = await createClient()

  const athleteId = formData.get('athleteId') as string
  const tier = formData.get('tier') as 'basic' | 'pro' | 'vip'
  const endDate = formData.get('endDate') as string

  if (!athleteId || !tier || !endDate) {
    return { error: 'جميع الحقول مطلوبة.' }
  }

  try {
    // Check for an active subscription
    const { data: activeSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('is_active', true)
      .single()

    if (activeSub) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          end_date: endDate,
          tier: tier
        })
        .eq('id', activeSub.id)

      if (updateError) throw updateError
    } else {
      // Insert new subscription
      const startDate = new Date().toISOString()
      
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          athlete_id: athleteId,
          tier,
          start_date: startDate,
          end_date: endDate,
          is_active: true
        })

      if (insertError) throw insertError
    }

    revalidatePath(`/admin/athletes/${athleteId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Subscription error:', err)
    return { error: 'حدث خطأ أثناء حفظ الاشتراك.' }
  }
}
