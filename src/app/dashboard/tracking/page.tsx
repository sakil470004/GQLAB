'use client';

import TopNav from '@/components/layout/TopNav';
import { Search, MapPin } from 'lucide-react';

export default function TrackingPage() {
  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Shipment Tracking</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Track Your Shipment</h2>
            <p className="text-slate-500 mb-6">Enter your tracking number to get real-time updates</p>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter tracking number..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
