import db from "./_db.js";

export const typeDefs = `#graphql
# schema for a game graphql api -- coresponds to the data at games table in the database
type Game {
    id: ID! # the exclamation mark means that the field is required
    title: String!
    platform: [String!]!
}
# schema for a review graphql api
type Review {
    id: ID!
    rating: Int!
    content: String!
}
# schema for an author graphql api
type Author {
    id: ID!
    name: String!
    verified: Boolean!
}
# schema for a query graphql api -- defines what arrays of data we can query
# and what types of data they return
type Query {
    reviews: [Review]
    games: [Game]
    authors: [Author]
}
`;

// graphQL types: int, float, string, boolean, ID

export const resolvers = {
  Query: {
    reviews: () => db.reviews,
    games: () => db.games,
    authors: () => db.authors,
  },
};
