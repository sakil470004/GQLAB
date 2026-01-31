export interface Shipment {
  id: string;
  shipmentId: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled' | 'delayed';
  trackingNumber: string;
  weight: number;
  rate: number;
  isFlagged: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export type ViewMode = 'grid' | 'tile';
