import { createClient } from '@/lib/supabase/server'
import { UploadVideoForm } from './upload-form'
import { PlayCircle } from 'lucide-react'

export const metadata = {
  title: 'التمارين | إدارة أيرون كور',
}

export default async function ExercisesPage() {
  const supabase = await createClient()

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-white">كتالوج التمارين</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exercises?.map((ex) => (
            <div key={ex.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
              <div className="aspect-video bg-neutral-950 relative flex items-center justify-center border-b border-neutral-800">
                {ex.video_url ? (
                  <video src={ex.video_url} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" preload="metadata" />
                ) : (
                  <PlayCircle className="h-10 w-10 text-neutral-700" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">{ex.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ex.difficulty && (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-bold text-amber-500 border border-amber-500/20">{ex.difficulty}</span>
                  )}
                  {ex.equipment && (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-bold text-neutral-300 border border-neutral-700">{ex.equipment}</span>
                  )}
                  {ex.targeted_muscles?.map((muscle: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-bold text-neutral-300 border border-neutral-700">{muscle}</span>
                  ))}
                </div>
                {ex.description && <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{ex.description}</p>}
              </div>
            </div>
          ))}

          {(!exercises || exercises.length === 0) && (
            <div className="col-span-full p-8 text-center text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
              لم تتم إضافة أي تمارين بعد. استخدم النموذج لرفع تمرين جديد.
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <UploadVideoForm />
      </div>
    </div>
  )
}
