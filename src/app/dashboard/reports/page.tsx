'use client';

import TopNav from '@/components/layout/TopNav';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Reports</h1>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={32} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Reports & Analytics</h2>
          <p className="text-slate-500">Detailed reports and analytics coming soon...</p>
        </div>
      </div>
    </div>
  );
}
