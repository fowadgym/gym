'use client';

import {
  Award,
  Dumbbell,
  Maximize2,
  HeartHandshake,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    id: 'coaches',
    number: '01',
    title: 'نخبة من المدربين المحترفين',
    subtitle: 'إشراف فني معتمد وتوجيه نخبوي',
    description: 'كادر تدريبي ذو كفاءة استثنائية وخبرات دولية معتمدة، يضع بين يديك المعرفة العلمية والتطبيق العملي لضمان أدائك للتمارين بأعلى دقة، مع متابعة دورية مستمرة تمنع الإصابات وتسرّع وصولك لأهدافك.',
    icon: Award,
    highlights: [
      'مدربون معتمدون بخبرات تنافسية عريقة',
      'تصحيح فوري للتكنيك الحركي والميكانيكي لكل تمرين',
      'متابعة دورية لتطور الأوزان، القياسات، ومعدلات الأداء'
    ],
    badge: 'كفاءة تدريبية دولية'
  },
  {
    id: 'equipment',
    number: '02',
    title: 'قاعة مجهزة بأحدث الأجهزة العالمية',
    subtitle: 'تقنيات بايو-ميكانيكية متطورة',
    description: 'تجهيزات ومعدات رياضية من أرقى الماركات العالمية المختارة بعناية لتوفير أعلى درجات العزل العضلي، الحركة الانسيابية، والأمان التام، لتمنحك أقصى استفادة حقيقية من كل تكرار وجلسة تدريبية.',
    icon: Dumbbell,
    highlights: [
      'أجهزة عزل وقوة بايو-ميكانيكية حديثة تحاكي مسار الحركة الطبيعي',
      'منطقة أوزان حرة (Dumbbells & Barbells) شاملة لكافة الأوزان',
      'محطات كابلات، راكات قرفصاء، ومعدات كارديو ذكية متقدمة'
    ],
    badge: 'معدات عالمية 100%'
  },
  {
    id: 'space',
    number: '03',
    title: 'صالة واسعة ومساحات تدريب متنوعة',
    subtitle: 'حرية حركة كاملة وخصوصية عالية',
    description: 'تصميم هندسي متسع ومقسم بذكاء لمنحك أريحية مطلقة وحرية في الحركة دون أدنى شعور بالازدحام، مع تقسيم تخصصي يغطي كافة جوانب التدريب: رفع الأثقال، اللياقة البدنية، والإحماء والاستشفاء.',
    icon: Maximize2,
    highlights: [
      'مساحة شاسعة وتوزيع منظم يمنع التكدس حتى في أوقات الذروة',
      'نظام تهوية يضمن هواءً نقياً متجدداً باستمرار',
      'مناطق مخصصة للإحماء الحركي، التمدد، والتمارين الوظيفية'
    ],
    badge: 'مساحات فسيحة ومريحة'
  },
  {
    id: 'community',
    number: '04',
    title: 'مجتمع تحفيزي وبيئة متعاونة',
    subtitle: 'أجواء عائلية تدفعك للأمام دائماً',
    description: 'لن تتمرن وحدك؛ انضم إلى مجتمع رياضي إيجابي يجمع الرياضيين المحترفين والمبتدئين بروح الأخوة والتشجيع المتبادل، حيث يسود الاحترام والإلهام الذي يبدد الكسل ويشعل حماسك في كل زيارة.',
    icon: HeartHandshake,
    highlights: [
      'طاقة إيجابية وأجواء حماسية تزيد من التزامك واستمراريتك',
      'ثقافة قائمة على الاحترام، الدعم الأخوي، وتبادل الخبرات',
      'بيئة ترحب بجميع المستويات الرياضية وتساعدك على التطور بثقة'
    ],
    badge: 'بيئة حماسية داعمة'
  }
];

export function GymFeatures() {
  return (
    <section id="features" className="relative py-24 bg-neutral-950 overflow-hidden border-t border-neutral-900">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm font-bold mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>مميزات فؤاد جيم</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-tight mb-6">
            بيئة تدريبية مصممة <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              لصناعة الأبطال
            </span>
          </h2>

          <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            نجمع بين التجهيزات العالمية، الإشراف النخبوي، والمجتمع الداعم لنوفر لك تجربة لياقة بدنية متكاملة ترتقي بمستواك وتمنحك أفضل النتائج.
          </p>
        </div>

        {/* Features 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative flex flex-col p-8 md:p-10 rounded-3xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 overflow-hidden text-right"
              >
                {/* Top Corner Subtle Accent Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent rounded-tr-3xl pointer-events-none group-hover:from-amber-500/20 transition-all duration-300" />

                {/* Card Top: Icon + Number / Badge */}
                <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300">
                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full bg-neutral-800/80 text-neutral-300 border border-neutral-700/60">
                      {feature.badge}
                    </span>
                    <span className="text-3xl font-black text-neutral-700 group-hover:text-amber-500/40 transition-colors duration-300">
                      {feature.number}
                    </span>
                  </div>
                </div>

                {/* Titles */}
                <div className="mb-4 relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-400 transition-colors duration-300 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-amber-500/90 text-sm font-medium">
                    {feature.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 relative z-10">
                  {feature.description}
                </p>

                {/* Highlights List */}
                <div className="mt-auto pt-6 border-t border-neutral-800/70 relative z-10 space-y-3">
                  {feature.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-xs md:text-sm font-medium leading-normal">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
