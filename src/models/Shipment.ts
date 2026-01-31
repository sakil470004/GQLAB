import mongoose, { Schema, Document } from 'mongoose';

export interface IShipment extends Document {
  shipmentId: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: Date;
  deliveryDate: Date;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled' | 'delayed';
  trackingNumber: string;
  weight: number;
  rate: number;
  isFlagged: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    shipmentId: { type: String, required: true, unique: true },
    shipperName: { type: String, required: true },
    carrierName: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-transit', 'delivered', 'cancelled', 'delayed'],
      default: 'pending',
    },
    trackingNumber: { type: String, required: true },
    weight: { type: Number, required: true },
    rate: { type: Number, required: true },
    isFlagged: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Shipment = mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);
