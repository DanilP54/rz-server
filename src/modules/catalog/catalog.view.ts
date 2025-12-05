import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

import type { CatalogMeta } from './types';
import { Segments } from 'src/common/enums/segment';

import { CatalogViewBuilder } from './queries/catalog-view-builder';
import { MovieCatalogSource } from './queries/movie-catalog-source';
import { Topics } from 'src/common/enums/topic';
import { CatalogSqlGenerator } from './queries/catalog-sql-generator';
import { CatalogKind } from './enums';

@ViewEntity({
  name: 'catalog-view',
  expression: (dataSource: DataSource) => {
    return new CatalogViewBuilder(dataSource)
      .add(new MovieCatalogSource(new CatalogSqlGenerator(dataSource)))
      .build();
  },
})
export class CatalogView {
  @ViewColumn()
  id: string;
  @ViewColumn()
  title: string;
  @ViewColumn()
  subtitle: string;
  @ViewColumn()
  coverUrl: string;
  @ViewColumn()
  kind: CatalogKind;
  @ViewColumn()
  segment: Segments;
  @ViewColumn()
  topic: Topics;
  @ViewColumn()
  createdAt: Date;
  @ViewColumn()
  metadata: CatalogMeta | null;
}
