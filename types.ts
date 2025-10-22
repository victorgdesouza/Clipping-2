
export enum NewsCategory {
  GENERAL = 'Geral',
  TECHNOLOGY = 'Tecnologia',
  BUSINESS = 'Negócios',
  POLITICS = 'Política',
  SPORTS = 'Esportes',
  HEALTH = 'Saúde',
  ENVIRONMENT = 'Meio Ambiente', // Adicionada para mais variedade
  CULTURE = 'Cultura', // Adicionada para mais variedade
}

export enum Sentiment {
  POSITIVE = 'Positivo',
  NEGATIVE = 'Negativo',
  NEUTRAL = 'Neutro',
  UNCLASSIFIED = 'Não Classificado',
  ANALYZING = 'Analisando',
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  date: string; // ISO date string
  journalist?: string;
  category: NewsCategory;
  client: string;
  sentiment: Sentiment;
  link: string;
  fullContent?: string;
}

export enum SocialMediaPlatform {
  TWITTER = 'Twitter',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
}

export interface SocialMediaPost {
  id: string;
  platform: SocialMediaPlatform;
  content: string;
  date: string; // ISO date string
  client: string;
  sentiment: Sentiment;
  likes: number;
  comments: number;
  shares: number;
  link: string;
}

export enum UserRole {
  ADMIN = 'admin',
  ASSESSOR = 'assessor',
  CLIENT = 'client',
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Metric {
  title: string;
  value: string;
  change: string; // e.g., "+5%" or "-2%"
  changeType: 'increase' | 'decrease' | 'neutral';
}

export type ActiveSection = 'dashboard' | 'news' | 'social' | 'reports';
