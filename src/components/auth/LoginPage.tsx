'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Truck, Shield, User } from 'lucide-react';

export default function LoginPage() {
  const { demoLogin } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDemoLogin = async (role: 'admin' | 'employee') => {
    setLoading(role);
    setError('');
    try {
      await demoLogin(role);
      window.location.href = '/dashboard';
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">GQLAB</h1>
          <p className="text-blue-200 mt-2">Shipment Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-center mb-8">Choose a demo account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Admin Login */}
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Shield size={24} className="text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-slate-900">Demo Admin</p>
                <p className="text-sm text-slate-500">Full access to all features</p>
              </div>
              {loading === 'admin' && (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>

            {/* Employee Login */}
            <button
              onClick={() => handleDemoLogin('employee')}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <User size={24} className="text-green-600" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-slate-900">Demo Employee</p>
                <p className="text-sm text-slate-500">View & flag shipments only</p>
              </div>
              {loading === 'employee' && (
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>

          {/* Permissions Info */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Role Permissions:</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium text-blue-600 mb-1">Admin</p>
                <ul className="text-slate-500 space-y-1">
                  <li>• View all shipments</li>
                  <li>• Create shipments</li>
                  <li>• Edit shipments</li>
                  <li>• Delete shipments</li>
                  <li>• Flag shipments</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-600 mb-1">Employee</p>
                <ul className="text-slate-500 space-y-1">
                  <li>• View all shipments</li>
                  <li>• Flag shipments</li>
                  <li className="text-slate-300">• Cannot create</li>
                  <li className="text-slate-300">• Cannot edit</li>
                  <li className="text-slate-300">• Cannot delete</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200 text-sm mt-8">
          © 2024 GQLAB. All rights reserved.
        </p>
      </div>
    </div>
  );
}
