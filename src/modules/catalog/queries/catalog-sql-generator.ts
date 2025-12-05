import { DataSource } from 'typeorm';
import { CatalogKind } from '../enums';
type ClassEntity = new (...arg: any) => any;

interface ContentSourceOptions {
  entity: ClassEntity;
  alias: string;
  kindLabel: CatalogKind;
  metadataExpression: string;
}

interface ContributorSourceOptions {
  creditEntity: ClassEntity;
  kindLabel: CatalogKind;
  relationField: string;
}

interface ICatalogSqlGenerator {
  createContentSql(options: ContentSourceOptions): string;
  createContributorSql(options: ContributorSourceOptions): string
}

export class CatalogSqlGenerator implements ICatalogSqlGenerator {
  constructor(private readonly dataSource: DataSource) {}

  public createContentSql(options: ContentSourceOptions): string {
    const { entity, alias, kindLabel, metadataExpression } = options;
    
    return this.dataSource
      .createQueryBuilder()
      .select(`(${alias}.id)`, 'id')
      .addSelect(`(${alias}.title)`, 'title')
      .addSelect(`(${alias}.slug)`, 'subtitle')
      .addSelect(`(${alias}.coverUrl)`, 'coverUrl')
      .addSelect(`('${kindLabel}')::text`, 'kind')
      .addSelect('(segment.slug)', 'segment')
      .addSelect('(topic.slug)', 'topic')
      .addSelect(`(${alias}.createdAt)`, 'createdAt')
      .addSelect(`(${metadataExpression})::jsonb`, 'metadata')
      .from(entity, alias)
      .innerJoin(`${alias}.segment`, 'segment')
      .leftJoin(`${alias}.topic`, 'topic')
      .distinct()
      .cache(true)
      .getQuery();
  }

  public createContributorSql(options: ContributorSourceOptions): string {
    const { creditEntity, kindLabel, relationField } = options;
    const alias = 'credit';

    return this.dataSource
      .createQueryBuilder()
      .select('(contributor.id)', 'id')
      .addSelect('(contributor.displayName)', 'title')
      .addSelect('(contributor.displayName)', 'subtitle')
      .addSelect('(contributor.photoUrl)', 'coverUrl')
      .addSelect(`('${kindLabel}')::text`, 'kind')
      .addSelect('(segment.slug)', 'segment')
      .addSelect('(topic.slug)', 'topic')
      .addSelect(`(contributor.createdAt)`, 'createdAt')
      .addSelect('NULL::jsonb', 'metadata')
      .from(creditEntity, alias)
      .innerJoin(`${alias}.contributor`, 'contributor')
      .innerJoin(`${alias}.role`, 'role')
      .innerJoin(`${alias}.${relationField}`, relationField)
      .innerJoin(`${relationField}.segment`, 'segment')
      .leftJoin(`${relationField}.topic`, 'topic')
      .distinct()
      .cache(true)
      .getQuery();
  }
}