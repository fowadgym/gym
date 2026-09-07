export interface Accreditation {
  id: string;
  badgeUrl: string;
  title: string;
  issuingOrganization: string;
  year: number;
}

export interface Trainer {
  id: string;
  name: string;
  image: string;
  certified: boolean;
  specializations: string[];
  bio: string;
}

export interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  isFeatured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  result: string;
  quote: string;
  verified: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}
