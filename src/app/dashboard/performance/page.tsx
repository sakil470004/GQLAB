'use client';

import TopNav from '@/components/layout/TopNav';
import { TrendingUp } from 'lucide-react';

export default function PerformancePage() {
  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Performance</h1>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Performance Metrics</h2>
          <p className="text-slate-500">Performance tracking coming soon...</p>
        </div>
      </div>
    </div>
  );
}
