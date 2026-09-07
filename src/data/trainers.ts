import { Trainer } from '../types';

export const trainers: Trainer[] = [
  {
    id: 't1',
    name: 'ماركوس ثورن',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    certified: true,
    specializations: ['رفع الأثقال', 'القوة والتحمل'],
    bio: 'رافع أثقال تنافسي سابق يركز على بناء القوة الخام والميكانيكا المثالية.',
  },
  {
    id: 't2',
    name: 'سارة تشين',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    certified: true,
    specializations: ['الكينماتيكا', 'المرونة'],
    bio: 'متخصصة في أنماط الحركة، والوقاية من الإصابات، واللياقة الرياضية طويلة الأمد.',
  },
  {
    id: 't3',
    name: 'ديفيد روسي',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    certified: true,
    specializations: ['التغذية', 'تضخيم العضلات'],
    bio: 'يجمع بين التغذية القائمة على الأدلة وتقنيات كمال الأجسام عالية الكثافة.',
  }
];
