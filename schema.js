const { buildSchema, GraphQLError } = require("graphql");
const axios = require("axios");

const schema = buildSchema(`
  type Location {
    locationId: Int
    state: String
    address: String
    phoneNumber: String
  }

  type Item {
    itemId: Int
    itemName: String
    description: String
    location: Location
  }

  input LocationInput {
    locationId: Int!
    state: String!
    address: String
    phoneNumber: String
  }
    
  input ItemInput {
    itemId: Int!
    itemName: String!
    description: String
    location: LocationInput!
  }

  type Query {
    items(search: String): [Item]
    item(id: Int): Item
  }

  type Mutation {
    addItem(newItem: ItemInput!): Item
    updateItem(id: Int!,newItem: ItemInput!): Item
    deleteItem(id: Int!): Item
  }
`);

const root = {
  items: ({ search }) => {
    let url = "http://localhost:8080/items";
    if (search) {
      url += `?search=${search}`;
    }
    return axios
      .get(url)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          throw new GraphQLError(error.response.data);
        } else throw new GraphQLError(error.message);
      });
  },
  item: ({ id }) => {
    return axios
      .get(`http://localhost:8080/items/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          throw new GraphQLError(error.response.data);
        } else throw new GraphQLError(error.message);
      });
  },
  addItem: ({ newItem }) => {
    console.log("newitem: " + newItem);
    return axios
      .post("http://localhost:8080/items", newItem)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          throw new GraphQLError(error.response.data);
        } else throw new GraphQLError(error.message);
      });
  },

  updateItem: ({ id, newItem }) => {
    return axios
      .patch(`http://localhost:8080/items/${id}`, newItem)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          throw new GraphQLError(error.response.data);
        } else throw new GraphQLError(error.message);
      });
  },
  deleteItem: ({ id }) => {
    return axios
      .delete(`http://localhost:8080/items/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          throw new GraphQLError(error.response.data);
        } else throw new GraphQLError(error.message);
      });
  },
};

module.exports = { schema, root };
