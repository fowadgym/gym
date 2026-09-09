'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, CloudUpload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UploadVideoForm() {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const form = e.currentTarget
    const fileInput = form.elements.namedItem('video') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (!file || !title) return

    if (file.size > 52428800) {
      alert('Error: File size must be less than 50MB.')
      return
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      alert('Error: Invalid file type. Only MP4, WebM, and QuickTime videos are allowed.')
      return
    }

    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `videos/${fileName}`

      // Upload to Supabase Storage with caching
      const { error: uploadError } = await supabase.storage
        .from('exercise-videos')
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('exercise-videos')
        .getPublicUrl(filePath)

      // Insert record into exercises table
      const { error: dbError } = await supabase
        .from('exercises')
        .insert({
          title,
          description,
          video_url: publicUrl,
        })

      if (dbError) throw dbError

      alert('Exercise added successfully!')
      form.reset()
      setTitle('')
      setDescription('')
      router.refresh() // Refresh RSC to show new exercise

    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-white">Create / Edit Exercise</h2>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 font-mono text-[10px] font-extrabold tracking-wider">
            ACTIVE DRAFT
          </span>
        </div>
        <button className="text-neutral-500 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Video Upload Dropzone */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Movement Video Demo (4K HDR)</label>
          <div className="relative border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-4 bg-neutral-950 flex flex-col items-center justify-center text-center gap-2 transition-colors group overflow-hidden">
            <input 
              type="file" 
              name="video"
              accept="video/mp4,video/webm"
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div className="flex flex-col relative z-0">
              <span className="text-xs font-semibold text-white">Drop 4K Master Video or <span className="text-amber-500 underline">Browse Files</span></span>
              <span className="text-[11px] text-neutral-500">ProRes 422, MP4, WebM up to 50MB</span>
            </div>
          </div>
        </div>

        {/* Exercise Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Exercise Title</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" 
            placeholder="e.g. Barbell Romanian Deadlift"
          />
        </div>

        {/* Target Muscle Groups & Equipment (Mock inputs for UI) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Muscle Group</label>
            <div className="relative">
              <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none">
                <option>Select Group...</option>
                <option>Hamstrings / Glutes</option>
                <option>Chest / Pectorals</option>
                <option>Back / Lats</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Equipment</label>
            <div className="relative">
              <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none">
                <option>Select Rig...</option>
                <option>Olympic Barbell</option>
                <option>Dumbbells</option>
                <option>Cable Machine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Difficulty Rating</label>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
            <button type="button" className="py-1.5 rounded-md text-xs font-semibold text-neutral-400 hover:text-white transition-colors">Beg</button>
            <button type="button" className="py-1.5 rounded-md bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-colors">Int</button>
            <button type="button" className="py-1.5 rounded-md text-xs font-semibold text-neutral-400 hover:text-white transition-colors">Adv</button>
            <button type="button" className="py-1.5 rounded-md text-xs font-semibold text-neutral-400 hover:text-white transition-colors">Elite</button>
          </div>
        </div>

        {/* Description / Cues */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Coaching Cues</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all min-h-[100px] resize-y" 
            placeholder="Enter movement cues and notes..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-2 mt-auto">
          <button type="button" className="px-4 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-white text-sm font-semibold transition-all">Cancel</button>
          <button 
            type="submit" 
            disabled={uploading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-neutral-950 text-sm font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? 'Uploading...' : 'Save Exercise'}
          </button>
        </div>
      </form>
    </div>
  )
}
