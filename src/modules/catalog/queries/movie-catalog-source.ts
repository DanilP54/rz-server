import { CatalogSqlGenerator } from './catalog-sql-generator';
import { Movie } from 'src/modules/movie/movie.entity';
import { MovieCredit } from 'src/modules/movie-credit/movie-credit.entity';

import { CatalogSource } from './catalog-source';
import type { MovieMeta } from '../types';
import { CatalogKind } from '../enums';

export class MovieCatalogSource extends CatalogSource {
  private readonly alias = 'movie';
  private readonly relationField = 'movie';

  constructor(private readonly sqlGenerator: CatalogSqlGenerator) {
    super();
  }

  getContentQuery(): string {
    const movieMetaObj: MovieMeta = {
      id: `${this.alias}.id`,
      mediaUrl: `${this.alias}.slug`,
      slug: `${this.alias}.slug`,
      metaType: '\'movie-meta\'',
    };
    const jsonBuildObjectSql = this.buildJsonbObject(movieMetaObj);
    return this.sqlGenerator.createContentSql({
      entity: Movie,
      alias: this.alias,
      kindLabel: CatalogKind.MOVIE,
      metadataExpression: jsonBuildObjectSql,
    });
  }

  getContributorsQuery(): string {
    return this.sqlGenerator.createContributorSql({
      creditEntity: MovieCredit,
      kindLabel: CatalogKind.MOVIE_CREATOR,
      relationField: this.relationField,
    });
  }
}
