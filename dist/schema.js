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
        reviews: () => db.reviews,
        reviewById: (_, args) => {
            return db.reviews.find((review) => review.id === args.id);
        },
        games: () => db.games,
        gameById: (_, args) => {
            return db.games.find((game) => game.id === args.id);
        },
        authors: () => db.authors,
        authorById: (_, args) => {
            return db.authors.find((author) => author.id === args.id);
        },
    },
    Game: {
        reviews: (parent) => {
            return db.reviews.filter((review) => review.game_id === parent.id);
        },
    },
    Review: {
        game: (parent) => {
            return db.games.find((game) => game.id === parent.game_id);
        },
        author: (parent) => {
            return db.authors.find((author) => author.id === parent.author_id);
        },
    },
    Author: {
        reviews: (parent) => {
            return db.reviews.filter((review) => review.author_id === parent.id);
        },
    },
    Mutation: {
        // Mutation for game
        addGame: (_, args) => {
            const newGame = {
                id: (db.games.length + 1).toString(),
                ...args,
            };
            db.games.push(newGame);
            return newGame;
        },
        updateGame: (_, args) => {
            const gameIndex = db.games.findIndex((game) => game.id === args.id);
            if (gameIndex === -1)
                return undefined;
            const updatedGame = { ...db.games[gameIndex], ...args };
            db.games[gameIndex] = updatedGame;
            return updatedGame;
        },
        deleteGame: (_, args) => {
            const gameIndex = db.games.findIndex((game) => game.id === args.id);
            if (gameIndex === -1)
                return undefined;
            const deletedGame = db.games[gameIndex];
            db.games.splice(gameIndex, 1);
            return deletedGame;
        },
        // Mutation for review
        addReview: (_, args) => {
            const newReview = {
                id: (db.reviews.length + 1).toString(),
                ...args,
            };
            db.reviews.push(newReview);
            return newReview;
        },
        updateReview: (_, args) => {
            const reviewIndex = db.reviews.findIndex((review) => review.id === args.id);
            if (reviewIndex === -1)
                return undefined;
            const updatedReview = { ...db.reviews[reviewIndex], ...args };
            db.reviews[reviewIndex] = updatedReview;
            return updatedReview;
        },
        deleteReview: (_, args) => {
            const reviewIndex = db.reviews.findIndex((review) => review.id === args.id);
            if (reviewIndex === -1)
                return undefined;
            const deletedReview = db.reviews[reviewIndex];
            db.reviews.splice(reviewIndex, 1);
            return deletedReview;
        },
    },
};
