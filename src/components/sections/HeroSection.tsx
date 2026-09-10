import Image from 'next/image';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.webp"
          alt="Gym facility background"
          fill
          priority
          className="object-cover"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6">
          فؤاد <span className="text-amber-500">جيم</span>
        </h1>

        <p className="text-lg md:text-2xl text-zinc-300 font-medium mb-10 max-w-2xl leading-relaxed">
          تدريب نخبوي، معدات عالمية المستوى، ومجتمع مبني على الانضباط. تحولك يبدأ من هنا.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button href="/login" variant="outline" className="w-full sm:w-auto">
            تسجيل الدخول
          </Button>
        </div>
      </div>
    </section>
  );
}
