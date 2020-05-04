const axios = require("axios");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = require("graphql");

const GroceryItemType = new GraphQLObjectType({
    name: "GroceryItem",
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        size: { type: GraphQLString },
        preferredBrand: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        groceryItem: {
            type: GroceryItemType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/groceryItems/${args.id}`)
                    .then((res) => res.data);
            },
        },
        groceryItems: {
            type: new GraphQLList(GroceryItemType),
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/groceryItems`)
                    .then((res) => res.data);
            },
        },
    },
});

// edit the data
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addGroceryItem: {
            type: GroceryItemType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                quantity: { type: new GraphQLNonNull(GraphQLInt) },
                size: { type: new GraphQLNonNull(GraphQLString) },
                preferredBrand: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return axios
                    .post(`http://localhost:3000/groceryItems`, {
                        name: args.name,
                        quantity: args.quantity,
                        size: args.size,
                        preferredBrand: args.preferredBrand,
                    })
                    .then((res) => res.data);
            },
        },
        deleteGroceryItem: {
            type: GroceryItemType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parentValue, args) {
                return axios
                    .delete(`http://localhost:3000/groceryItems/${args.id}`)
                    .then((res) => res.data);
            },
        },
        editGroceryItem: {
            type: GroceryItemType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLString },
                quantity: { type: GraphQLInt },
                size: { type: GraphQLString },
                preferredBrand: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return axios
                    .patch(
                        `http://localhost:3000/groceryItems/${args.id}`,
                        args
                    )
                    .then((res) => res.data);
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
