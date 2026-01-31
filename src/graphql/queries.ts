import { gql } from '@apollo/client';

export const DEMO_LOGIN = gql`
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

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
    }
  }
`;

export const GET_SHIPMENTS = gql`
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

export const GET_SHIPMENT = gql`
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

export const CREATE_SHIPMENT = gql`
  mutation CreateShipment($input: ShipmentInput!) {
    createShipment(input: $input) {
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
    }
  }
`;

export const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: ShipmentUpdateInput!) {
    updateShipment(id: $id, input: $input) {
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
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

export const FLAG_SHIPMENT = gql`
  mutation FlagShipment($id: ID!, $flagged: Boolean!) {
    flagShipment(id: $id, flagged: $flagged) {
      id
      isFlagged
    }
  }
`;

export const SEED_DATA = gql`
  mutation SeedData {
    seedData
  }
`;
