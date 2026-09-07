'use client';
import { useState } from 'react';
import Image from 'next/image';
import { gallery } from '../../data/gallery';
import { LightboxModal } from '../ui/LightboxModal';
import { GalleryImage } from '../../types';

export function FacilityGallery() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveImageIndex(index);
  const closeLightbox = () => setActiveImageIndex(null);
  const navigateLightbox = (newIndex: number) => setActiveImageIndex(newIndex);

  return (
    <section className="py-20 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tight">
            منشأة <span className="text-amber-500">نخبوية</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            اختبر مناطق التدريب الحديثة لدينا، والمعدات المصممة بدقة، والبيئات المركزة المصممة لتحقيق أقصى أداء.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {gallery.map((img, index) => (
            <button 
              key={img.id}
              onClick={() => openLightbox(index)}
              className="group relative w-full aspect-square rounded-xl overflow-hidden cursor-zoom-in bg-neutral-900 border border-neutral-800"
              aria-label={`View larger image of ${img.alt}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/20 transition-colors duration-300"></div>
            </button>
          ))}
        </div>
      </div>

      <LightboxModal 
        images={gallery}
        currentIndex={activeImageIndex ?? 0}
        isOpen={activeImageIndex !== null}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </section>
  );
}
