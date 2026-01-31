'use client';

import TopNav from '@/components/layout/TopNav';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Analytics</h1>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={32} className="text-cyan-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Analytics Dashboard</h2>
          <p className="text-slate-500">Advanced analytics coming soon...</p>
        </div>
      </div>
    </div>
  );
}
