export interface SamarthyaEvent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  category: string;
  status: 'completed' | 'upcoming' | 'past' | 'live';
  featured: boolean;
  edition?: string;
  galleryFolder?: string;
  photosCount?: number;
  highlights: string[];
  image?: string;
}

export interface SamarthyaTeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  year: string;
  semester: string;
  domain: string;
  image: string;
  linkedin: string;
  github?: string;
  email?: string;
}

export interface SamarthyaFaculty {
  id: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  image: string;
  linkedin: string;
  office: string;
  qualifications: string[];
}

export interface SamarthyaGalleryItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  image: string;
  alt: string;
  caption: string;
}

export interface SamarthyaApplication {
  id: string;
  name: string;
  email: string;
  usn?: string;
  semester?: string;
  domain?: string;
  message: string;
  created_at: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'archived';
}

export interface RegisteredAdmin {
  username: string;
  password?: string;
  status?: 'pending' | 'approved' | 'rejected';
  registeredAt?: string;
  approvedAt?: string;
  role?: 'head_admin' | 'lead_admin' | 'moderator';
}

export interface SamarthyaSiteConfig {
  name: string;
  fullName: string;
  department: string;
  institution: string;
  tagline: string;
  aboutText: string;
  contactEmail: string;
  officeLocation: string;
  motto: string;
  recruitmentOpen: boolean;
}

export type CMSTab =
  | 'events'
  | 'team'
  | 'faculty'
  | 'gallery'
  | 'applications'
  | 'approvals'
  | 'settings';
