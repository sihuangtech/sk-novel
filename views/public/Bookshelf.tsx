import React from 'react';
import { useStore } from '../../store';
import { Link } from 'react-router-dom';
import { BookMarked, ArrowRight } from 'lucide-react';

const Bookshelf: React.FC = () => {
  const { currentUser, novels } = useStore();

  if (!currentUser) return <div className="p-12 text-center">Please login to view your bookshelf.</div>;

  const bookmarkedNovels = novels.filter(n => currentUser.bookmarks.includes(n.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
       <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
         <BookMarked className="h-8 w-8 text-brand-600" /> My Library
       </h1>
       
       {bookmarkedNovels.length === 0 ? (
         <div className="text-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-400 text-lg mb-4">Your bookshelf is gathering dust.</p>
            <Link to="/" className="text-brand-600 font-medium hover:underline">Find something to read</Link>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {bookmarkedNovels.map(novel => (
             <div key={novel.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition">
                <img src={novel.coverUrl} className="w-20 h-28 object-cover rounded shadow-sm" />
                <div className="flex-1 flex flex-col justify-between">
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{novel.title}</h3>
                     <p className="text-sm text-gray-500 mt-1 line-clamp-2">{novel.description}</p>
                   </div>
                   <div className="flex justify-end">
                      <Link to={`/book/${novel.id}`} className="text-sm font-medium text-brand-600 flex items-center gap-1 hover:text-brand-800">
                        Continue Reading <ArrowRight className="h-4 w-4" />
                      </Link>
                   </div>
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default Bookshelf;