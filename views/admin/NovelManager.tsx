
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Link } from 'react-router-dom';
import { Plus, Edit, FileText, Download } from 'lucide-react';
import { exportNovel } from '../../services/exportService';
// Fixed: Imported ChapterAccess to handle enum comparisons
import { ChapterAccess } from '../../types';

const NovelManager: React.FC = () => {
  const { novels, getNovelChapters } = useStore();
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(novels[0]?.id || null);

  const selectedNovel = novels.find(n => n.id === selectedNovelId);
  const chapters = selectedNovelId ? getNovelChapters(selectedNovelId) : [];

  const handleExport = () => {
    if (selectedNovel && chapters.length > 0) {
      exportNovel(selectedNovel, chapters);
    } else {
      alert("Nothing to export");
    }
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-8rem)]">
       {/* Sidebar List */}
       <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h3 className="font-bold text-gray-700">Your Novels</h3>
             <button className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition">
               <Plus className="h-4 w-4" />
             </button>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
             {novels.map(novel => (
               <div 
                 key={novel.id} 
                 onClick={() => setSelectedNovelId(novel.id)}
                 className={`p-3 rounded-lg cursor-pointer flex gap-3 items-center transition ${selectedNovelId === novel.id ? 'bg-brand-50 border border-brand-200' : 'hover:bg-gray-50 border border-transparent'}`}
               >
                  <img src={novel.coverUrl} className="h-12 w-8 object-cover rounded bg-gray-200" />
                  <div>
                    <h4 className={`font-medium text-sm ${selectedNovelId === novel.id ? 'text-brand-700' : 'text-gray-900'}`}>{novel.title}</h4>
                    <span className="text-xs text-gray-500">{novel.status}</span>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Details Panel */}
       <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          {selectedNovel ? (
             <>
               <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                  <div className="flex gap-4">
                     <img src={selectedNovel.coverUrl} className="h-24 w-16 object-cover rounded-lg shadow-sm" />
                     <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">{selectedNovel.title}</h2>
                        <p className="text-gray-500 text-sm line-clamp-2 max-w-md">{selectedNovel.description}</p>
                        <div className="mt-3 flex gap-2">
                          <button onClick={handleExport} className="text-xs flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition">
                             <Download className="h-3 w-3" /> Export .txt
                          </button>
                        </div>
                     </div>
                  </div>
                  <Link to={`/admin/write/${selectedNovel.id}`} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition flex items-center gap-2">
                    <Plus className="h-4 w-4" /> New Chapter
                  </Link>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Chapters ({chapters.length})</h3>
                  <div className="space-y-3">
                     {chapters.map(chapter => (
                        <div key={chapter.id} className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-brand-200 hover:shadow-sm transition">
                           <div className="flex items-center gap-4">
                              <span className="text-gray-400 font-mono text-sm">#{chapter.order}</span>
                              <span className="font-medium text-gray-900">{chapter.title}</span>
                              {/* Fixed: Replaced incorrect .type property with .access and used ChapterAccess enums */}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                 chapter.access === ChapterAccess.PUBLIC ? 'bg-green-100 text-green-700' : 
                                 chapter.access === ChapterAccess.MEMBERS ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                 {chapter.access}
                              </span>
                           </div>
                           <Link to={`/admin/write/${selectedNovel.id}/${chapter.id}`} className="text-gray-400 hover:text-brand-600 p-2">
                              <Edit className="h-4 w-4" />
                           </Link>
                        </div>
                     ))}
                     {chapters.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                           No chapters yet. Start writing!
                        </div>
                     )}
                  </div>
               </div>
             </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a novel to manage</div>
          )}
       </div>
    </div>
  );
};

export default NovelManager;
