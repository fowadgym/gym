'use client';
import { useState } from 'react';
import { pricing } from '../../data/pricing';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';

const generateWhatsAppUrl = (phone: string, planName: string) => {
  const message = encodeURIComponent(`مرحبًا، أود الاشتراك في باقة ${planName}.`);
  return `https://wa.me/${phone}?text=${message}`;
};

const PHONE_NUMBER = "1234567890";

export function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-6 tracking-tight">
            باقات <span className="text-amber-500">العضوية</span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-wider text-white">
            <span className={!isAnnual ? 'text-amber-500' : 'text-zinc-500'}>شهري</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-zinc-800 rounded-full flex items-center px-1 transition-colors hover:bg-zinc-700"
              aria-pressed={isAnnual}
              aria-label="Toggle annual billing"
            >
              <div 
                className={`w-5 h-5 bg-amber-500 rounded-full transition-transform duration-300 ${isAnnual ? '-translate-x-7' : 'translate-x-0'}`} 
              />
            </button>
            <span className={isAnnual ? 'text-amber-500' : 'text-zinc-500'}>
              سنوي <span className="mr-1 text-xs px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full">وفر 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricing.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative flex flex-col p-8 rounded-2xl bg-neutral-900 border ${tier.isFeatured ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-neutral-800'}`}
            >
              {tier.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  الأكثر شهرة
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-500">
                    ${isAnnual ? tier.priceAnnual : tier.priceMonthly}
                  </span>
                  <span className="text-zinc-400 font-medium">
                    /{isAnnual ? 'سنة' : 'شهر'}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-4 mb-8 grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <Check className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                href={generateWhatsAppUrl(PHONE_NUMBER, tier.name)}
                target="_blank"
                rel="noopener noreferrer"
                variant={tier.isFeatured ? 'primary' : 'outline'}
                className="w-full"
              >
                اختر {tier.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
