'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, CloudUpload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UploadVideoForm() {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('')
  const [equipment, setEquipment] = useState('')
  const [difficulty, setDifficulty] = useState('مبتدئ')
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const form = e.currentTarget
    const fileInput = form.elements.namedItem('video') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (!file || !title) return

    if (file.size > 52428800) {
      alert('خطأ: يجب أن يكون حجم الملف أقل من 50 ميجابايت.')
      return
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      alert('خطأ: نوع الملف غير صالح. يُسمح فقط بمقاطع فيديو MP4 و WebM و QuickTime.')
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
          targeted_muscles: muscleGroup ? [muscleGroup] : null,
          equipment: equipment || null,
          difficulty: difficulty || null,
        })

      if (dbError) throw dbError

      alert('تمت إضافة التمرين بنجاح!')
      form.reset()
      setTitle('')
      setDescription('')
      setMuscleGroup('')
      setEquipment('')
      setDifficulty('مبتدئ')
      router.refresh() // Refresh RSC to show new exercise

    } catch (error: any) {
      alert(`خطأ: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-white">إنشاء / تعديل تمرين</h2>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 font-mono text-[10px] font-extrabold tracking-wider">
            مسودة نشطة
          </span>
        </div>
        <button type="button" className="text-neutral-500 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Video Upload Dropzone */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">عرض فيديو الحركة</label>
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
              <span className="text-xs font-semibold text-white">اسحب الفيديو هنا أو <span className="text-amber-500 underline">تصفح الملفات</span></span>
              <span className="text-[11px] text-neutral-500">حتى 50 ميجابايت MP4, WebM</span>
            </div>
          </div>
        </div>

        {/* Exercise Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">اسم التمرين</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" 
            placeholder="مثال: تمرين الرفعة المميتة بالبار"
          />
        </div>

        {/* Target Muscle Groups & Equipment */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">المجموعة العضلية</label>
            <div className="relative">
              <select 
                value={muscleGroup} 
                onChange={e => setMuscleGroup(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none"
              >
                <option value="">اختر المجموعة...</option>
                <option value="أوتار الركبة / المؤخرة">أوتار الركبة / المؤخرة</option>
                <option value="الصدر">الصدر</option>
                <option value="الظهر / المجنص">الظهر / المجنص</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">المعدات</label>
            <div className="relative">
              <select 
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none"
              >
                <option value="">اختر المعدات...</option>
                <option value="بار أولمبي">بار أولمبي</option>
                <option value="دمبلز">دمبلز</option>
                <option value="جهاز الكابل">جهاز الكابل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">مستوى الصعوبة</label>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
            {['مبتدئ', 'متوسط', 'متقدم', 'نخبة'].map(level => (
              <button 
                key={level}
                type="button" 
                onClick={() => setDifficulty(level)}
                className={`py-1.5 rounded-md text-xs font-semibold transition-colors ${difficulty === level ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Description / Cues */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">ملاحظات تدريبية</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all min-h-[100px] resize-y" 
            placeholder="أدخل الملاحظات والتوجيهات..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-2 mt-auto">
          <button type="button" className="px-4 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-white text-sm font-semibold transition-all">إلغاء</button>
          <button 
            type="submit" 
            disabled={uploading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-neutral-950 text-sm font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? 'جاري الرفع...' : 'حفظ التمرين'}
          </button>
        </div>
      </form>
    </div>
  )
}
