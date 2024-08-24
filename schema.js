const { buildSchema, GraphQLError } = require("graphql");
const axios = require("axios");
const { NetworkError } = require("graphql-http");
const { options } = require("ruru/cli");

const schema = buildSchema(`
  enum ErrorType {
    NETWORK_ERROR
    GRAPHQL_ERROR
  }

  type Error {
    message: String
    type: ErrorType
  }


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
    filteredItems(id: Int, name: String, state: String): [Item]
    item(id: Int): Item
    states: [String]
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
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(error.response.data);
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new GraphQLError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
  filteredItems: ({ id, name, state }) => {
    let url = "http://localhost:8080/items";

    return axios
      .get(url)
      .then((res) => {
        return res.data.filter((item) => {
          const matchesId = id ? item?.itemId.toString().includes(id) : true;
          const matchesName = name ? item?.itemName.toLowerCase().includes(name.toLowerCase()) : true;
          const matchesState = state ? item?.location?.state.toLowerCase().includes(state.toLowerCase()) : true;

          return matchesId && matchesName && matchesState;
        });
      }
      )
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(error.response.data);
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new GraphQLError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
  item: ({ id }) => {
    return axios
      .get(`http://localhost:8080/items/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(JSON.stringify(error.response.data));
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new NetworkError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
  states: () => {
    return axios
      .get("http://localhost:8080/items")
      .then((res) => [
          ...new Set(res.data.map((item) => item.location.state))
      ])
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(error.response.data);
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new NetworkError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
  addItem: ({ newItem }) => {
    // console.log("newitem: " + newItem);
    return axios
      .post("http://localhost:8080/items", newItem)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(error.response.data);
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new NetworkError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
  updateItem: ({ id, newItem }) => {
    return axios
      .patch(`http://localhost:8080/items/${id}`, newItem)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(error.response.data);
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new NetworkError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
  deleteItem: ({ id }) => {
    return axios
      .delete(`http://localhost:8080/items/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            throw new GraphQLError(
              "Cannot connect with server, please try again later",
              { extensions: { code: "NETWORK_ERROR" } }
            );
          }
          throw new GraphQLError(error.response.data);
        } else if (error.request) {
          throw new GraphQLError(
            "Cannot connect with server, please try again later",
            { extensions: { code: "NETWORK_ERROR" } }
          );
        } else {
          throw new NetworkError(
            "Unexpected server error, please try again later"
          );
        }
      });
  },
};

module.exports = { schema, root };
