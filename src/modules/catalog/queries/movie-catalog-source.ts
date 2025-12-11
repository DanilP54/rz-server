import { CatalogSqlGenerator } from './catalog-sql-generator';
import { Movie } from 'src/modules/movie/movie.entity';
import { MovieCredit } from 'src/modules/movie-credit/movie-credit.entity';

import { CatalogSource } from './catalog-source';
import type { ContributorMeta, MovieMeta } from '../types';
import { CatalogKind } from '../enums';
import { ContributorRole, RoleScope } from 'src/common/enums/role';

export class MovieCatalogSource extends CatalogSource {
  private readonly alias = 'movie';
  private readonly relationField = 'movie';
  private readonly contributorRole = ContributorRole.Director;
  private readonly roleScope = RoleScope.MOVIE;

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
    // const directorMeta: ContributorMeta = {
      
    // }
    return this.sqlGenerator.createContributorSql({
      creditEntity: MovieCredit,
      kindLabel: CatalogKind.MOVIE_CREATOR,
      relationField: this.relationField,
      role: this.contributorRole,
      scope: this.roleScope
    });
  }
}
