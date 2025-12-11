import { DataSource } from 'typeorm';
import { CatalogKind } from '../enums';
import { ContributorRole, RoleScope } from 'src/common/enums/role';
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
  role: ContributorRole;
  scope: RoleScope;
}

interface ICatalogSqlGenerator {
  createContentSql(options: ContentSourceOptions): string;
  createContributorSql(options: ContributorSourceOptions): string;
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
      .addSelect('array_agg(DISTINCT segment.slug)', 'segment')
      .addSelect('array_agg(DISTINCT topic.slug)', 'topic')
      .addSelect("array_agg(DISTINCT segment.slug || '/' || topic.slug)", 'pairs') 
      .addSelect(`(${alias}.createdAt)`, 'createdAt')
      .addSelect(`(${metadataExpression})::jsonb`, 'metadata')
      .from(entity, alias)
      .innerJoin(`${alias}.segment`, 'segment')
      .leftJoin(`${alias}.topic`, 'topic')
      .groupBy(`${alias}.id`)
      .addGroupBy(`${alias}.title`)
      .addGroupBy(`${alias}.slug`)
      .addGroupBy(`${alias}.coverUrl`)
      .addGroupBy(`${alias}.createdAt`)
      .getQuery();
  }

  public createContributorSql(options: ContributorSourceOptions): string {
    const { creditEntity, kindLabel, relationField, role, scope } = options;
    const alias = 'credit';

    return this.dataSource
      .createQueryBuilder()
      .select('(contributor.id)', 'id')
      .addSelect('(contributor.displayName)', 'title')
      .addSelect('(contributor.displayName)', 'subtitle')
      .addSelect('(contributor.photoUrl)', 'coverUrl')
      .addSelect(`('${kindLabel}')::text`, 'kind')
      .addSelect('array_remove(array_agg(DISTINCT segment.slug), NULL)', 'segment')
      .addSelect('array_remove(array_agg(DISTINCT topic.slug), NULL)', 'topic')
      .addSelect("array_remove(array_agg(DISTINCT segment.slug || '/' || topic.slug), NULL)", 'pairs')
      .addSelect(`(contributor.createdAt)`, 'createdAt')
      .addSelect('NULL::jsonb', 'metadata')
      .from(creditEntity, alias)
      .innerJoin(`${alias}.contributor`, 'contributor')
      .innerJoin(`${alias}.role`, 'role', `role.slug = '${role}' AND role.scope = '${scope}'`)
      .innerJoin(`${alias}.${relationField}`, relationField)
      .innerJoin(`${relationField}.segment`, 'segment')
      .innerJoin(`${relationField}.topic`, 'topic')
      .groupBy('contributor.id')
      .addGroupBy('contributor.displayName')
      .addGroupBy('contributor.photoUrl')
      .addGroupBy('contributor.createdAt')
      .getQuery();
  }
}
