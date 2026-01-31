'use client';

import { useAuth } from '@/context/AuthContext';
import TopNav from '@/components/layout/TopNav';
import { graphqlRequest } from '@/lib/graphql-client';
import { GET_SHIPMENTS_QUERY, SEED_DATA_QUERY } from '@/lib/queries';
import { Package, Truck, DollarSign, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ShipmentData {
  status: string;
  rate: number;
}

interface ShipmentsResponse {
  shipments: {
    shipments: ShipmentData[];
  };
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      if (!user) return;
      try {
        const data = await graphqlRequest<ShipmentsResponse>(GET_SHIPMENTS_QUERY, { limit: 100 });
        setShipments(data?.shipments?.shipments || []);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      }
      setLoading(false);
    };

    fetchShipments();
  }, [user]);

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in-transit').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    pending: shipments.filter((s) => s.status === 'pending').length,
    delayed: shipments.filter((s) => s.status === 'delayed').length,
    totalRevenue: shipments.reduce((sum, s) => sum + s.rate, 0),
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await graphqlRequest(SEED_DATA_QUERY);
      const data = await graphqlRequest<ShipmentsResponse>(GET_SHIPMENTS_QUERY, { limit: 100 });
      setShipments(data?.shipments?.shipments || []);
    } catch (error) {
      console.error('Failed to seed data:', error);
    }
    setSeeding(false);
  };

  return (
    <div>
      <TopNav />
      
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here&apos;s what&apos;s happening with your shipments today.
          </p>
        </div>

        {/* Seed Data Button (if no data) */}
        {shipments.length === 0 && !loading && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No shipments found</h3>
            <p className="text-blue-700 mb-4">Click below to load sample shipment data</p>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {seeding ? 'Loading...' : 'Load Sample Data'}
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Shipments</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Truck size={20} className="text-indigo-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.inTransit}</p>
            <p className="text-sm text-slate-500">In Transit</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.delivered}</p>
            <p className="text-sm text-slate-500">Delivered</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            <p className="text-sm text-slate-500">Pending</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.delayed}</p>
            <p className="text-sm text-slate-500">Delayed</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/shipments"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <Package size={20} className="text-blue-600" />
                <span className="font-medium text-slate-700">View All Shipments</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/shipments?action=new"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Truck size={20} className="text-green-600" />
                  <span className="font-medium text-slate-700">Create New Shipment</span>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Role</h3>
            <div className={`p-4 rounded-lg ${isAdmin ? 'bg-blue-50' : 'bg-green-50'}`}>
              <p className={`text-lg font-semibold ${isAdmin ? 'text-blue-700' : 'text-green-700'}`}>
                {isAdmin ? '🛡️ Administrator' : '👤 Employee'}
              </p>
              <p className={`text-sm mt-1 ${isAdmin ? 'text-blue-600' : 'text-green-600'}`}>
                {isAdmin
                  ? 'You have full access to manage all shipments'
                  : 'You can view and flag shipments'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
