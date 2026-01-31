'use client';

import { useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import { Search, MapPin, Package, Truck, CheckCircle, Clock, AlertTriangle, X, Calendar, DollarSign, Weight, FileText } from 'lucide-react';
import { graphqlRequest } from '@/lib/graphql-client';
import { TRACK_SHIPMENT_QUERY } from '@/lib/queries';
import { motion, AnimatePresence } from 'framer-motion';

interface Shipment {
  id: string;
  shipmentId: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  status: string;
  trackingNumber: string;
  weight: number;
  rate: number;
  isFlagged: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock, label: 'Pending' },
  'picked-up': { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Package, label: 'Picked Up' },
  'in-transit': { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Truck, label: 'In Transit' },
  delivered: { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle, label: 'Delivered' },
  delayed: { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, label: 'Delayed' },
  cancelled: { color: 'text-red-600', bgColor: 'bg-red-100', icon: X, label: 'Cancelled' },
};

const trackingSteps = [
  { status: 'pending', label: 'Order Placed', description: 'Shipment has been created' },
  { status: 'picked-up', label: 'Picked Up', description: 'Package collected from shipper' },
  { status: 'in-transit', label: 'In Transit', description: 'Package is on the way' },
  { status: 'delivered', label: 'Delivered', description: 'Package delivered to destination' },
];

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const data = await graphqlRequest<{ trackShipment: Shipment | null }>(
        TRACK_SHIPMENT_QUERY,
        { trackingNumber: trackingNumber.trim() }
      );
      setShipment(data.trackShipment);
      if (!data.trackShipment) {
        setError('No shipment found with this tracking number');
      }
    } catch (err) {
      setError('Failed to track shipment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepStatus: string) => {
    const statusOrder = ['pending', 'picked-up', 'in-transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(shipment?.status || '');
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (shipment?.status === 'cancelled' || shipment?.status === 'delayed') {
      return stepIndex <= 0 ? 'completed' : 'pending';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const config = shipment ? statusConfig[shipment.status] || statusConfig.pending : null;
  const StatusIcon = config?.icon || Package;

  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Shipment Tracking</h1>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Track Your Shipment</h2>
            <p className="text-slate-500 mb-6">Enter your tracking number or shipment ID to get real-time updates</p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="Enter tracking number or shipment ID (e.g., TRK-12345 or SHP-001)"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Track'
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-500 mt-4 text-sm">{error}</p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {shipment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Status Header */}
              <div className={`${config?.bgColor} rounded-xl p-6 mb-6`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center ${config?.color}`}>
                      <StatusIcon size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Current Status</p>
                      <h3 className={`text-2xl font-bold ${config?.color}`}>{config?.label}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Tracking Number</p>
                    <p className="text-lg font-mono font-semibold text-slate-900">{shipment.trackingNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Tracking Timeline */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Tracking Progress</h3>

                  <div className="relative">
                    {trackingSteps.map((step, index) => {
                      const status = getStepStatus(step.status);
                      const isCompleted = status === 'completed';
                      const isCurrent = status === 'current';

                      return (
                        <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                          {/* Timeline Line */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : isCurrent
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'bg-white border-slate-300 text-slate-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle size={20} />
                              ) : (
                                <span className="text-sm font-semibold">{index + 1}</span>
                              )}
                            </div>
                            {index < trackingSteps.length - 1 && (
                              <div
                                className={`w-0.5 flex-1 mt-2 ${
                                  isCompleted ? 'bg-green-500' : 'bg-slate-200'
                                }`}
                              />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pt-1.5">
                            <h4
                              className={`font-semibold ${
                                isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                            {isCurrent && (
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                Current Step
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Special Status Display */}
                    {(shipment.status === 'delayed' || shipment.status === 'cancelled') && (
                      <div className="mt-4 p-4 rounded-lg border-2 border-dashed border-red-200 bg-red-50">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="text-red-500" size={24} />
                          <div>
                            <p className="font-semibold text-red-700">
                              {shipment.status === 'delayed' ? 'Shipment Delayed' : 'Shipment Cancelled'}
                            </p>
                            <p className="text-sm text-red-600">
                              {shipment.notes || 'Contact support for more information'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Shipment Details</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Shipment ID</p>
                      <p className="font-semibold text-slate-900">{shipment.shipmentId}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">From</p>
                      <p className="font-medium text-slate-900">{shipment.shipperName}</p>
                      <p className="text-sm text-slate-600">{shipment.pickupLocation}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">To</p>
                      <p className="font-medium text-slate-900">{shipment.deliveryLocation}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Carrier</p>
                      <p className="font-medium text-slate-900">{shipment.carrierName}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Calendar size={14} />
                          <p className="text-xs uppercase tracking-wide">Pickup</p>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{formatDate(shipment.pickupDate)}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Calendar size={14} />
                          <p className="text-xs uppercase tracking-wide">Delivery</p>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{formatDate(shipment.deliveryDate)}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Weight size={14} />
                          <p className="text-xs uppercase tracking-wide">Weight</p>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{shipment.weight} lbs</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <DollarSign size={14} />
                          <p className="text-xs uppercase tracking-wide">Rate</p>
                        </div>
                        <p className="text-sm font-medium text-slate-900">${shipment.rate.toFixed(2)}</p>
                      </div>
                    </div>

                    {shipment.notes && (
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <FileText size={14} />
                          <p className="text-xs uppercase tracking-wide">Notes</p>
                        </div>
                        <p className="text-sm text-slate-700">{shipment.notes}</p>
                      </div>
                    )}

                    {shipment.isFlagged && (
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                          <AlertTriangle size={16} className="text-red-500" />
                          <span className="text-sm font-medium text-red-700">Flagged for Review</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results Message */}
        {searched && !shipment && !loading && !error && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
              <Package size={48} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Shipment Found</h3>
              <p className="text-slate-500">
                We couldn&apos;t find a shipment with that tracking number. Please check and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
