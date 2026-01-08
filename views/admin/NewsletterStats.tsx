import React from 'react';
import { useStore } from '../../store';
import { Mail, ArrowUpRight, MousePointer2, Eye, Calendar } from 'lucide-react';

const NewsletterStats: React.FC = () => {
  const { campaigns } = useStore();

  const totalSent = campaigns.reduce((acc, c) => acc + c.recipients, 0);
  const avgOpenRate = campaigns.length ? campaigns.reduce((acc, c) => acc + c.openRate, 0) / campaigns.length : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">Membership & Newsletter</h2>
        <p className="text-gray-500 font-serif italic">Analyzing your direct connection with the reader base.</p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Subscriber Base</h3>
           <p className="text-4xl font-serif font-bold text-gray-900">2,512</p>
           <div className="mt-4 flex items-center text-green-500 text-xs font-bold gap-1">
             <ArrowUpRight className="h-3 w-3" /> +14 this week
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Outreach</h3>
           <p className="text-4xl font-serif font-bold text-gray-900">{totalSent.toLocaleString()}</p>
           <div className="mt-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
             Emails Delivered
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Avg. Engagement</h3>
           <p className="text-4xl font-serif font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</p>
           <div className="mt-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
             Open Rate
           </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-lg font-serif font-bold text-gray-900">Dispatch History</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <th className="px-8 py-4">Chapter Title</th>
              <th className="px-8 py-4">Date Sent</th>
              <th className="px-8 py-4">Recipients</th>
              <th className="px-8 py-4 text-center">Open Rate</th>
              <th className="px-8 py-4 text-center">Click Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {campaigns.map(camp => (
              <tr key={camp.id} className="hover:bg-gray-50 transition">
                <td className="px-8 py-6">
                  <div className="font-bold text-gray-900">{camp.chapterTitle}</div>
                  <div className="text-[10px] text-gray-400 font-serif italic truncate max-w-xs">{camp.subject}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(camp.sentAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-gray-700">{camp.recipients.toLocaleString()}</span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-brand-600">{camp.openRate.toFixed(1)}%</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-brand-500" style={{ width: `${camp.openRate}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-purple-600">{camp.clickRate.toFixed(1)}%</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${camp.clickRate}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-serif italic">
                  Launch your first newsletter to start tracking audience growth.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterStats;