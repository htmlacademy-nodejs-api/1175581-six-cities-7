import { Host } from './host.type.js';

export type Offer = {
  id: string;
  title: string;
  date: string;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: Host;
  commentsCount: number;
  latitude: number;
  longitude: number;
}

