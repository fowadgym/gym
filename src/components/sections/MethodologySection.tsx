'use client'

import { useState, useEffect, useRef } from 'react'
import { ClipboardList, LayoutDashboard, Smartphone } from 'lucide-react'

const STEPS = [
  {
    id: 'step-1',
    title: 'التقييم الشامل',
    description: 'نبدأ رحلتك بتقييم دقيق لمستواك الحالي، أهدافك، وأي إصابات سابقة. نبني الأساس الصحيح قبل رفع أي وزن.',
    icon: ClipboardList,
    mockupUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    color: 'from-amber-500/20 to-neutral-900'
  },
  {
    id: 'step-2',
    title: 'تصميم الكورس المخصص',
    description: 'يقوم مدربونا باستخدام نظامنا البرمجي الخاص لتصميم كورس تدريبي مفصل خصيصاً لك، مع تحديد الأوزان والجلسات والتكرارات بدقة.',
    icon: LayoutDashboard,
    mockupUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    color: 'from-indigo-500/20 to-neutral-900'
  },
  {
    id: 'step-3',
    title: 'بوابة المتدرب الذكية',
    description: 'تصلك التمارين يومياً عبر بوابتك الخاصة على هاتفك. تتبع تقدمك، سجل أوزانك، وشاهد مقاطع فيديو توضيحية لكل تمرين مباشرة في الصالة.',
    icon: Smartphone,
    mockupUrl: 'https://images.unsplash.com/photo-1526506114642-54fcb51151c8?q=80&w=2067&auto=format&fit=crop',
    color: 'from-emerald-500/20 to-neutral-900'
  }
]

export function MethodologySection() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.findIndex((ref) => ref === entry.target)
            if (index !== -1) {
              setActiveStep(index)
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    )

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-neutral-950 relative w-full border-t border-neutral-900 pb-24">
      {/* Title Area */}
      <div className="w-full text-center pt-24 pb-12 z-20 relative">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          منهجية <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">فؤاد جيم</span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto px-4 font-medium text-lg">
          نحن لا نقدم مجرد اشتراك نادي، بل نقدم تجربة تدريب متكاملة مدعومة بأحدث التقنيات لضمان وصولك لهدفك.
        </p>
      </div>

      {/* The scrolling container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Sticky wrapper */}
        <div className="sticky top-24 lg:top-32 h-[85dvh] lg:h-[80vh] lg:min-h-[600px] flex items-center justify-center overflow-hidden z-10">
          
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            
            return (
              <div 
                key={step.id} 
                className={`absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-16 transition-all duration-1000 ease-in-out
                  ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}
                `}
              >
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
                  <div className="relative w-full max-w-md aspect-video md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-50 z-10`} />
                    <img
                      src={step.mockupUrl}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent z-10" />
                    
                    <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6 flex justify-between items-end z-20">
                      <div className="bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border border-neutral-800/50 flex items-center">
                        <span className="text-amber-500 font-black text-xl lg:text-2xl leading-none">0{index + 1}</span>
                        <span className="text-neutral-400 ml-2 font-medium text-sm lg:text-base">/ 03</span>
                      </div>
                      
                      <div className="bg-amber-500 text-black p-2.5 lg:p-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-right">
                  <div className="max-w-md mx-auto lg:mx-0 lg:pr-12">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center mb-4 lg:mb-6 mx-auto lg:mx-0 lg:ml-auto">
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
                    </div>
                    
                    <h3 className="text-2xl lg:text-4xl font-black mb-3 lg:mb-4 text-white">
                      {step.title}
                    </h3>
                    
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed text-neutral-300">
                      {step.description}
                    </p>
                  </div>
                </div>
                
              </div>
            )
          })}
        </div>

        {/* Invisible Scroll Triggers */}
        <div className="relative w-full z-0 pointer-events-none -mt-[85dvh] lg:-mt-[80vh]">
          {STEPS.map((step, index) => (
            <div 
              key={`trigger-${step.id}`}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className="h-[100dvh] lg:h-[100vh] w-full" 
            />
          ))}
        </div>
        
      </div>
    </section>
  )
}
