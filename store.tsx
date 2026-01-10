import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Novel, Chapter, UserRole, NovelStatus, ChapterAccess, MembershipTier, NewsletterCampaign } from './types';

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

interface AppContextType {
  currentUser: User | null;
  novels: Novel[];
  chapters: Chapter[];
  campaigns: NewsletterCampaign[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  toggleBookmark: (novelId: string) => Promise<void>;
  unlockChapter: (chapterId: string) => Promise<boolean>;
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
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) setCurrentUser(data.user);
        }
      } catch (e) {
        console.error("Failed to check auth", e);
      }
    };
    checkAuth();

    const savedCampaigns = localStorage.getItem('sk_novel_campaigns');
    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
  }, []);

  useEffect(() => {
    localStorage.setItem('sk_novel_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error("Failed to update user", e);
    }
  };

  const unlockChapter = async (chapterId: string) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/chapters/${chapterId}/unlock`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
           setCurrentUser(prev => prev ? {
             ...prev,
             coins: data.coins,
             unlockedChapters: [...prev.unlockedChapters, chapterId]
           } : null);
           return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Failed to unlock chapter", e);
      return false;
    }
  };

  const toggleBookmark = async (novelId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/novels/${novelId}/bookmark`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(prev => {
            if (!prev) return null;
            const isBookmarked = prev.bookmarks.includes(novelId);
            // If server says isBookmarked=true, ensure it is in list.
            // But usually we just toggle locally based on response to be snappy, or trust server state.
            // Let's trust server response if available, or just toggle.
            // The API returns { success: true, isBookmarked: boolean }
            
            const newBookmarks = data.isBookmarked 
                ? (isBookmarked ? prev.bookmarks : [...prev.bookmarks, novelId])
                : prev.bookmarks.filter(id => id !== novelId);
                
            return { ...prev, bookmarks: newBookmarks };
        });
      }
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
    }
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
      currentUser, novels, chapters, campaigns, login, register, logout, updateUser, toggleBookmark, unlockChapter, getNovelChapters, addChapter, updateChapter
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
