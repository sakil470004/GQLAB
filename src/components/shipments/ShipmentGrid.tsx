'use client';

import { Shipment } from '@/types';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Flag, Edit, Trash2 } from 'lucide-react';

interface ShipmentGridProps {
  shipments: Shipment[];
  sortField: string;
  sortOrder: 'ASC' | 'DESC';
  onSort: (field: string) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
  onFlag: (id: string, flagged: boolean) => void;
  onRowClick: (shipment: Shipment) => void;
  isAdmin: boolean;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-transit': 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  delayed: 'bg-orange-100 text-orange-800',
};

export default function ShipmentGrid({
  shipments,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onFlag,
  onRowClick,
  isAdmin,
}: ShipmentGridProps) {
  const columns = [
    { key: 'shipmentId', label: 'ID' },
    { key: 'shipperName', label: 'Shipper' },
    { key: 'carrierName', label: 'Carrier' },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'deliveryLocation', label: 'Delivery' },
    { key: 'pickupDate', label: 'Pickup Date' },
    { key: 'status', label: 'Status' },
    { key: 'weight', label: 'Weight (lbs)' },
    { key: 'rate', label: 'Rate ($)' },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortOrder === 'ASC' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.key !== 'actions' && onSort(col.key)}
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                  col.key !== 'actions' ? 'cursor-pointer hover:bg-slate-100' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  <SortIcon field={col.key} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {shipments.map((shipment) => (
            <tr
              key={shipment.id}
              onClick={() => onRowClick(shipment)}
              className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                shipment.isFlagged ? 'bg-red-50' : ''
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-slate-900">
                {shipment.shipmentId}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{shipment.shipperName}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{shipment.carrierName}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{shipment.pickupLocation}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{shipment.deliveryLocation}</td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {format(new Date(shipment.pickupDate), 'MMM dd, yyyy')}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[shipment.status]
                  }`}
                >
                  {shipment.status.replace('-', ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{shipment.weight}</td>
              <td className="px-4 py-3 text-sm text-slate-700">${shipment.rate.toFixed(2)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onFlag(shipment.id, !shipment.isFlagged)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      shipment.isFlagged
                        ? 'text-red-600 bg-red-100 hover:bg-red-200'
                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={shipment.isFlagged ? 'Remove flag' : 'Flag shipment'}
                  >
                    <Flag size={16} />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(shipment)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(shipment.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
