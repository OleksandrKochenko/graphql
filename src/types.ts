// Interface for a Review
export interface Review {
  id: string;
  rating: number;
  content: string;
  author_id: string;
  game_id: string;
}

// Interface for a Game
export interface Game {
  id: string;
  title: string;
  platform: string[];
}

// Interface for an Author
export interface Author {
  id: string;
  name: string;
  verified: boolean;
}

// Interface for Query Arguments
export interface QueryArgs {
  id: string;
}
