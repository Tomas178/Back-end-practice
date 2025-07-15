import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Directors {
  movieId: number;
  personId: number;
}

export interface Movies {
  id: Generated<number>;
  title: string;
  year: number | null;
}

export interface People {
  birth: number | null;
  id: Generated<number>;
  name: string;
}

export interface Ratings {
  movieId: number;
  rating: number;
  votes: number;
}

export interface Screenings {
  createdAt: Generated<string>;
  id: Generated<number>;
  leftTickets: number;
  movieId: number;
  timestamp: string;
  totalTickets: number;
}

export interface Stars {
  movieId: number;
  personId: number;
}

export interface Tickets {
  createdAt: Generated<string>;
  id: Generated<number>;
  screeningId: number;
  userId: number;
}

export interface Users {
  createdAt: Generated<string>;
  id: Generated<number>;
  username: string;
}

export interface DB {
  directors: Directors;
  movies: Movies;
  people: People;
  ratings: Ratings;
  screenings: Screenings;
  stars: Stars;
  tickets: Tickets;
  users: Users;
}
