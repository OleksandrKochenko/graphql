import { Review, Game, Author, QueryArgs } from "./types.js";
import db from "./_db.js";

export const typeDefs = `#graphql
# schema for a game graphql api -- coresponds to the data at games table in the database
type Game {
    id: ID! # the exclamation mark means that the field is required
    title: String!
    platform: [String!]!
    reviews: [Review!] # this is a reference to the review type
}
# schema for a review graphql api
type Review {
    id: ID!
    rating: Int!
    content: String!
    author_id: ID!
    game_id: ID!
    game: Game! # this is a reference to the game type
    author: Author! # this is a reference to the author type
}
# schema for an author graphql api
type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!] # this is a reference to the review type
}
# schema for a query graphql api -- defines what arrays of data we can query
# and what types of data they return
type Query {
    reviews: [Review]
    reviewById(id: ID!): Review
    games: [Game]
    gameById(id: ID!): Game
    authors: [Author]
    authorById(id: ID!): Author
}
# schema for a mutation graphql api -- defines what arrays of data we can mutate
# and what types of data they return
type Mutation {
    addReview(rating: Int!, content: String!, author_id: ID!, game_id: ID!): Review
    updateReview(id: ID!, rating: Int, content: String): Review
    deleteReview(id: ID!): Review
    addGame(title: String!, platform: [String!]!): Game
    updateGame(id: ID!, title: String, platform: [String]): Game
    deleteGame(id: ID!): Game
    addAuthor(name: String!, verified: Boolean!): Author
    updateAuthor(id: ID!, name: String, verified: Boolean): Author
    deleteAuthor(id: ID!): Author
}
`;

// graphQL types: int, float, string, boolean, ID

export const resolvers = {
  Query: {
    reviews: (): Review[] => db.reviews,
    reviewById: (_: unknown, args: QueryArgs): Review | undefined => {
      return db.reviews.find((review: Review) => review.id === args.id);
    },

    games: (): Game[] => db.games,
    gameById: (_: unknown, args: QueryArgs): Game | undefined => {
      return db.games.find((game: Game) => game.id === args.id);
    },

    authors: (): Author[] => db.authors,
    authorById: (_: unknown, args: QueryArgs): Author | undefined => {
      return db.authors.find((author: Author) => author.id === args.id);
    },
  },
  Game: {
    reviews: (parent: Game): Review[] => {
      return db.reviews.filter(
        (review: Review) => review.game_id === parent.id
      );
    },
  },
  Review: {
    game: (parent: Review): Game | undefined => {
      return db.games.find((game: Game) => game.id === parent.game_id);
    },
    author: (parent: Review): Author | undefined => {
      return db.authors.find(
        (author: Author) => author.id === parent.author_id
      );
    },
  },
  Author: {
    reviews: (parent: Author): Review[] => {
      return db.reviews.filter(
        (review: Review) => review.author_id === parent.id
      );
    },
  },
  Mutation: {
    // Mutation for game
    addGame: (
      _: unknown,
      args: { title: string; platform: string[] }
    ): Game => {
      const newGame = {
        id: (db.games.length + 1).toString(),
        ...args,
      };
      db.games.push(newGame);
      return newGame;
    },
    updateGame: (
      _: unknown,
      args: { id: string; title?: string; platform?: string[] }
    ): Game | undefined => {
      const gameIndex = db.games.findIndex((game: Game) => game.id === args.id);
      if (gameIndex === -1) return undefined;
      const updatedGame = { ...db.games[gameIndex], ...args };
      db.games[gameIndex] = updatedGame;
      return updatedGame;
    },
    deleteGame: (_: unknown, args: QueryArgs): Game | undefined => {
      const gameIndex = db.games.findIndex((game: Game) => game.id === args.id);
      if (gameIndex === -1) return undefined;
      const deletedGame = db.games[gameIndex];
      db.games.splice(gameIndex, 1);
      return deletedGame;
    },

    // Mutation for review
    addReview: (
      _: unknown,
      args: {
        rating: number;
        content: string;
        author_id: string;
        game_id: string;
      }
    ): Review => {
      const newReview = {
        id: (db.reviews.length + 1).toString(),
        ...args,
      };
      db.reviews.push(newReview);
      return newReview;
    },
    updateReview: (
      _: unknown,
      args: { id: string; rating?: number; content?: string }
    ): Review | undefined => {
      const reviewIndex = db.reviews.findIndex(
        (review: Review) => review.id === args.id
      );
      if (reviewIndex === -1) return undefined;
      const updatedReview = { ...db.reviews[reviewIndex], ...args };
      db.reviews[reviewIndex] = updatedReview;
      return updatedReview;
    },
    deleteReview: (_: unknown, args: QueryArgs): Review | undefined => {
      const reviewIndex = db.reviews.findIndex(
        (review: Review) => review.id === args.id
      );
      if (reviewIndex === -1) return undefined;
      const deletedReview = db.reviews[reviewIndex];
      db.reviews.splice(reviewIndex, 1);
      return deletedReview;
    },
  },
};
