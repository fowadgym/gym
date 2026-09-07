import Image from 'next/image';
import { accreditations } from '../../data/accreditations';

export function Accreditations() {
  return (
    <section className="py-12 bg-neutral-950 border-y border-neutral-800">
      <div className="container mx-auto px-6">
        <h2 className="sr-only">اعتماداتنا وشهاداتنا</h2>
        
        {/* Horizontal Snap Scroll Container */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4">
          {accreditations.map((acc) => (
            <div 
              key={acc.id}
              className="snap-center shrink-0 w-72 bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4 hover:border-neutral-700 transition-colors"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-neutral-700">
                <Image
                  src={acc.badgeUrl}
                  alt={acc.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
                  {acc.year}
                </span>
                <h3 className="text-white font-semibold text-sm leading-tight mb-1">
                  {acc.title}
                </h3>
                <span className="text-zinc-400 text-xs">
                  {acc.issuingOrganization}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
