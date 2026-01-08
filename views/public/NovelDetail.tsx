
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { Lock, PlayCircle, BookMarked, Share2 } from 'lucide-react';
// Fixed: Changed ChapterType to ChapterAccess to match types.ts
import { ChapterAccess } from '../../types';

const NovelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { novels, getNovelChapters, currentUser, toggleBookmark } = useStore();

  const novel = novels.find(n => n.id === id);
  const chapters = id ? getNovelChapters(id) : [];

  if (!novel) return <div className="p-8 text-center">Novel not found</div>;

  const isBookmarked = currentUser?.bookmarks.includes(novel.id);
  const firstChapter = chapters[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Novel Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 h-64 md:h-auto relative">
             <img src={novel.coverUrl} className="w-full h-full object-cover" alt={novel.title} />
          </div>
          <div className="p-8 md:w-2/3 lg:w-3/4 flex flex-col justify-between">
            <div>
               <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{novel.title}</h1>
               <div className="flex gap-2 mb-4">
                  {novel.tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-full font-medium">{t}</span>
                  ))}
               </div>
               <p className="text-gray-600 leading-relaxed mb-6">
                 {novel.description}
               </p>
            </div>
            
            <div className="flex gap-4 border-t pt-6 border-gray-100">
               {firstChapter && (
                 <Link to={`/read/${novel.id}/${firstChapter.id}`} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition">
                    <PlayCircle className="h-5 w-5" /> Start Reading
                 </Link>
               )}
               <button 
                onClick={() => toggleBookmark(novel.id)}
                className={`flex-1 border flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${isBookmarked ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                  <BookMarked className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} /> 
                  {isBookmarked ? 'In Library' : 'Add to Library'}
               </button>
               <button className="px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Share2 className="h-5 w-5" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Table of Contents ({chapters.length})</h3>
        <div className="space-y-1">
          {chapters.map((chapter) => {
            // Fixed: Changed .type to .access and ChapterType to ChapterAccess
            const isLocked = chapter.access !== ChapterAccess.PUBLIC && !currentUser?.unlockedChapters.includes(chapter.id) && currentUser?.role !== 'AUTHOR';
            return (
              <Link 
                key={chapter.id} 
                to={`/read/${novel.id}/${chapter.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-mono text-sm w-8">#{chapter.order}</span>
                  <span className={`${isLocked ? 'text-gray-500' : 'text-gray-900 group-hover:text-brand-600'} font-medium`}>
                    {chapter.title}
                  </span>
                  {/* Fixed: Updated condition for VIP tag */}
                  {chapter.access !== ChapterAccess.PUBLIC && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 font-medium">VIP</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                   <span>{new Date(chapter.publishedAt).toLocaleDateString()}</span>
                   {isLocked ? (
                     <Lock className="h-4 w-4 text-gray-400" />
                   ) : (
                     <span className="text-brand-600 opacity-0 group-hover:opacity-100">Read</span>
                   )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NovelDetail;
