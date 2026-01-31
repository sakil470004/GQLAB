'use client';

import { Shipment } from '@/types';
import { format } from 'date-fns';
import { X, MapPin, Truck, Calendar, Package, DollarSign, Flag, FileText } from 'lucide-react';

interface ShipmentDetailProps {
  shipment: Shipment;
  onClose: () => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'in-transit': { bg: 'bg-blue-100', text: 'text-blue-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  delayed: { bg: 'bg-orange-100', text: 'text-orange-800' },
};

export default function ShipmentDetail({ shipment, onClose }: ShipmentDetailProps) {
  const colors = statusColors[shipment.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <p className="text-sm text-slate-500">Shipment Details</p>
            <h2 className="text-xl font-bold text-slate-900">{shipment.shipmentId}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Flag */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${colors.bg} ${colors.text}`}>
              {shipment.status.replace('-', ' ')}
            </span>
            {shipment.isFlagged && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-800">
                <Flag size={14} /> Flagged
              </span>
            )}
          </div>

          {/* Route Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Route Information</h3>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="w-0.5 h-16 bg-slate-300" />
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Pickup Location</p>
                  <p className="font-medium text-slate-900">{shipment.pickupLocation}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {format(new Date(shipment.pickupDate), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Delivery Location</p>
                  <p className="font-medium text-slate-900">{shipment.deliveryLocation}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {format(new Date(shipment.deliveryDate), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Truck size={18} />
                <span className="text-xs font-medium uppercase">Carrier</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{shipment.carrierName}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Package size={18} />
                <span className="text-xs font-medium uppercase">Shipper</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{shipment.shipperName}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Package size={18} />
                <span className="text-xs font-medium uppercase">Weight</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{shipment.weight} lbs</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <DollarSign size={18} />
                <span className="text-xs font-medium uppercase">Rate</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">${shipment.rate.toFixed(2)}</p>
            </div>
          </div>

          {/* Tracking Number */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MapPin size={18} />
              <span className="text-xs font-medium uppercase">Tracking Number</span>
            </div>
            <p className="text-lg font-mono font-semibold text-slate-900">{shipment.trackingNumber}</p>
          </div>

          {/* Notes */}
          {shipment.notes && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <FileText size={18} />
                <span className="text-xs font-medium uppercase">Notes</span>
              </div>
              <p className="text-slate-700">{shipment.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
            <span>Created: {format(new Date(shipment.createdAt), 'MMM dd, yyyy HH:mm')}</span>
            <span>Updated: {format(new Date(shipment.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
