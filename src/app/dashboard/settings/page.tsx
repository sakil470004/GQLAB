'use client';

import TopNav from '@/components/layout/TopNav';
import { useAuth } from '@/context/AuthContext';
import { Settings as SettingsIcon, Lock } from 'lucide-react';

export default function SettingsPage() {
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
            <p className="text-slate-500">Only administrators can access settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon size={32} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">System Settings</h2>
          <p className="text-slate-500">System configuration coming soon...</p>
        </div>
      </div>
    </div>
  );
}
