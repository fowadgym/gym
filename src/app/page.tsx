import { HeroSection } from '@/components/sections/HeroSection';
import { FacilityGallery } from '@/components/sections/FacilityGallery';
import { TrainerGrid } from '@/components/sections/TrainerGrid';
import { PricingTable } from '@/components/sections/PricingTable';
import { MethodologySection } from '@/components/sections/MethodologySection';
import { ContactLocation } from '@/components/sections/ContactLocation';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata = {
  title: 'Elite Gym | Forge Your Legacy',
  description: 'High-performance training facility with elite coaching and world-class equipment.',
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <HeroSection />
      <FacilityGallery />
      <TrainerGrid />
      <PricingTable />
      <MethodologySection />
      <ContactLocation />
      <FloatingWhatsApp />
    </main>
  );
}
