import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store';
import { PublicLayout, AdminLayout } from './components/Layout';

// Pages
import Home from './views/public/Home';
import NovelDetail from './views/public/NovelDetail';
import Reader from './views/public/Reader';
import Bookshelf from './views/public/Bookshelf';

import Dashboard from './views/admin/Dashboard';
import NovelManager from './views/admin/NovelManager';
import ChapterEditor from './views/admin/ChapterEditor';
import NewsletterStats from './views/admin/NewsletterStats';

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/book/:id" element={<PublicLayout><NovelDetail /></PublicLayout>} />
          <Route path="/read/:novelId/:chapterId" element={<Reader />} />
          <Route path="/bookshelf" element={<PublicLayout><Bookshelf /></PublicLayout>} />
          <Route path="/rankings" element={<PublicLayout><Home /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/novels" element={<AdminLayout><NovelManager /></AdminLayout>} />
          <Route path="/admin/stats" element={<AdminLayout><NewsletterStats /></AdminLayout>} />
          <Route path="/admin/write/:novelId" element={<AdminLayout><ChapterEditor /></AdminLayout>} />
          <Route path="/admin/write/:novelId/:chapterId" element={<AdminLayout><ChapterEditor /></AdminLayout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;