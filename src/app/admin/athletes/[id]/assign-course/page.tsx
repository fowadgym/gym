import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CourseBuilder from './course-builder'

export const metadata = {
  title: 'تعيين كورس تدريبي | إدارة أيرون كور',
}

export default async function AssignCoursePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: athlete } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: false })

  if (!athlete) return <div className="text-center p-10 text-white">لم يتم العثور على الرياضي</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-neutral-800/50 pb-6">
        <Link href={`/admin/athletes/${athlete.id}`} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">بناء كورس تدريبي</h2>
          <p className="text-neutral-400 text-sm mt-1">للرياضي: <span className="text-amber-500 font-bold">{athlete.full_name}</span></p>
        </div>
      </div>

      <CourseBuilder athleteId={athlete.id} exercises={exercises || []} />
    </div>
  )
}
