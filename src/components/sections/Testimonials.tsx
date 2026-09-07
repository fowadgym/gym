import Image from 'next/image';
import { testimonials } from '../../data/testimonials';
import { BadgeCheck, Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-20 bg-neutral-900 border-y border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tight">
            نتائج <span className="text-amber-500">حقيقية</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            الانضباط يؤدي إلى نتائج لا يمكن إنكارها. شاهد تحولات أولئك الذين التزموا بالعملية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div key={test.id} className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl flex flex-col">
              <div className="flex gap-2 mb-6">
                <div className="relative w-1/2 aspect-square rounded-lg overflow-hidden border border-neutral-800">
                  <Image src={test.beforeImage} alt={`${test.name} Before`} fill className="object-cover grayscale" sizes="(max-width: 768px) 50vw, 15vw" />
                  <div className="absolute top-2 start-2 bg-neutral-950/80 text-white text-[10px] uppercase px-2 py-0.5 rounded font-bold tracking-wider">قبل</div>
                </div>
                <div className="relative w-1/2 aspect-square rounded-lg overflow-hidden border border-amber-500/50">
                  <Image src={test.afterImage} alt={`${test.name} After`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 15vw" />
                  <div className="absolute top-2 start-2 bg-amber-500 text-neutral-950 text-[10px] uppercase px-2 py-0.5 rounded font-bold tracking-wider">بعد</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-amber-500 font-black text-xl mb-2">{test.result}</div>
                <div className="relative">
                  <Quote className="absolute -top-1 -start-1 text-neutral-800 rotate-180" size={24} />
                  <p className="text-zinc-300 italic z-10 relative ps-6">"{test.quote}"</p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center gap-2">
                <h4 className="text-white font-bold">{test.name}</h4>
                {test.verified && <BadgeCheck className="text-blue-500" size={18} aria-label="Verified Client" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
