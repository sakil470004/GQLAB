import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Shipment } from '@/models/Shipment';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

interface Context {
  user: { id: string; email: string; role: string } | null;
}

const dummyShipments = [
  { shipperName: 'Acme Corp', carrierName: 'FedEx', pickupLocation: 'New York, NY', deliveryLocation: 'Los Angeles, CA', pickupDate: new Date('2024-01-15'), deliveryDate: new Date('2024-01-20'), status: 'delivered', weight: 150, rate: 450.00, notes: 'Fragile electronics' },
  { shipperName: 'Global Tech', carrierName: 'UPS', pickupLocation: 'Chicago, IL', deliveryLocation: 'Miami, FL', pickupDate: new Date('2024-01-18'), deliveryDate: new Date('2024-01-23'), status: 'in-transit', weight: 200, rate: 520.00, notes: 'Machine parts' },
  { shipperName: 'FastMove Inc', carrierName: 'DHL', pickupLocation: 'Seattle, WA', deliveryLocation: 'Boston, MA', pickupDate: new Date('2024-01-20'), deliveryDate: new Date('2024-01-26'), status: 'pending', weight: 75, rate: 280.00, notes: 'Medical supplies' },
  { shipperName: 'Prime Logistics', carrierName: 'FedEx', pickupLocation: 'Dallas, TX', deliveryLocation: 'Phoenix, AZ', pickupDate: new Date('2024-01-22'), deliveryDate: new Date('2024-01-25'), status: 'in-transit', weight: 320, rate: 680.00, notes: 'Auto parts' },
  { shipperName: 'QuickShip Co', carrierName: 'USPS', pickupLocation: 'Denver, CO', deliveryLocation: 'Atlanta, GA', pickupDate: new Date('2024-01-25'), deliveryDate: new Date('2024-01-30'), status: 'pending', weight: 45, rate: 120.00, notes: 'Documents' },
  { shipperName: 'Metro Freight', carrierName: 'UPS', pickupLocation: 'San Francisco, CA', deliveryLocation: 'Portland, OR', pickupDate: new Date('2024-01-12'), deliveryDate: new Date('2024-01-14'), status: 'delivered', weight: 180, rate: 340.00, notes: 'Retail goods' },
  { shipperName: 'Express Haul', carrierName: 'DHL', pickupLocation: 'Houston, TX', deliveryLocation: 'Nashville, TN', pickupDate: new Date('2024-01-28'), deliveryDate: new Date('2024-02-02'), status: 'delayed', weight: 250, rate: 490.00, notes: 'Furniture' },
  { shipperName: 'Swift Trans', carrierName: 'FedEx', pickupLocation: 'Philadelphia, PA', deliveryLocation: 'Detroit, MI', pickupDate: new Date('2024-01-30'), deliveryDate: new Date('2024-02-03'), status: 'pending', weight: 95, rate: 210.00, notes: 'Electronics' },
  { shipperName: 'Reliable Cargo', carrierName: 'UPS', pickupLocation: 'Minneapolis, MN', deliveryLocation: 'St. Louis, MO', pickupDate: new Date('2024-01-10'), deliveryDate: new Date('2024-01-12'), status: 'delivered', weight: 400, rate: 850.00, notes: 'Industrial equipment' },
  { shipperName: 'National Shipping', carrierName: 'DHL', pickupLocation: 'Las Vegas, NV', deliveryLocation: 'Salt Lake City, UT', pickupDate: new Date('2024-02-01'), deliveryDate: new Date('2024-02-05'), status: 'cancelled', weight: 60, rate: 150.00, notes: 'Cancelled by customer' },
  { shipperName: 'Coast to Coast', carrierName: 'FedEx', pickupLocation: 'San Diego, CA', deliveryLocation: 'Jacksonville, FL', pickupDate: new Date('2024-02-05'), deliveryDate: new Date('2024-02-12'), status: 'pending', weight: 500, rate: 1200.00, notes: 'Heavy machinery' },
  { shipperName: 'Blue Arrow Logistics', carrierName: 'USPS', pickupLocation: 'Orlando, FL', deliveryLocation: 'Charlotte, NC', pickupDate: new Date('2024-02-08'), deliveryDate: new Date('2024-02-11'), status: 'in-transit', weight: 30, rate: 85.00, notes: 'Small packages' },
];

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) return null;
      await connectDB();
      return User.findById(context.user.id);
    },

    shipments: async (
      _: unknown,
      args: {
        filter?: { status?: string; shipperName?: string; carrierName?: string; search?: string };
        sort?: { field: string; order: 'ASC' | 'DESC' };
        page?: number;
        limit?: number;
      },
      context: Context
    ) => {
      if (!context.user) throw new Error('Authentication required');
      
      await connectDB();
      
      const { filter, sort, page = 1, limit = 10 } = args;
      const query: Record<string, unknown> = {};

      if (filter) {
        if (filter.status) query.status = filter.status;
        if (filter.shipperName) query.shipperName = { $regex: filter.shipperName, $options: 'i' };
        if (filter.carrierName) query.carrierName = { $regex: filter.carrierName, $options: 'i' };
        if (filter.search) {
          query.$or = [
            { shipperName: { $regex: filter.search, $options: 'i' } },
            { carrierName: { $regex: filter.search, $options: 'i' } },
            { shipmentId: { $regex: filter.search, $options: 'i' } },
            { trackingNumber: { $regex: filter.search, $options: 'i' } },
            { pickupLocation: { $regex: filter.search, $options: 'i' } },
            { deliveryLocation: { $regex: filter.search, $options: 'i' } },
          ];
        }
      }

      const sortOption: Record<string, 1 | -1> = {};
      if (sort) {
        sortOption[sort.field] = sort.order === 'ASC' ? 1 : -1;
      } else {
        sortOption.createdAt = -1;
      }

      const skip = (page - 1) * limit;
      const totalCount = await Shipment.countDocuments(query);
      const shipments = await Shipment.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

      return {
        shipments,
        totalCount,
        hasNextPage: skip + shipments.length < totalCount,
        hasPreviousPage: page > 1,
      };
    },

    shipment: async (_: unknown, args: { id: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      await connectDB();
      return Shipment.findById(args.id);
    },

    trackShipment: async (_: unknown, args: { trackingNumber: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      await connectDB();
      
      // Search by tracking number or shipment ID
      const shipment = await Shipment.findOne({
        $or: [
          { trackingNumber: { $regex: args.trackingNumber, $options: 'i' } },
          { shipmentId: { $regex: args.trackingNumber, $options: 'i' } },
        ],
      });
      
      return shipment;
    },
  },

  Mutation: {
    login: async (_: unknown, args: { email: string; password: string }) => {
      await connectDB();
      const user = await User.findOne({ email: args.email });
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { token, user };
    },

    demoLogin: async (_: unknown, args: { role: string }) => {
      await connectDB();
      
      const email = args.role === 'admin' ? 'admin@gqlab.com' : 'employee@gqlab.com';
      let user = await User.findOne({ email });

      if (!user) {
        const hashedPassword = await bcrypt.hash('demo123', 10);
        user = await User.create({
          email,
          password: hashedPassword,
          name: args.role === 'admin' ? 'Admin User' : 'Employee User',
          role: args.role,
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { token, user };
    },

    createShipment: async (_: unknown, args: { input: Record<string, unknown> }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'admin') throw new Error('Admin access required');

      await connectDB();
      
      const shipmentId = `SHP-${Date.now().toString(36).toUpperCase()}`;
      const shipment = await Shipment.create({
        ...args.input,
        shipmentId,
        pickupDate: new Date(args.input.pickupDate as string),
        deliveryDate: new Date(args.input.deliveryDate as string),
      });

      return shipment;
    },

    updateShipment: async (
      _: unknown,
      args: { id: string; input: Record<string, unknown> },
      context: Context
    ) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'admin') throw new Error('Admin access required');

      await connectDB();
      
      const updateData = { ...args.input };
      if (updateData.pickupDate) updateData.pickupDate = new Date(updateData.pickupDate as string);
      if (updateData.deliveryDate) updateData.deliveryDate = new Date(updateData.deliveryDate as string);

      const shipment = await Shipment.findByIdAndUpdate(args.id, updateData, { new: true });
      if (!shipment) throw new Error('Shipment not found');

      return shipment;
    },

    deleteShipment: async (_: unknown, args: { id: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'admin') throw new Error('Admin access required');

      await connectDB();
      await Shipment.findByIdAndDelete(args.id);
      return true;
    },

    flagShipment: async (_: unknown, args: { id: string; flagged: boolean }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');

      await connectDB();
      const shipment = await Shipment.findByIdAndUpdate(
        args.id,
        { isFlagged: args.flagged },
        { new: true }
      );
      if (!shipment) throw new Error('Shipment not found');

      return shipment;
    },

    seedData: async () => {
      await connectDB();
      
      const count = await Shipment.countDocuments();
      if (count > 0) return true;

      for (const data of dummyShipments) {
        const shipmentId = `SHP-${uuidv4().slice(0, 8).toUpperCase()}`;
        const trackingNumber = `TRK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        
        await Shipment.create({
          ...data,
          shipmentId,
          trackingNumber,
        });
      }

      return true;
    },
  },

  Shipment: {
    id: (parent: { _id: string }) => parent._id.toString(),
    pickupDate: (parent: { pickupDate: Date }) => parent.pickupDate.toISOString(),
    deliveryDate: (parent: { deliveryDate: Date }) => parent.deliveryDate.toISOString(),
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
    updatedAt: (parent: { updatedAt: Date }) => parent.updatedAt.toISOString(),
  },

  User: {
    id: (parent: { _id: string }) => parent._id.toString(),
  },
};
