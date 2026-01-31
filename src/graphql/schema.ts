export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type Shipment {
    id: ID!
    shipmentId: String!
    shipperName: String!
    carrierName: String!
    pickupLocation: String!
    deliveryLocation: String!
    pickupDate: String!
    deliveryDate: String!
    status: String!
    trackingNumber: String!
    weight: Float!
    rate: Float!
    isFlagged: Boolean!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type ShipmentConnection {
    shipments: [Shipment!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input ShipmentInput {
    shipperName: String!
    carrierName: String!
    pickupLocation: String!
    deliveryLocation: String!
    pickupDate: String!
    deliveryDate: String!
    status: String
    trackingNumber: String!
    weight: Float!
    rate: Float!
    notes: String
  }

  input ShipmentUpdateInput {
    shipperName: String
    carrierName: String
    pickupLocation: String
    deliveryLocation: String
    pickupDate: String
    deliveryDate: String
    status: String
    trackingNumber: String
    weight: Float
    rate: Float
    isFlagged: Boolean
    notes: String
  }

  input ShipmentFilter {
    status: String
    shipperName: String
    carrierName: String
    search: String
  }

  enum SortOrder {
    ASC
    DESC
  }

  input SortInput {
    field: String!
    order: SortOrder!
  }

  type Query {
    me: User
    shipments(
      filter: ShipmentFilter
      sort: SortInput
      page: Int
      limit: Int
    ): ShipmentConnection!
    shipment(id: ID!): Shipment
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    demoLogin(role: String!): AuthPayload!
    createShipment(input: ShipmentInput!): Shipment!
    updateShipment(id: ID!, input: ShipmentUpdateInput!): Shipment!
    deleteShipment(id: ID!): Boolean!
    flagShipment(id: ID!, flagged: Boolean!): Shipment!
    seedData: Boolean!
  }
`;
