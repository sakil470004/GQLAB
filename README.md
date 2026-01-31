# 🚚 GQLAB - Shipment Management System

A modern, full-stack Shipment Management System built with Next.js 16, GraphQL, and MongoDB. This application helps logistics companies manage shipments, track deliveries, and streamline their transportation operations.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098?style=flat-square&logo=graphql)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Demo Login** - Quick access with pre-configured admin and employee accounts
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Two roles with different permissions:
  - **Admin**: Full CRUD operations (Create, Read, Update, Delete)
  - **Employee**: View and flag shipments only

### 📦 Shipment Management
- **Grid View** - 10-column data table with sorting and filtering
- **Tile View** - Card-based visual layout for quick overview
- **Detail View** - Comprehensive shipment information in modal
- **CRUD Operations** - Create, edit, delete, and flag shipments
- **Status Tracking** - Track shipment status (Pending, Picked Up, In Transit, Delivered, Cancelled)
- **Search & Filter** - Find shipments by ID, shipper, carrier, or location
- **Pagination** - Efficient data loading with page navigation

### 🎨 User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Hamburger Menu** - Collapsible sidebar navigation with submenus
- **Horizontal Navigation** - Quick access toolbar with view toggles
- **Professional Theme** - Clean, modern color scheme
- **Smooth Animations** - Framer Motion transitions

### 📊 Dashboard
- **Statistics Overview** - Total, delivered, in-transit, and flagged shipments
- **Quick Actions** - Seed sample data, navigate to shipments
- **Real-time Updates** - Data refreshes on actions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router & Turbopack |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Beautiful icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **GraphQL** | API query language |
| **Apollo Server** | GraphQL server implementation |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | JSON Web Token authentication |
| **bcryptjs** | Password hashing |

### Development
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **Turbopack** | Fast bundler |
| **Node.js 18+** | JavaScript runtime |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tms-app.git
   cd tms-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB connection string and JWT secret.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login

Click one of the demo login buttons on the home page:
- **Login as Admin** - Full access to all features
- **Login as Employee** - View and flag only

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection String
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/tmsapp

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_URL` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing | ✅ Yes |

---

## 📁 Project Structure

```
tms-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   └── graphql/        # GraphQL API endpoint
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── shipments/      # Shipment management
│   │   │   ├── tracking/       # Shipment tracking
│   │   │   ├── reports/        # Reports & analytics
│   │   │   ├── settings/       # User settings
│   │   │   ├── users/          # User management (admin)
│   │   │   ├── carriers/       # Carrier management (admin)
│   │   │   ├── analytics/      # Analytics dashboard
│   │   │   └── performance/    # Performance metrics
│   │   └── page.tsx            # Login page
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx   # Demo login component
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx     # Hamburger menu
│   │   │   └── TopNav.tsx      # Horizontal navigation
│   │   └── shipments/
│   │       ├── ShipmentGrid.tsx    # Data grid view
│   │       ├── ShipmentTiles.tsx   # Card tile view
│   │       ├── ShipmentDetail.tsx  # Detail modal
│   │       └── ShipmentForm.tsx    # Create/edit form
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   │
│   ├── graphql/
│   │   ├── schema.ts           # GraphQL type definitions
│   │   └── resolvers.ts        # GraphQL resolvers
│   │
│   ├── lib/
│   │   ├── mongodb.ts          # Database connection
│   │   ├── graphql-client.ts   # GraphQL client
│   │   └── queries.ts          # GraphQL queries
│   │
│   └── models/
│       ├── Shipment.ts         # Shipment model
│       └── User.ts             # User model
│
├── .env                        # Environment variables
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 📡 API Documentation

### GraphQL Endpoint

```
POST /api/graphql
```

### Queries

| Query | Description | Auth Required |
|-------|-------------|---------------|
| `shipments` | Get paginated shipments | ✅ Yes |
| `shipment(id)` | Get single shipment | ✅ Yes |
| `me` | Get current user | ✅ Yes |

### Mutations

| Mutation | Description | Role Required |
|----------|-------------|---------------|
| `demoLogin(role)` | Demo login | ❌ No |
| `login(email, password)` | User login | ❌ No |
| `createShipment(input)` | Create shipment | Admin |
| `updateShipment(id, input)` | Update shipment | Admin |
| `deleteShipment(id)` | Delete shipment | Admin |
| `flagShipment(id, isFlagged)` | Flag shipment | Employee+ |
| `seedData` | Seed sample data | Admin |

### Example Query

```graphql
query GetShipments {
  shipments(page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc") {
    shipments {
      id
      shipmentId
      shipperName
      carrierName
      status
      pickupLocation
      deliveryLocation
    }
    totalCount
    totalPages
  }
}
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/sakil470004/GQLAB.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   - `DB_URL` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key

4. **Deploy**
   - Click Deploy
   - Wait for build to complete

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

---

## 📄 Shipment Data Model

| Field | Type | Description |
|-------|------|-------------|
| `shipmentId` | String | Unique shipment identifier (e.g., SHP-001) |
| `shipperName` | String | Name of the shipper company |
| `carrierName` | String | Name of the carrier company |
| `pickupLocation` | String | Pickup address |
| `deliveryLocation` | String | Delivery address |
| `pickupDate` | Date | Scheduled pickup date |
| `deliveryDate` | Date | Scheduled delivery date |
| `status` | Enum | Pending, Picked Up, In Transit, Delivered, Cancelled |
| `trackingNumber` | String | Carrier tracking number |
| `weight` | Number | Shipment weight in lbs |
| `rate` | Number | Shipping rate in USD |
| `isFlagged` | Boolean | Flag for attention |
| `notes` | String | Additional notes |

---

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Role-based access control on all mutations
- Environment variables for sensitive data
- CORS configured for API protection

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ using Next.js, GraphQL, and MongoDB

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL implementation
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
