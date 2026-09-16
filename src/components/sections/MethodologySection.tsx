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
  const containerRef = useRef<HTMLDivElement>(null)
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
        rootMargin: '-40% 0px -40% 0px', // Trigger when step is in the middle of screen
        threshold: 0
      }
    )

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-neutral-950 relative w-full border-t border-neutral-900" ref={containerRef}>
      {/* Title Area (Sticks to top on mobile, absolute on desktop) */}
      <div className="w-full text-center pt-24 pb-12 lg:pb-0 z-20 relative lg:absolute lg:top-0 lg:pt-32 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          منهجية <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">إيليت</span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto px-4 font-medium text-lg">
          نحن لا نقدم مجرد اشتراك نادي، بل نقدم تجربة تدريب متكاملة مدعومة بأحدث التقنيات لضمان وصولك لهدفك.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row w-full relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Sticky Media Container (Left side on LTR, Right side on RTL - wait, dir="rtl" so this is visually Right) */}
        <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-center justify-center py-12 lg:py-0 z-10 order-1 lg:order-2">
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] max-w-lg rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl transition-all duration-700 ease-in-out group">
            
            {/* Background Gradient based on active step */}
            <div className={`absolute inset-0 bg-gradient-to-br ${STEPS[activeStep].color} opacity-50 transition-colors duration-1000`} />
            
            {/* Images */}
            {STEPS.map((step, index) => (
              <img
                key={step.id}
                src={step.mockupUrl}
                alt={step.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                  ${index === activeStep ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-105 blur-sm'}
                `}
              />
            ))}

            {/* Overlay gradient for aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
            
            {/* Floating indicator */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-800/50 flex items-center">
                <span className="text-amber-500 font-black text-2xl leading-none">0{activeStep + 1}</span>
                <span className="text-neutral-400 ml-2 font-medium">/ 03</span>
              </div>
              
              <div className="bg-amber-500 text-black p-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
                {
                  activeStep === 0 ? <ClipboardList className="w-6 h-6" /> :
                  activeStep === 1 ? <LayoutDashboard className="w-6 h-6" /> :
                  <Smartphone className="w-6 h-6" />
                }
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling Text Content (Visually Left in RTL) */}
        <div className="lg:w-1/2 flex flex-col z-10 pb-24 lg:pb-0 order-2 lg:order-1">
          {/* Spacer to push first step down on desktop to account for absolute title */}
          <div className="hidden lg:block h-[30vh]" />
          
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            
            return (
              <div 
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className={`flex flex-col justify-center min-h-[60vh] lg:min-h-screen py-12 lg:py-0 transition-all duration-700
                  ${isActive ? 'opacity-100' : 'opacity-30 lg:opacity-20'}
                `}
              >
                <div className="max-w-md mx-auto lg:mx-0 pr-4 lg:pr-12">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500
                    ${isActive ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-110' : 'bg-neutral-900 border border-neutral-800 text-neutral-500'}
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className={`text-3xl lg:text-4xl font-black mb-4 transition-colors duration-500
                    ${isActive ? 'text-white' : 'text-neutral-500'}
                  `}>
                    {step.title}
                  </h3>
                  
                  <p className={`text-lg leading-relaxed transition-colors duration-500
                    ${isActive ? 'text-neutral-300' : 'text-neutral-600'}
                  `}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
          
          {/* Bottom spacer so the last item can reach the middle of the screen */}
          <div className="hidden lg:block h-[40vh]" />
        </div>

      </div>
    </section>
  )
}
