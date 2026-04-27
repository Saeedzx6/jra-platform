export type Role = 'ADMIN' | 'MEMBER' | 'PUBLIC';
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';
export type MemberCategory =
  | 'FINE_DINING'
  | 'CASUAL_DINING'
  | 'FAST_FOOD'
  | 'CAFE'
  | 'BAKERY'
  | 'CATERING'
  | 'NIGHTLIFE'
  | 'OTHER';

export interface MemberProfile {
  id: string;
  userId: string;
  businessName: string;
  category: MemberCategory;
  stars: number;
  location: string;
  phone?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  bio?: string | null;
  status: MemberStatus;
  createdAt: string;
  user?: { name: string; email: string };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profile?: MemberProfile | null;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface Training {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  price: string;
  seats: number;
  imageUrl?: string | null;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string;
  coverUrl?: string | null;
  published: boolean;
  createdAt: string;
  author?: { name: string };
}

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  photoUrl?: string | null;
  order: number;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
