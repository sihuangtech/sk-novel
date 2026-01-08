import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { ChapterAccess, MembershipTier } from '../../types';
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, Lock, Share2, Heart, MessageSquare } from 'lucide-react';

const Reader: React.FC = () => {
  const { novelId, chapterId } = useParams<{ novelId: string, chapterId: string }>();
  const navigate = useNavigate();
  const { novels, getNovelChapters, currentUser, unlockChapter, updateUser } = useStore();
  
  const [fontSize, setFontSize] = useState(20);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
         <Link to={`/book/${novelId}`} className="p-2 hover:bg-black/5 rounded-full transition">
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
              onChange={(e) => setFontSize(Number(e.target.value))} 
              className="w-full accent-brand-500"
             />
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {!access ? (
          <div className="py-20 text-center">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 rounded-full mb-8">
               <Lock className="h-10 w-10 text-brand-600" />
             </div>
             <h2 className="text-3xl font-serif font-bold mb-4">This chapter is for members</h2>
             <p className="text-gray-500 font-serif text-lg mb-8 leading-relaxed">
                Unlock full access to the archives and get every new chapter delivered to your inbox.
             </p>
             <div className="space-y-4 max-w-sm mx-auto">
                <button 
                  onClick={() => navigate('/')}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-xl"
                >
                  Join the Membership
                </button>
                <button 
                   onClick={() => useStore().login(false)}
                   className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Sign in
                </button>
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
                    onClick={() => navigate(`/read/${novelId}/${prevChapter?.id}`)}
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
                    onClick={() => navigate(`/read/${novelId}/${nextChapter?.id}`)}
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
