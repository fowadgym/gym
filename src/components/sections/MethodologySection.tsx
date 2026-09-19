'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [isLocked, setIsLocked] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isTransitioning = useRef(false)
  const touchStartY = useRef(0)
  const accumulatedDelta = useRef(0)

  const SCROLL_THRESHOLD = 80 // how much scroll/swipe needed to trigger next card

  const goToStep = useCallback((newStep: number) => {
    if (isTransitioning.current) return
    if (newStep < 0 || newStep >= STEPS.length) return
    
    isTransitioning.current = true
    setActiveStep(newStep)
    accumulatedDelta.current = 0
    
    // Prevent rapid switching
    setTimeout(() => {
      isTransitioning.current = false
    }, 800)
  }, [])

  const unlockAndScroll = useCallback((direction: 'up' | 'down') => {
    setIsLocked(false)
    accumulatedDelta.current = 0
    
    // Give the browser a frame to unlock scroll, then nudge it
    requestAnimationFrame(() => {
      window.scrollBy({ top: direction === 'down' ? 100 : -100, behavior: 'smooth' })
    })
  }, [])

  // Detect when section enters viewport
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Section is in view, lock scrolling
            setIsLocked(true)
            accumulatedDelta.current = 0
          }
        })
      },
      { threshold: [0.3] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Handle wheel events (desktop)
  useEffect(() => {
    if (!isLocked) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isTransitioning.current) return

      accumulatedDelta.current += e.deltaY

      if (accumulatedDelta.current > SCROLL_THRESHOLD) {
        // Scrolling down
        if (activeStep < STEPS.length - 1) {
          goToStep(activeStep + 1)
        } else {
          // Last card, release scroll
          unlockAndScroll('down')
        }
      } else if (accumulatedDelta.current < -SCROLL_THRESHOLD) {
        // Scrolling up
        if (activeStep > 0) {
          goToStep(activeStep - 1)
        } else {
          // First card, release scroll
          unlockAndScroll('up')
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isLocked, activeStep, goToStep, unlockAndScroll])

  // Handle touch events (mobile)
  useEffect(() => {
    if (!isLocked) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      accumulatedDelta.current = 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      
      if (isTransitioning.current) return

      const touchY = e.touches[0].clientY
      const diff = touchStartY.current - touchY // positive = swipe up (scroll down)

      accumulatedDelta.current = diff

      if (diff > SCROLL_THRESHOLD) {
        // Swiping up (scroll down)
        if (activeStep < STEPS.length - 1) {
          goToStep(activeStep + 1)
          touchStartY.current = touchY // reset
        } else {
          unlockAndScroll('down')
        }
      } else if (diff < -SCROLL_THRESHOLD) {
        // Swiping down (scroll up)
        if (activeStep > 0) {
          goToStep(activeStep - 1)
          touchStartY.current = touchY // reset
        } else {
          unlockAndScroll('up')
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isLocked, activeStep, goToStep, unlockAndScroll])

  // Lock/unlock body scroll
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isLocked])

  return (
    <section 
      ref={sectionRef}
      className="bg-neutral-950 relative w-full border-t border-neutral-900"
    >
      {/* Full screen container */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 lg:px-8 py-16 lg:py-24">
        
        {/* Title Area */}
        <div className="w-full text-center mb-8 lg:mb-12 z-20">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2 lg:mb-4">
            منهجية <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">فؤاد جيم</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto font-medium text-sm md:text-lg">
            نحن لا نقدم مجرد اشتراك نادي، بل نقدم تجربة تدريب متكاملة مدعومة بأحدث التقنيات لضمان وصولك لهدفك.
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            
            return (
              <div 
                key={step.id} 
                className={`absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-16 transition-all duration-700 ease-in-out
                  ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}
                `}
              >
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
                  <div className="relative w-full max-w-md aspect-[2/1] sm:aspect-video lg:aspect-[4/5] rounded-2xl lg:rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl group">
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

        {/* Step Indicators */}
        <div className="flex gap-2 mt-8 z-20">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === activeStep ? 'w-8 bg-amber-500' : 'w-3 bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
