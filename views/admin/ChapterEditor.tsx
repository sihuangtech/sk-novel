import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Chapter, ChapterAccess } from '../../types';
import { generateStoryContinuation, summarizeChapter } from '../../services/geminiService';
import { Save, Sparkles, ArrowLeft, Wand2, Mail } from 'lucide-react';

const ChapterEditor: React.FC = () => {
  const { novelId, chapterId } = useParams<{ novelId: string, chapterId: string }>();
  const navigate = useNavigate();
  const { novels, chapters, addChapter, updateChapter } = useStore();

  const novel = novels.find(n => n.id === novelId);
  const existingChapter = chapters.find(c => c.id === chapterId);

  // State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState(0);
  const [access, setAccess] = useState<ChapterAccess>(ChapterAccess.PUBLIC);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(true);

  useEffect(() => {
    if (existingChapter) {
      setTitle(existingChapter.title);
      setContent(existingChapter.content);
      setPrice(existingChapter.price);
      setAccess(existingChapter.access);
    }
  }, [existingChapter]);

  const handleSave = () => {
    if (!novelId) return;

    const ch: Chapter = {
      id: existingChapter?.id || `c${Date.now()}`,
      novelId,
      title: title || 'Untitled Chapter',
      content,
      wordCount: content.trim().split(/\s+/).length,
      access,
      price: access === ChapterAccess.PUBLIC ? 0 : price,
      order: existingChapter?.order || chapters.filter(c => c.novelId === novelId).length + 1,
      publishedAt: new Date().toISOString(),
      isDraft: false
    };

    if (existingChapter) {
      updateChapter(ch, notifySubscribers);
    } else {
      addChapter(ch, notifySubscribers);
    }
    navigate('/admin/novels');
  };

  const handleAiGenerate = async () => {
    setIsAiLoading(true);
    const newText = await generateStoryContinuation(content, aiPrompt);
    setContent(prev => prev + (prev ? '\n\n' : '') + newText);
    setIsAiLoading(false);
    setShowAiModal(false);
    setAiPrompt('');
  };

  const handleAiSummarize = async () => {
    setIsAiLoading(true);
    const summary = await summarizeChapter(content);
    alert(summary || "Could not generate summary.");
    setIsAiLoading(false);
  }

  if (!novel) return <div>Error: Novel not found</div>;

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/novels')} className="p-3 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-serif font-bold text-gray-900">{existingChapter ? 'Refining Manuscript' : 'Drafting New Chapter'}</h1>
         </div>
         <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowAiModal(true)} 
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition font-bold text-sm"
             >
               <Sparkles className="h-4 w-4" /> AI Co-Writer
             </button>
             <button 
                onClick={handleSave} 
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition font-bold text-sm shadow-xl shadow-black/10"
             >
               <Save className="h-4 w-4" /> {existingChapter ? 'Save Changes' : 'Publish Chapter'}
             </button>
         </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 p-10 overflow-hidden relative">
           <input 
             type="text" 
             placeholder="Title your chapter..." 
             value={title} 
             onChange={e => setTitle(e.target.value)}
             className="text-3xl font-serif font-bold border-none focus:ring-0 p-0 placeholder-gray-200 mb-8 outline-none"
           />
           <textarea
             value={content}
             onChange={e => setContent(e.target.value)}
             placeholder="Begin the narrative..."
             className="flex-1 w-full resize-none border-none focus:ring-0 p-0 font-serif text-xl leading-loose text-gray-800 placeholder-gray-200 outline-none"
           />
           <div className="absolute bottom-6 right-8 text-[10px] font-bold uppercase tracking-widest text-gray-300 bg-white/80 backdrop-blur py-1 rounded">
             {content.trim().split(/\s+/).length} Words Counted
           </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-72 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Mailing List</h4>
             <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                   <input 
                    type="checkbox" 
                    checked={notifySubscribers} 
                    onChange={e => setNotifySubscribers(e.target.checked)}
                    className="sr-only peer"
                   />
                   <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand-500 transition"></div>
                   <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5 shadow-sm"></div>
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition flex items-center gap-2">
                  <Mail className="h-3 w-3" /> Email Notify
                </span>
             </label>
             {notifySubscribers && (
               <p className="mt-3 text-[10px] leading-relaxed text-gray-400 font-serif italic">
                 Sent to ~2,500 active subscribers immediately upon saving.
               </p>
             )}
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Post Access</h4>
             <select 
               value={access} 
               onChange={e => setAccess(e.target.value as ChapterAccess)}
               className="w-full text-sm font-bold border-gray-100 rounded-xl focus:ring-brand-500 focus:border-brand-500 p-3"
             >
               <option value={ChapterAccess.PUBLIC}>Public (All Readers)</option>
               <option value={ChapterAccess.MEMBERS}>Members (Registered)</option>
               <option value={ChapterAccess.SUPPORTERS}>Supporters (Paid Only)</option>
             </select>
             
             {access === ChapterAccess.SUPPORTERS && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Price (Coins)</label>
                   <input 
                     type="number" 
                     value={price} 
                     onChange={e => setPrice(Number(e.target.value))}
                     className="w-full text-sm font-bold border-gray-100 rounded-xl focus:ring-brand-500 p-3"
                   />
                </div>
             )}
           </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
           <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold">
                <Sparkles className="h-5 w-5" /> Gemini AI
              </div>
              <p className="text-sm text-gray-500 mb-6 font-serif">
                How should we proceed with the next scene?
              </p>
              <textarea 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g., The protagonist discovers the hidden alchemy circle..."
                className="w-full border-gray-100 rounded-2xl mb-6 focus:ring-purple-500 focus:border-purple-500 p-4 font-serif text-sm"
                rows={4}
              />
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowAiModal(false)} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition">Dismiss</button>
                 <button 
                   onClick={handleAiGenerate} 
                   disabled={isAiLoading || !aiPrompt}
                   className="px-8 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm font-bold transition"
                 >
                   {isAiLoading ? <Wand2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                   Manifest Scene
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChapterEditor;