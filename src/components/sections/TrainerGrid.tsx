import Image from 'next/image';
import { trainers } from '../../data/trainers';
import { CheckCircle2 } from 'lucide-react';
import { ImageAutoSlider } from '../ui/image-auto-slider';

export function TrainerGrid() {
  return (
    <section className="py-20 bg-neutral-900 border-y border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tight">
            مدرب <span className="text-amber-500">دولي</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            تدرب مع محترف من النخبة. يتمتع بعقود من الخبرة التنافسية، والبرامج القائمة على أسس علمية، والانضباط الذي لا يلين.
          </p>
        </div>

        {/* Auto Slider Gallery of Trainers in Action */}
        <div className="w-full">
          <ImageAutoSlider />
        </div>
      </div>
    </section>
  );
}
