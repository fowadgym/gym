import { createClient } from '@/lib/supabase/server'
import { UploadVideoForm } from './upload-form'
import { PlayCircle } from 'lucide-react'

export const metadata = {
  title: 'Exercises | Elite Admin',
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
        <h1 className="text-3xl font-bold text-white">Exercise Catalog</h1>
        
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
                {ex.description && <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{ex.description}</p>}
              </div>
            </div>
          ))}

          {(!exercises || exercises.length === 0) && (
            <div className="col-span-full p-8 text-center text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
              No exercises added yet. Use the form to upload one.
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
