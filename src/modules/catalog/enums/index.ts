import { ContributorRole } from "src/common/enums/role";

export enum CatalogMode {
  WORKS = 'works',
  CREATORS = 'creators',
}

export enum CatalogKind {
  MOVIE = 'movie',
  MOVIE_CREATOR = ContributorRole.Director,

  BOOK = 'book',
  BOOK_CREATOR = 'book_creator',

  MUSIC = 'music',
  MUSIC_CREATOR = 'music_creator',

  ART = 'art',
  ART_CREATOR = 'art_creator',
}

export enum CatalogCategory {
  MOVIES = 'movies',
  //   MUSIC = 'music',
  //   BOOKS = 'books',
  //   ART = 'art',
}
