export const DEMO_LOGIN_QUERY = `
  mutation DemoLogin($role: String!) {
    demoLogin(role: $role) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const GET_ME_QUERY = `
  query GetMe {
    me {
      id
      email
      name
      role
    }
  }
`;

export const GET_SHIPMENTS_QUERY = `
  query GetShipments($filter: ShipmentFilter, $sort: SortInput, $page: Int, $limit: Int) {
    shipments(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      shipments {
        id
        shipmentId
        shipperName
        carrierName
        pickupLocation
        deliveryLocation
        pickupDate
        deliveryDate
        status
        trackingNumber
        weight
        rate
        isFlagged
        notes
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_SHIPMENT_QUERY = `
  query GetShipment($id: ID!) {
    shipment(id: $id) {
      id
      shipmentId
      shipperName
      carrierName
      pickupLocation
      deliveryLocation
      pickupDate
      deliveryDate
      status
      trackingNumber
      weight
      rate
      isFlagged
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SHIPMENT_QUERY = `
  mutation CreateShipment($input: ShipmentInput!) {
    createShipment(input: $input) {
      id
      shipmentId
    }
  }
`;

export const UPDATE_SHIPMENT_QUERY = `
  mutation UpdateShipment($id: ID!, $input: ShipmentUpdateInput!) {
    updateShipment(id: $id, input: $input) {
      id
      shipmentId
    }
  }
`;

export const DELETE_SHIPMENT_QUERY = `
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

export const FLAG_SHIPMENT_QUERY = `
  mutation FlagShipment($id: ID!, $flagged: Boolean!) {
    flagShipment(id: $id, flagged: $flagged) {
      id
      isFlagged
    }
  }
`;

export const SEED_DATA_QUERY = `
  mutation SeedData {
    seedData
  }
`;
