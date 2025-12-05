import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CatalogSource } from './catalog-source';

// @Injectable()
export class CatalogViewBuilder {
  private queries: string[] = [];
  private readonly logger = new Logger(CatalogViewBuilder.name);
  constructor(private readonly dataSource: DataSource) {}

  public add(source: CatalogSource): this {
    this.queries.push(source.getContentQuery());
    this.queries.push(source.getContributorsQuery());
    return this;
  }

  public build() {
    if (!this.queries.length) {
      const error = new CatalogViewBuilderError();
      this.logger.error(error.message, {
        method: 'build',
        context: error.name,
        stack: error.stack,
      });
      throw error;
    }
    const combinedQuery = this.queries.join(' UNION ALL ');
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(`(${combinedQuery})`, 'u');
  }
}

export class CatalogViewBuilderError extends Error {
  constructor() {
    super(`[CatalogViewBuilder]: 'Attempted to build catalog query without any data sources. You must call .add() at least once before calling .build().'`);
    this.name = 'CatalogQueryBuilderError';
  }
}
