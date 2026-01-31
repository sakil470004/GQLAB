'use client';

import { Shipment } from '@/types';
import { format } from 'date-fns';
import {
  MapPin,
  Truck,
  Calendar,
  MoreVertical,
  Flag,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { useState } from 'react';

interface ShipmentTilesProps {
  shipments: Shipment[];
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
  onFlag: (id: string, flagged: boolean) => void;
  onView: (shipment: Shipment) => void;
  isAdmin: boolean;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'in-transit': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  delayed: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
};

function ShipmentTile({
  shipment,
  onEdit,
  onDelete,
  onFlag,
  onView,
  isAdmin,
}: {
  shipment: Shipment;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
  onFlag: (id: string, flagged: boolean) => void;
  onView: (shipment: Shipment) => void;
  isAdmin: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const colors = statusColors[shipment.status];

  return (
    <div
      onClick={() => onView(shipment)}
      className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-blue-300 ${
        shipment.isFlagged ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
      }`}
    >
      {/* Flag indicator */}
      {shipment.isFlagged && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <Flag size={12} className="text-white" />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Shipment ID</p>
            <p className="font-semibold text-slate-900">{shipment.shipmentId}</p>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-10 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(shipment);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <Eye size={16} /> View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFlag(shipment.id, !shipment.isFlagged);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <Flag size={16} /> {shipment.isFlagged ? 'Remove Flag' : 'Flag'}
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(shipment);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(shipment.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
          {shipment.status.replace('-', ' ')}
        </div>

        {/* Route */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="text-sm text-slate-700">{shipment.pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500">To</p>
              <p className="text-sm text-slate-700">{shipment.deliveryLocation}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-slate-400" />
            <span className="text-xs text-slate-600">{shipment.carrierName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-xs text-slate-600">
              {format(new Date(shipment.pickupDate), 'MMM dd')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">{shipment.weight} lbs</span>
          <span className="text-lg font-semibold text-slate-900">${shipment.rate.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ShipmentTiles({
  shipments,
  onEdit,
  onDelete,
  onFlag,
  onView,
  isAdmin,
}: ShipmentTilesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {shipments.map((shipment) => (
        <ShipmentTile
          key={shipment.id}
          shipment={shipment}
          onEdit={onEdit}
          onDelete={onDelete}
          onFlag={onFlag}
          onView={onView}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
