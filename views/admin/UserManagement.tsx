import React, { useEffect, useState } from 'react';
import { UserRole, MembershipTier } from '../../types';
import { Loader2, User, Shield, Crown } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tier: MembershipTier;
  createdAt: string;
  _count: {
    comments: number;
    bookmarks: number;
    unlockedChapters: number;
  };
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      console.error('Failed to update role', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTierChange = async (userId: string, newTier: MembershipTier) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier: newTier } : u));
      }
    } catch (error) {
      console.error('Failed to update tier', error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">User Management</h2>
        <p className="text-gray-500 font-serif italic">Manage user roles and memberships.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Membership</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            disabled={updatingId === user.id}
                            className="appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 disabled:opacity-50"
                        >
                            <option value="READER">Reader</option>
                            <option value="AUTHOR">Author (Admin)</option>
                        </select>
                        <Shield className="absolute right-8 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                        <select
                            value={user.tier}
                            onChange={(e) => handleTierChange(user.id, e.target.value as MembershipTier)}
                            disabled={updatingId === user.id}
                            className="appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 disabled:opacity-50"
                        >
                            <option value="FREE">Free</option>
                            <option value="MEMBER">Member</option>
                            <option value="SUPPORTER">Supporter</option>
                        </select>
                        <Crown className="absolute right-8 top-3 h-4 w-4 text-yellow-500 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{user._count.unlockedChapters} unlocked</div>
                      <div>{user._count.bookmarks} bookmarks</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
