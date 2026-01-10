import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../store';
import { useToast } from '../../contexts/ToastContext';
import { ChapterAccess, MembershipTier } from '../../types';
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, Lock, Share2, Heart, MessageSquare } from 'lucide-react';

const Reader: React.FC = () => {
  const params = useParams();
  const novelId = params?.novelId as string;
  const chapterId = params?.chapterId as string;
  const router = useRouter();
  const { novels, getNovelChapters, currentUser, unlockChapter } = useStore();
  const { showToast } = useToast();
  
  const [fontSize, setFontSize] = useState(20);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [unlocking, setUnlocking] = useState(false);

  const novel = novels.find(n => n.id === novelId);
  const chapters = novelId ? getNovelChapters(novelId) : [];
  const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
  const currentChapter = chapters[currentChapterIndex];
  const nextChapter = chapters[currentChapterIndex + 1];
  const prevChapter = chapters[currentChapterIndex - 1];

  // Access Logic
  const hasAccess = () => {
    if (!currentChapter) return false;
    if (currentChapter.access === ChapterAccess.PUBLIC) return true;
    if (!currentUser) return false;
    if (currentUser.role === 'AUTHOR') return true;
    if (currentChapter.access === ChapterAccess.MEMBERS) return true;
    if (currentChapter.access === ChapterAccess.SUPPORTERS) {
        return currentUser.tier === MembershipTier.SUPPORTER || currentUser.unlockedChapters.includes(currentChapter.id);
    }
    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!novel || !currentChapter) return <div className="p-20 text-center font-serif">Loading masterpiece...</div>;

  const access = hasAccess();

  const handleUnlock = async () => {
    if (!currentUser || !currentChapter) return;
    setUnlocking(true);
    const success = await unlockChapter(currentChapter.id);
    setUnlocking(false);
    if (!success) {
      showToast("Failed to unlock. Please check your balance.", 'error');
    } else {
      showToast("Chapter unlocked successfully!", 'success');
    }
  };

  const themeClasses = {
    light: 'bg-[#ffffff] text-[#1a1a1a]',
    sepia: 'bg-[#fcf8ef] text-[#433422]',
    dark: 'bg-[#121212] text-[#d1d1d1]'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses[theme]}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100 dark:bg-gray-800">
        <div 
          className="h-full bg-brand-500 transition-all duration-150" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Minimal Header */}
      <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-40 backdrop-blur-md bg-transparent border-b border-black/5">
         <Link href={`/book/${novelId}`} className="p-2 hover:bg-black/5 rounded-full transition">
           <ArrowLeft className="h-5 w-5" />
         </Link>
         <div className="text-xs font-bold tracking-widest uppercase opacity-50 hidden md:block">
           {novel.title} • {currentChapter.title}
         </div>
         <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-black/5 rounded-full transition">
           <Settings className="h-5 w-5" />
         </button>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-16 right-6 z-50 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-100 w-72">
           <div className="mb-6">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Appearance</span>
             <div className="grid grid-cols-3 gap-2">
               {['light', 'sepia', 'dark'].map(t => (
                 <button 
                  key={t}
                  onClick={() => setTheme(t as any)}
                  className={`py-2 rounded-lg border text-xs capitalize ${theme === t ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-200'}`}
                 >
                   {t}
                 </button>
               ))}
             </div>
           </div>
           <div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Typography: {fontSize}px</span>
             <input 
              type="range" min="16" max="28" value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
             />
           </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-24">
        {!access ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
             <Lock className="h-12 w-12 text-gray-300 mb-6" />
             <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
               {currentUser ? 'Locked Chapter' : 'Members Only Content'}
             </h2>
             <p className="text-gray-500 mb-8 max-w-md">
               {currentUser && currentChapter.price > 0 
                 ? `This chapter requires ${currentChapter.price} coins to unlock.` 
                 : 'This chapter is exclusive to our supporting members. Join the inner circle to continue reading.'}
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                {!currentUser ? (
                  <>
                    <button 
                      onClick={() => router.push('/')}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-xl"
                    >
                      Join the Membership
                    </button>
                    <button 
                       onClick={() => router.push('/login')}
                       className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    {currentChapter.price > 0 ? (
                        <button 
                          onClick={handleUnlock}
                          disabled={unlocking}
                          className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition shadow-xl disabled:opacity-50"
                        >
                          {unlocking ? 'Unlocking...' : `Unlock (${currentChapter.price} Coins)`}
                        </button>
                    ) : (
                        <button 
                          onClick={() => router.push('/')}
                          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-xl"
                        >
                          Upgrade Membership
                        </button>
                    )}
                    <button 
                       onClick={() => router.push('/')}
                       className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition"
                    >
                      Back to Home
                    </button>
                  </>
                )}
             </div>
          </div>
        ) : (
          <article style={{ fontSize: `${fontSize}px` }} className="font-serif leading-[1.8] tracking-tight">
            <header className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{currentChapter.title}</h1>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-400 font-sans font-medium uppercase tracking-widest">
                <span>By InkMaster</span>
                <span>•</span>
                <span>{new Date(currentChapter.publishedAt).toLocaleDateString()}</span>
              </div>
            </header>
            
            <div className="whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
              {currentChapter.content}
            </div>

            {/* Post-Reading Engagement */}
            <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col items-center">
               <div className="flex gap-8 mb-12">
                  <button className="flex items-center gap-2 group">
                    <Heart className="h-6 w-6 group-hover:text-red-500 group-hover:fill-red-500 transition" />
                    <span className="font-bold text-sm">24 Likes</span>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <MessageSquare className="h-6 w-6 group-hover:text-brand-500 transition" />
                    <span className="font-bold text-sm">12 Comments</span>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <Share2 className="h-6 w-6 group-hover:text-brand-500 transition" />
                  </button>
               </div>

               <div className="flex justify-between w-full font-sans">
                  <button 
                    disabled={!prevChapter}
                    onClick={() => router.push(`/read/${novelId}/${prevChapter?.id}`)}
                    className={`flex items-center gap-2 p-4 rounded-2xl transition ${!prevChapter ? 'opacity-20' : 'hover:bg-black/5'}`}
                  >
                    <ChevronLeft className="h-5 w-5" /> 
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Previous</div>
                      <div className="text-sm font-bold truncate max-w-[150px]">{prevChapter?.title || 'None'}</div>
                    </div>
                  </button>
                  <button 
                    disabled={!nextChapter}
                    onClick={() => router.push(`/read/${novelId}/${nextChapter?.id}`)}
                    className={`flex items-center gap-2 p-4 rounded-2xl transition ${!nextChapter ? 'opacity-20' : 'hover:bg-black/5'}`}
                  >
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Next</div>
                      <div className="text-sm font-bold truncate max-w-[150px]">{nextChapter?.title || 'None'}</div>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                  </button>
               </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default Reader;
