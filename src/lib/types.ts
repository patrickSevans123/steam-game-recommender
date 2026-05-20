export interface SearchFilters {
  genre?: string;
  platform?: string;
  price_min?: number;
  price_max?: number;
}

export interface Game {
  id: number;
  name: string;
  description: string;
  short_description: string;
  header_image: string;
  screenshots: string[];
  price: number;
  genres: string[];
  developers: string[];
  publishers: string[];
  release_date: string;
  metacritic_score: number;
  steam_rating: number;
  positive_reviews: number;
  negative_reviews: number;
  platforms: string[];
}

export interface SearchResult {
  game: Game;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
}
