export enum UserRole {
  READER = 'READER',
  AUTHOR = 'AUTHOR'
}

export enum MembershipTier {
  FREE = 'FREE',
  MEMBER = 'MEMBER', // 仅注册
  SUPPORTER = 'SUPPORTER' // 付费支持者
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tier: MembershipTier;
  coins: number;
  unlockedChapters: string[];
  bookmarks: string[];
  isSubscribedToEmail: boolean;
}

export enum NovelStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

export interface Novel {
  id: string;
  title: string;
  authorId: string;
  coverUrl: string;
  description: string;
  tags: string[];
  status: NovelStatus;
  views: number;
  rating: number;
  updatedAt: string;
}

export enum ChapterAccess {
  PUBLIC = 'PUBLIC',     // 所有人可见
  MEMBERS = 'MEMBERS',   // 仅登录可见
  SUPPORTERS = 'SUPPORTERS' // 仅付费会员可见
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  wordCount: number;
  access: ChapterAccess;
  price: number; 
  order: number;
  publishedAt: string;
  isDraft: boolean;
}

export interface NewsletterCampaign {
  id: string;
  chapterId: string;
  chapterTitle: string;
  sentAt: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  subject: string;
}

export interface Comment {
  id: string;
  chapterId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}