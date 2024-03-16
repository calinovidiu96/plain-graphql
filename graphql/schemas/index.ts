import { buildSchema } from "graphql";

const schema = `#graphql
############### PRODUCTS ###############

  type Product {
    _id: ID!
    vintage: String!
    name: String!
    producer: Producer
    color: String
    quantity: Int
    format: String
    price: Float
    duty: String
    availability: String
    conditions: String
    imageUrl: String
  }

  input CreateProductInput {
    vintage: String!
    name: String!
    producerId: ID!
    color: String!
    quantity: Int!
    format: String!
    price: Float!
    duty: String!
    availability: String!
    conditions: String
    imageUrl: String
  }

  input UpdateProductInput {
    id: ID!
    vintage: String
    name: String
    color: String
    quantity: Int
    format: String
    price: Float
    duty: String
    availability: String
    conditions: String
    imageUrl: String
  }

  ############### PRODUCERS ###############

  type Producer {
    _id: ID!
    name: String!
    country: String
    region: String
  }

  input CreateProducerInput {
    name: String!
    country: String
    region: String
  }

  scalar Upload

  type SuccessResult {
    success: Boolean!
    message: String
  }

  type Query {
    getProduct(id: ID!): Product
    getProductsByProducerId(producerId: ID!): [Product!]!
  }

  type Mutation {
    createProducts(products: [CreateProductInput!]!): [Product]!
    updateProduct(updateProductInput: UpdateProductInput!): Product
    deleteProducts(_ids: [ID]!): [ID]!
    createProducer(input: CreateProducerInput!): Producer!
    uploadDocument(file: Upload!): SuccessResult

  }
`;

export default buildSchema(schema);
