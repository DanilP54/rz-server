import { CatalogCategory, CatalogKind, CatalogMode } from '../enums';

export const MODE_KIND_MAP = {
  [CatalogCategory.MOVIES]: {
    [CatalogMode.WORKS]: CatalogKind.MOVIE,
    [CatalogMode.CREATORS]: CatalogKind.MOVIE_CREATOR,
  },
} satisfies Record<
  CatalogCategory,
  Partial<Record<CatalogMode, CatalogKind>>
>;
