export interface MovieMeta {
  id: string;
  mediaUrl: string;
  slug: string;
  metaType: "'movie-meta'";
}

export interface BookMeta {
  id: string;
  slug: string;
  metaType: "'book-meta'";
}

export type CatalogMeta = MovieMeta | BookMeta;
