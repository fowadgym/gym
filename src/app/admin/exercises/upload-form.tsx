'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload } from 'lucide-react'
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
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Add New Exercise</h2>
      
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Exercise Title</label>
        <input 
          type="text" 
          required 
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-amber-500 outline-none min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Video File</label>
        <input 
          type="file" 
          name="video"
          accept="video/mp4,video/webm"
          required
          className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
        />
      </div>

      <button 
        type="submit" 
        disabled={uploading}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-500 text-black font-semibold py-3 px-4 rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Upload className="h-5 w-5" />
        {uploading ? 'Uploading...' : 'Upload & Save Exercise'}
      </button>
    </form>
  )
}
