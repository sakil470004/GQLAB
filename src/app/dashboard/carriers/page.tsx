'use client';

import TopNav from '@/components/layout/TopNav';
import { Truck, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CarriersPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div>
        <TopNav />
        <div className="p-6">
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500">Only administrators can manage carriers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Carrier Management</h1>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck size={32} className="text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Manage Carriers</h2>
          <p className="text-slate-500">Carrier management features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
