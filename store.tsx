import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Novel, Chapter, UserRole, NovelStatus, ChapterAccess, MembershipTier, NewsletterCampaign } from './types';

const MOCK_USER: User = {
  id: 'u1',
  username: 'LiteratureFan',
  email: 'fan@example.com',
  role: UserRole.READER,
  tier: MembershipTier.FREE,
  coins: 50,
  unlockedChapters: [],
  bookmarks: [],
  isSubscribedToEmail: false
};

const MOCK_AUTHOR: User = {
  id: 'a1',
  username: 'InkMaster',
  email: 'author@sknovel.com',
  role: UserRole.AUTHOR,
  tier: MembershipTier.SUPPORTER,
  coins: 9999,
  unlockedChapters: [],
  bookmarks: [],
  isSubscribedToEmail: true
};

const MOCK_NOVELS: Novel[] = [
  {
    id: 'n1',
    title: 'The Cyberpunk Alchemist',
    authorId: 'a1',
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop',
    description: 'In a world of neon and chrome, one alchemist seeks the ultimate transmutation. A story about identity, magic, and the price of progress.',
    tags: ['Sci-Fi', 'Philosophical'],
    status: NovelStatus.ONGOING,
    views: 12500,
    rating: 4.9,
    updatedAt: new Date().toISOString()
  }
];

const MOCK_CAMPAIGNS: NewsletterCampaign[] = [
  {
    id: 'camp-1',
    chapterId: 'c1',
    chapterTitle: 'Prologue: The Neon Rain',
    sentAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    recipients: 2450,
    openRate: 42.5,
    clickRate: 12.8,
    subject: "New Release: Prologue: The Neon Rain is live!"
  }
];

interface AppContextType {
  currentUser: User | null;
  novels: Novel[];
  chapters: Chapter[];
  campaigns: NewsletterCampaign[];
  login: (asAuthor: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleBookmark: (novelId: string) => void;
  unlockChapter: (chapterId: string) => boolean;
  getNovelChapters: (novelId: string) => Chapter[];
  addChapter: (chapter: Chapter, notifySubscribers?: boolean) => void;
  updateChapter: (chapter: Chapter, notifySubscribers?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [novels, setNovels] = useState<Novel[]>(MOCK_NOVELS);
  const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>(MOCK_CAMPAIGNS);

  useEffect(() => {
    const savedUser = localStorage.getItem('sk_novel_user');
    const savedCampaigns = localStorage.getItem('sk_novel_campaigns');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
  }, []);

  useEffect(() => {
    localStorage.setItem('sk_novel_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const login = (asAuthor: boolean) => {
    const user = asAuthor ? MOCK_AUTHOR : MOCK_USER;
    setCurrentUser(user);
    localStorage.setItem('sk_novel_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sk_novel_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('sk_novel_user', JSON.stringify(updated));
  };

  const unlockChapter = (chapterId: string) => {
    if (!currentUser) return false;
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch || currentUser.coins < ch.price) return false;

    updateUser({
      coins: currentUser.coins - ch.price,
      unlockedChapters: [...currentUser.unlockedChapters, chapterId]
    });
    return true;
  };

  const toggleBookmark = (novelId: string) => {
    if (!currentUser) return;
    const isBookmarked = currentUser.bookmarks.includes(novelId);
    updateUser({
      bookmarks: isBookmarked
        ? currentUser.bookmarks.filter(id => id !== novelId)
        : [...currentUser.bookmarks, novelId]
    });
  };

  const getNovelChapters = (novelId: string) => {
    return chapters.filter(c => c.novelId === novelId).sort((a, b) => a.order - b.order);
  };

  const dispatchNewsletter = (chapter: Chapter) => {
    const newCampaign: NewsletterCampaign = {
      id: `camp-${Date.now()}`,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      sentAt: new Date().toISOString(),
      recipients: 2512 + Math.floor(Math.random() * 50),
      openRate: 35 + Math.random() * 20,
      clickRate: 8 + Math.random() * 10,
      subject: `New Release: ${chapter.title} is now live on SK Novel!`
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const addChapter = (chapter: Chapter, notifySubscribers = false) => {
    setChapters(prev => [...prev, chapter]);
    if (notifySubscribers) dispatchNewsletter(chapter);
  };

  const updateChapter = (chapter: Chapter, notifySubscribers = false) => {
    setChapters(prev => prev.map(c => c.id === chapter.id ? chapter : c));
    if (notifySubscribers) dispatchNewsletter(chapter);
  };

  return (
    <AppContext.Provider value={{
      currentUser, novels, chapters, campaigns, login, logout, updateUser, toggleBookmark, unlockChapter, getNovelChapters, addChapter, updateChapter
    }}>
      {children}
    </AppContext.Provider>
  );
};

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'c1',
    novelId: 'n1',
    title: 'Prologue: The Neon Rain',
    content: "The rain fell hard on the neon streets, washing away the grime of the lower city. Jack pulled his collar up. 'It's going to be a long night,' he muttered.\n\nThe city breathed with a mechanical wheeze. Every flickering light told a story of a lost soul, and Jack was the keeper of them all.",
    wordCount: 1200,
    access: ChapterAccess.PUBLIC,
    price: 0,
    order: 1,
    publishedAt: new Date().toISOString(),
    isDraft: false
  },
  {
    id: 'c2',
    novelId: 'n1',
    title: 'Chapter 1: Silicon Memories',
    content: "The circuit board hummed with arcane energy. Sarah whispered, 'This shouldn't be possible.' Her cybernetic eye zooming in on the traces. It was memory, stored not in bits, but in blood.",
    wordCount: 1500,
    access: ChapterAccess.MEMBERS,
    price: 0,
    order: 2,
    publishedAt: new Date().toISOString(),
    isDraft: false
  }
];

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};