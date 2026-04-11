export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  description?: string | null;
  days: number;
  price: number;
  region: string;
  difficulty: string;
  type?: string | null;
  featured?: boolean;
  maxGroupSize?: number;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  images?: { url: string; alt?: string | null; order?: number }[];
}

export interface Rental {
  id: string;
  name: string;
  type?: string;
  description: string;
  pricePerDay: number;
  available?: boolean;
  specs?: unknown;
  imageUrl?: string | null;
  images?: string[];
}
