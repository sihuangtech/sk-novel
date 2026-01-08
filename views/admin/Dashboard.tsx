import React from 'react';
import { useStore } from '../../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, BookOpen, TrendingUp, Mail, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { novels, campaigns } = useStore();
  
  const data = [
    { name: 'Mon', views: 4000, income: 240 },
    { name: 'Tue', views: 3000, income: 139 },
    { name: 'Wed', views: 2000, income: 980 },
    { name: 'Thu', views: 2780, income: 390 },
    { name: 'Fri', views: 1890, income: 480 },
    { name: 'Sat', views: 2390, income: 380 },
    { name: 'Sun', views: 3490, income: 430 },
  ];

  const totalViews = novels.reduce((acc, n) => acc + n.views, 0);
  const lastCampaign = campaigns[0];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 font-serif italic">Your creative pulse for this week.</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Growth</h3>
             <Users className="h-4 w-4 text-brand-500" />
           </div>
           <p className="text-3xl font-serif font-bold text-gray-900">{totalViews.toLocaleString()}</p>
           <span className="text-green-500 text-[10px] font-bold flex items-center mt-2 uppercase tracking-widest">
             <TrendingUp className="h-3 w-3 mr-1" /> +12% Weekly
           </span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Support</h3>
             <DollarSign className="h-4 w-4 text-green-500" />
           </div>
           <p className="text-3xl font-serif font-bold text-gray-900">$1,245</p>
           <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2 block">
             Net Revenue
           </span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Newsletter</h3>
             <Mail className="h-4 w-4 text-purple-500" />
           </div>
           <p className="text-3xl font-serif font-bold text-gray-900">2.5k</p>
           <span className="text-purple-500 text-[10px] font-bold uppercase tracking-widest mt-2 block">
             Active Subscribers
           </span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Open Rate</h3>
             <CheckCircle className="h-4 w-4 text-orange-500" />
           </div>
           <p className="text-3xl font-serif font-bold text-gray-900">
             {lastCampaign ? `${lastCampaign.openRate.toFixed(1)}%` : '--'}
           </p>
           <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mt-2 block">
             Last Dispatch
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-[450px]">
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-8">Audience Retention</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={4} dot={false} activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Recent Dispatches</h3>
           <div className="space-y-6">
              {campaigns.slice(0, 4).map(camp => (
                <div key={camp.id} className="group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand-600 transition truncate pr-4">
                      {camp.chapterTitle}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      {new Date(camp.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-[10px] font-bold text-gray-400">
                      <span className="text-brand-600">{camp.openRate.toFixed(1)}%</span> OPEN
                    </div>
                    <div className="text-[10px] font-bold text-gray-400">
                      <span className="text-purple-600">{camp.clickRate.toFixed(1)}%</span> CLICK
                    </div>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <p className="text-sm text-gray-400 italic">No newsletters sent yet.</p>
              )}
           </div>
           <button className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              View All Insights
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;