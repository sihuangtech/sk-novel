import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../store';
import { UserRole } from '../types';
import { Feather, User, Search, Menu, LogOut, Wallet } from 'lucide-react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useStore();

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md z-50 border-b border-gray-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Feather className="h-6 w-6 text-brand-600" />
              <span className="text-xl font-serif font-black tracking-tighter">SK Novel.</span>
            </Link>
            <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-gray-900 transition">Works</Link>
              <Link href="/rankings" className="hover:text-gray-900 transition">About</Link>
              <Link href="/bookshelf" className="hover:text-gray-900 transition">Library</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-gray-900 transition">
              <Search className="h-5 w-5" />
            </button>
            {!currentUser ? (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-black transition"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/recharge" className="p-2 text-gray-400 hover:text-yellow-500 transition" title="Recharge Coins">
                  <Wallet className="h-5 w-5" />
                </Link>
                <div className="flex flex-col items-end mr-2 hidden sm:flex">
                  <span className="text-xs font-bold text-gray-900">{currentUser.username}</span>
                  <span className="text-[10px] font-bold text-brand-600 uppercase">{currentUser.tier}</span>
                </div>
                {currentUser.role === UserRole.AUTHOR && (
                  <Link href="/admin" className="p-2 text-gray-400 hover:text-brand-600 transition">
                    <Feather className="h-5 w-5" />
                  </Link>
                )}
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="pt-20">
        {children}
      </main>
      <footer className="py-20 px-6 border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Feather className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-serif font-black tracking-tighter text-gray-400">SK Novel.</span>
          </div>
          <div className="text-sm text-gray-400 font-serif italic">
            Published with SK Novel © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-gray-900">Twitter</a>
            <a href="#" className="hover:text-gray-900">Substack</a>
            <a href="#" className="hover:text-gray-900">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useStore();
  const router = useRouter();

  if (!currentUser || currentUser.role !== UserRole.AUTHOR) {
    return <div className="p-20 text-center font-serif">Unauthorized Access.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0">
        <div className="p-8 border-b border-gray-50">
          <Link href="/admin" className="flex items-center gap-2">
            <Feather className="h-5 w-5 text-brand-600" />
            <span className="text-lg font-serif font-black tracking-tighter">Studio.</span>
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-1">
          <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">Dashboard</Link>
          <Link href="/admin/users" className="flex items-center px-4 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">Users</Link>
          <Link href="/admin/novels" className="flex items-center px-4 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">Manuscripts</Link>
          <Link href="/admin/stats" className="flex items-center px-4 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">Membership</Link>
          <Link href="/admin/pricing" className="flex items-center px-4 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">Pricing</Link>
        </nav>
        <div className="p-6 border-t border-gray-50">
          <Link href="/" className="text-xs font-bold text-brand-600 uppercase tracking-widest hover:underline">View Live Site</Link>
        </div>
      </aside>
      <main className="flex-1 pl-64 p-12">
        {children}
      </main>
    </div>
  );
};
