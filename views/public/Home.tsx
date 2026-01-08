import React from 'react';
import { useStore } from '../../store';
import Link from 'next/link';
import { Mail, ArrowRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  const { novels, currentUser, updateUser } = useStore();

  return (
    <div className="bg-white">
      {/* Hero: Author Identity */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-6">
          SK Novel & Chronicles
        </h1>
        <p className="text-xl text-gray-500 font-serif italic max-w-2xl mx-auto leading-relaxed">
          Exploring the intersections of magic and machine. Weekly serializations from the desk of <span className="text-gray-900 font-bold not-italic">InkMaster</span>.
        </p>
      </section>

      {/* Featured Story: Highlight the main project */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        {novels.map(novel => (
          <Link key={novel.id} href={`/book/${novel.id}`} className="group relative block overflow-hidden rounded-3xl bg-gray-900 aspect-[21/9]">
            <img
              src={novel.coverUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-1000"
              alt={novel.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-8 md:p-12 w-full">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                Latest Series
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{novel.title}</h2>
              <p className="text-gray-300 max-w-xl text-lg line-clamp-2 mb-6 font-serif">
                {novel.description}
              </p>
              <div className="flex items-center text-white font-bold gap-2">
                Read the latest chapters <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter Section: Ghost's core feature */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
            <Mail className="h-8 w-8 text-brand-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Subscribe to the Newsletter</h2>
          <p className="text-gray-500 text-lg mb-8 font-serif">
            Join 2,500+ readers. Get new chapters and world-building notes delivered straight to your inbox. No spam, ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="jamie@example.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
            <button
              onClick={() => alert("Subscribed! (Demo)")}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Secondary Projects / Archive */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <h3 className="text-2xl font-serif font-bold text-gray-900">Archive & Collections</h3>
          <Link href="/rankings" className="text-brand-600 font-bold flex items-center gap-1 hover:underline">
            View all works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img src={`https://picsum.photos/400/500?random=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition">Volume 0{i}: The Forgotten Relics</h4>
              <p className="text-gray-500 text-sm font-serif line-clamp-2 leading-relaxed">
                Short stories and vignettes set in the world of Cyberpunk Alchemist.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
