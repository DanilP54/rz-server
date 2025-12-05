import { CatalogCategory, CatalogKind, CatalogViewMode } from "../enums";


export const MODE_KIND_MAP = {
  [CatalogCategory.MOVIES]: {
    [CatalogViewMode.WORKS]: CatalogKind.MOVIE,
    [CatalogViewMode.CREATORS]: CatalogKind.MOVIE_CREATOR,
  },
} satisfies Record<CatalogCategory, Partial<Record<CatalogViewMode, CatalogKind>>> ;
