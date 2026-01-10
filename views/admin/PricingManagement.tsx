import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  type: 'RECHARGE' | 'UPGRADE';
  tier: 'FREE' | 'MEMBER' | 'SUPPORTER' | null;
  coinsAmount: number | null;
  bonusCoins: number;
  creemProductId: string | null;
  isActive: boolean;
  createdAt: string;
}

const PricingManagement: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<PricingPlan>>({});
  
  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/pricing-plans');
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async () => {
    try {
      const method = currentPlan.id ? 'PUT' : 'POST';
      const url = currentPlan.id 
        ? `/api/admin/pricing-plans/${currentPlan.id}`
        : '/api/admin/pricing-plans';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPlan),
      });

      if (res.ok) {
        setIsEditing(false);
        setCurrentPlan({});
        fetchPlans();
      } else {
        alert('Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await fetch(`/api/admin/pricing-plans/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPlans();
      }
    } catch (error) {
      console.error('Error deleting plan', error);
    }
  };

  const openEditor = (plan?: PricingPlan) => {
    if (plan) {
      setCurrentPlan(plan);
    } else {
      setCurrentPlan({
        currency: 'USD',
        type: 'RECHARGE',
        bonusCoins: 0,
        isActive: true
      });
    }
    setIsEditing(true);
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Pricing Management</h2>
          <p className="text-gray-500 font-serif italic">Manage recharge packages and membership tiers.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-bold mb-4">{currentPlan.id ? 'Edit Plan' : 'New Plan'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
              <input 
                value={currentPlan.name || ''} 
                onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
              <input 
                type="number"
                step="0.01"
                value={currentPlan.price || ''} 
                onChange={e => setCurrentPlan({...currentPlan, price: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
              <select 
                value={currentPlan.type || 'RECHARGE'} 
                onChange={e => setCurrentPlan({...currentPlan, type: e.target.value as any})}
                className="w-full p-2 border rounded"
              >
                <option value="RECHARGE">Recharge Coins</option>
                <option value="UPGRADE">Membership Upgrade</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Creem Product ID</label>
              <input 
                value={currentPlan.creemProductId || ''} 
                onChange={e => setCurrentPlan({...currentPlan, creemProductId: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {currentPlan.type === 'RECHARGE' && (
              <>
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Coins Amount</label>
                  <input 
                    type="number"
                    value={currentPlan.coinsAmount || ''} 
                    onChange={e => setCurrentPlan({...currentPlan, coinsAmount: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Bonus Coins</label>
                  <input 
                    type="number"
                    value={currentPlan.bonusCoins || 0} 
                    onChange={e => setCurrentPlan({...currentPlan, bonusCoins: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            {currentPlan.type === 'UPGRADE' && (
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Tier</label>
                <select 
                  value={currentPlan.tier || 'MEMBER'} 
                  onChange={e => setCurrentPlan({...currentPlan, tier: e.target.value as any})}
                  className="w-full p-2 border rounded"
                >
                  <option value="MEMBER">Member</option>
                  <option value="SUPPORTER">Supporter</option>
                </select>
              </div>
            )}
             <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                value={currentPlan.description || ''} 
                onChange={e => setCurrentPlan({...currentPlan, description: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
             <div className="col-span-2 flex items-center gap-2">
              <input 
                type="checkbox"
                checked={currentPlan.isActive ?? true}
                onChange={e => setCurrentPlan({...currentPlan, isActive: e.target.checked})}
              />
              <label className="text-sm font-bold text-gray-700">Active</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Save Plan</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plans.map(plan => (
              <tr key={plan.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-900">{plan.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    plan.type === 'RECHARGE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {plan.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">{plan.currency} {plan.price}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {plan.type === 'RECHARGE' ? (
                    <span>{plan.coinsAmount} coins (+{plan.bonusCoins} bonus)</span>
                  ) : (
                    <span>Tier: {plan.tier}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => openEditor(plan)} className="p-1 text-gray-400 hover:text-brand-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingManagement;
