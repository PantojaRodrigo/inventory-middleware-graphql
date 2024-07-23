const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const axios = require("axios");

// Definición de Location
const LocationType = new GraphQLObjectType({
  name: "Location",
  fields: {
    locationId: { type: GraphQLInt },
    state: { type: GraphQLString },
    address: { type: GraphQLString },
    phoneNumber: { type: GraphQLInt },
  },
});

// Definición de Item
const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: {
    itemId: { type: GraphQLInt },
    itemName: { type: GraphQLString },
    description: { type: GraphQLString },
    location: { type: LocationType },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    items: {
      type: new GraphQLList(ItemType),
      args: { search: { type: GraphQLString } },
      resolve(parent, args) {
        let url = "http://localhost:8080/items";
        if (args.search) {
          url += `?search=${args.search}`;
        }
        return axios.get(url).then((res) => res.data);
      },
    },
    item: {
      type: ItemType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:8080/items/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

// Mutaciones
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addItem: {
      type: ItemType,
      args: {
        itemId: { type: new GraphQLNonNull(GraphQLInt) },
        itemName: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        location: {
          locationId: { type: new GraphQLNonNull(GraphQLInt) },
          state: { type: new GraphQLNonNull(GraphQLString) },
          address: { type: GraphQLString },
          phoneNumber: { type: GraphQLString },
        },
      },
      resolve(parent, args) {
        return axios
          .post("http://localhost:8080/items", {
            itemName: args.itemId,
            itemName: args.itemName,
            description: args.description,
            location: args.location,
          })
          .then((res) => res.data);
      },
    },
    /* updateItem: {
      type: ItemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        itemName: { type: GraphQLString },
        description: { type: GraphQLString },
        locationId: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return axios
          .patch(`http://localhost:8080/items/${args.id}`, {
            itemName: args.itemName,
            description: args.description,
            locationId: args.locationId,
          })
          .then((res) => res.data);
      },
    },
    deleteItem: {
      type: ItemType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve(parent, args) {
        return axios
          .delete(`http://localhost:8080/items/${args.id}`)
          .then((res) => res.data);
      },
    }, */
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
