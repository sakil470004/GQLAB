'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import TopNav from '@/components/layout/TopNav';
import ShipmentGrid from '@/components/shipments/ShipmentGrid';
import ShipmentTiles from '@/components/shipments/ShipmentTiles';
import ShipmentDetail from '@/components/shipments/ShipmentDetail';
import ShipmentForm from '@/components/shipments/ShipmentForm';
import { Shipment, ViewMode } from '@/types';
import { graphqlRequest } from '@/lib/graphql-client';
import {
  GET_SHIPMENTS_QUERY,
  CREATE_SHIPMENT_QUERY,
  UPDATE_SHIPMENT_QUERY,
  DELETE_SHIPMENT_QUERY,
  FLAG_SHIPMENT_QUERY,
  SEED_DATA_QUERY,
} from '@/lib/queries';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface ShipmentsResponse {
  shipments: {
    shipments: Shipment[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function ShipmentsPage() {
  const { isAdmin, user } = useAuth();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<ViewMode>('tile');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await graphqlRequest<ShipmentsResponse>(GET_SHIPMENTS_QUERY, {
        page,
        limit,
        sort: { field: sortField, order: sortOrder },
        filter: {
          ...(filterStatus && { status: filterStatus }),
          ...(searchTerm && { search: searchTerm }),
        },
      });
      setShipments(data?.shipments?.shipments || []);
      setTotalCount(data?.shipments?.totalCount || 0);
      setHasNextPage(data?.shipments?.hasNextPage || false);
      setHasPreviousPage(data?.shipments?.hasPreviousPage || false);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchShipments();
    }
  }, [user, page, sortField, sortOrder, filterStatus, searchTerm]);

  useEffect(() => {
    if (searchParams.get('action') === 'new' && isAdmin) {
      setShowForm(true);
    }
  }, [searchParams, isAdmin]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  const handleCreate = async (formData: Record<string, unknown>) => {
    await graphqlRequest(CREATE_SHIPMENT_QUERY, {
      input: {
        ...formData,
        trackingNumber: `TRK${Date.now().toString(36).toUpperCase()}`,
      },
    });
    setShowForm(false);
    fetchShipments();
  };

  const handleUpdate = async (formData: Record<string, unknown>) => {
    if (!editingShipment) return;
    await graphqlRequest(UPDATE_SHIPMENT_QUERY, {
      id: editingShipment.id,
      input: formData,
    });
    setEditingShipment(null);
    fetchShipments();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      await graphqlRequest(DELETE_SHIPMENT_QUERY, { id });
      fetchShipments();
    }
  };

  const handleFlag = async (id: string, flagged: boolean) => {
    await graphqlRequest(FLAG_SHIPMENT_QUERY, { id, flagged });
    fetchShipments();
  };

  const handleSeedData = async () => {
    await graphqlRequest(SEED_DATA_QUERY);
    fetchShipments();
  };

  if (shipments.length === 0 && !loading && !filterStatus && !searchTerm) {
    return (
      <div>
        <TopNav viewMode={viewMode} onViewModeChange={setViewMode} showViewToggle />
        <div className="p-6">
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No shipments yet</h3>
            <p className="text-slate-500 mb-6">Get started by loading sample data or creating your first shipment</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSeedData}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
              >
                Load Sample Data
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Create Shipment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNav viewMode={viewMode} onViewModeChange={setViewMode} showViewToggle />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shipments</h1>
            <p className="text-slate-500">{totalCount} total shipments</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className="appearance-none px-4 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Create Button (Admin only) */}
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Shipment</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && shipments.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Grid or Tile View */}
            {viewMode === 'grid' ? (
              <ShipmentGrid
                shipments={shipments}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={setEditingShipment}
                onDelete={handleDelete}
                onFlag={handleFlag}
                onRowClick={setSelectedShipment}
                isAdmin={isAdmin}
              />
            ) : (
              <ShipmentTiles
                shipments={shipments}
                onEdit={setEditingShipment}
                onDelete={handleDelete}
                onFlag={handleFlag}
                onView={setSelectedShipment}
                isAdmin={isAdmin}
              />
            )}

            {/* Pagination */}
            {totalCount > 0 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-slate-500">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPreviousPage}
                    className="p-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-slate-700">
                    Page {page}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNextPage}
                    className="p-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedShipment && (
        <ShipmentDetail
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}

      {/* Create/Edit Form Modal */}
      {(showForm || editingShipment) && (
        <ShipmentForm
          shipment={editingShipment}
          onSubmit={editingShipment ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingShipment(null);
          }}
        />
      )}
    </div>
  );
}
