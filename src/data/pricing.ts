import { PricingTier } from '../types';

export const pricing: PricingTier[] = [
  {
    id: 'p1',
    name: 'الأساسية',
    priceMonthly: 39,
    priceAnnual: 390,
    features: ['الوصول إلى صالة الألعاب', 'خزانة قياسية', 'واي فاي مجاني'],
    isFeatured: false,
  },
  {
    id: 'p2',
    name: 'الاحترافية',
    priceMonthly: 69,
    priceAnnual: 690,
    features: ['جميع ميزات الباقة الأساسية', 'الدخول إلى الساونا والسبا', 'تقييم لياقة مجاني', 'فصول جماعية'],
    isFeatured: true,
  },
  {
    id: 'p3',
    name: 'VIP',
    priceMonthly: 149,
    priceAnnual: 1490,
    features: ['جميع ميزات الباقة الاحترافية', 'مدرب شخصي (4 مرات/شهر)', 'تدريب تغذية مخصص', 'صالة كبار الشخصيات'],
    isFeatured: false,
  }
];
