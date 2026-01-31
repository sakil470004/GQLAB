'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, Grid3X3, LayoutGrid } from 'lucide-react';

interface TopNavProps {
  viewMode?: 'grid' | 'tile';
  onViewModeChange?: (mode: 'grid' | 'tile') => void;
  showViewToggle?: boolean;
}

const topNavItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Shipments', href: '/dashboard/shipments' },
  { label: 'Tracking', href: '/dashboard/tracking' },
  { label: 'Reports', href: '/dashboard/reports' },
];

export default function TopNav({ viewMode, onViewModeChange, showViewToggle }: TopNavProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Horizontal Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {topNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* View Toggle */}
          {showViewToggle && onViewModeChange && (
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => onViewModeChange('tile')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tile'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Tile View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
