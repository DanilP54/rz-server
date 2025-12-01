export const ContentConfig = {
  movies: {
    relation: 'movies',
    table: 'movies',
    alias: 'movie',
  },

  books: {
    relation: 'books',
    table: 'books',
    alias: 'book',
  },

  albums: {
    relation: 'albums',
    table: 'music_albums',
    alias: 'album',
  },

  gallery: {
    relation: 'gallery',
    table: 'artwork_gallaries',
    alias: 'gallery',
  },
} as const;
