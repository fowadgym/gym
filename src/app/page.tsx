import { HeroSection } from '@/components/sections/HeroSection';
import { FacilityGallery } from '@/components/sections/FacilityGallery';
import { TrainerGrid } from '@/components/sections/TrainerGrid';
import { GymFeatures } from '@/components/sections/GymFeatures';
import { MethodologySection } from '@/components/sections/MethodologySection';
import { ContactLocation } from '@/components/sections/ContactLocation';

export const metadata = {
  title: 'فؤاد جيم | Fouad Gym',
  description: 'صالة تدريب نخبوي، معدات عالمية المستوى، كادر تدريبي محترف، ومجتمع رياضي محفز.',
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <HeroSection />
      <FacilityGallery />
      <TrainerGrid />
      <GymFeatures />
      <MethodologySection />
      <ContactLocation />
    </main>
  );
}
