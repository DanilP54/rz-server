import { DataSource, EntityMetadata, EntityTarget } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata.js';
import { KindLabel } from './enums';
import { IPayloadStrategy } from './payload';
import { Movie } from '../movie/movie.entity';
import { MovieCredit } from '../movie-credit/movie-credit.entity';
import { MoviePayloadStrategy } from './payload';

abstract class RootBrowseQuery {
  constructor(
    private readonly dataSourse: DataSource,
    private readonly contentEntity: new (...arg: any) => any,
    private readonly junctionEntity: new (...arg: any) => any,
  ) {}
  protected createContentQuery(
    kindLabel: KindLabel,
    payloadStrategy: IPayloadStrategy,
  ) {
    const alias = 'content';
    const payload = payloadStrategy.build(alias);
    const builder = this.dataSourse.createQueryBuilder();
    return builder
      .select(`(${alias}.id)`, 'id')
      .addSelect(`(${alias}.title)`, 'title')
      .addSelect(`(${alias}.slug)`, 'subTitle')
      .addSelect(`(${alias}.coverUrl)`, 'coverUrl')
      .addSelect(`('${kindLabel}')`, 'kind')
      .addSelect('(segment.slug)', 'segment')
      .addSelect('(topic.slug)', 'topic')
      .addSelect(`(${alias}.createdAt)`, 'createdAt')
      .addSelect(`(${payload})`, 'payload')
      .from(this.contentEntity, alias)
      .innerJoin(`${alias}.segment`, 'segment')
      .innerJoin(`${alias}.topic`, 'topic')
      .getQuery();
  }
  protected createContributorQuery(kindLabel: KindLabel) {
    const alias = 'junction';

    const contentMeta = this.dataSourse.getMetadata(this.contentEntity);
    const junctionMeta = this.dataSourse.getMetadata(this.junctionEntity);
    const { propertyName: contentProp } =
      this.findManyToOneRelationFromJunctionEntity(junctionMeta, contentMeta);

    const builder = this.dataSourse.createQueryBuilder();

    return builder
      .select('(contributor.id)', 'id')
      .addSelect('(contributor.displayName)', 'title')
      .addSelect('(contributor.displayName)', 'subTitle')
      .addSelect('(contributor.photoUrl)', 'coverUrl')
      .addSelect(`('${kindLabel}')`, 'kind')
      .addSelect('(segment.slug)', 'segment')
      .addSelect('(topic.slug)', 'topic')
      .addSelect(`(contributor.createdAt)`, 'createdAt')
      .addSelect('NULL', 'payload')
      .from(this.junctionEntity, alias)
      .innerJoin(`${alias}.contributor`, 'contributor')
      .innerJoin(`${alias}.role`, 'role')
      .innerJoin(`${alias}.${contentProp}`, `${contentProp}`)
      .innerJoin(`${contentProp}.segment`, 'segment')
      .innerJoin(`${contentProp}.topic`, 'topic')
      .getQuery();
  }

  private findManyToOneRelationFromJunctionEntity<
    Metadata extends EntityMetadata,
  >(junctionMeta: Metadata, targetMeta: Metadata) {
    const relation = junctionMeta.manyToOneRelations.find(
      (r: RelationMetadata) => {
        return r.inverseEntityMetadata.target === targetMeta.target;
      },
    );

    if (!relation) {
      throw new Error(
        `[BrowseQueryBuilder] В сущности "${junctionMeta.name}" не найдена ManyToOne связь с "${targetMeta.name}"`,
      );
    }

    return relation;
  }
}

interface ContentBrowseQuery {
  getContentQuery(dataSource: DataSource): string;
  getContributorQuery(dataSource: DataSource): string;
}

export class MovieBrowseQuery extends RootBrowseQuery implements ContentBrowseQuery {
  constructor(dataSourse: DataSource) {
    super(dataSourse, Movie, MovieCredit);
  }

  getContentQuery(): string {
    const payloadStrategy = this.getContentPayloadStrategy();
    return this.createContentQuery(KindLabel.MOVIE, payloadStrategy);
  }

  getContributorQuery(): string {
    return this.createContributorQuery(KindLabel.MOVIE_CREATOR);
  }

  private getContentPayloadStrategy() {
    return new MoviePayloadStrategy();
  }
}

// Дескриптор для описания параметров и логики каждого branch-view источника
export interface BrowseQueryDescriptor {
  // Сущность контента (фильм, книга и т.д.)
  getContentEntity(): EntityTarget<any>;
  // Сущность связи (credit entity), если требуется
  getCreditEntity(): EntityTarget<any>;
  // Enum-метки: контент, создатель (creator)
  getContentKindLabel(): KindLabel;
  getCreatorKindLabel(): KindLabel;
  // Стратегия payload
  getPayloadStrategy(): IPayloadStrategy;
  // Возможный алиас/join/role специфики (по необходимости)
  getAlias?(): string;
  // Вспомогательные методы — можно добавить дополнительные методы-геттеры для расширяемости
}

export class BrowseQueryBuilder {
  private queries: string[] = [];

  constructor(
    private readonly dataSource: DataSource,
    private readonly contributorEntity: EntityTarget<any>,
    private readonly roleEntity: EntityTarget<any>,
  ) {}

  public add(descriptor: BrowseQueryDescriptor): this {
    // все параметры получаем из дескриптора
    const contentEntity = descriptor.getContentEntity();
    const creditEntity = descriptor.getCreditEntity();
    const workKindLabel = descriptor.getContentKindLabel();
    const creatorKindLabel = descriptor.getCreatorKindLabel();
    const payloadStrategy = descriptor.getPayloadStrategy();
    this.queries.push(
      this.createContentQuery(contentEntity, workKindLabel, payloadStrategy),
    );
    this.queries.push(
      this.createCreditQuery(contentEntity, creditEntity, creatorKindLabel),
    );
    return this;
  }

  public build() {
    if (!this.queries.length) {
      return this.dataSource.createQueryBuilder().select('NULL');
    }

    const combinedQuery = this.queries.join(' UNION ALL ');

    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(`(${combinedQuery})`, 'u');
  }

  // ================= PRIVATE METHODS =================

  private createContentQuery(
    entity: EntityTarget<any>,
    kindLabel: KindLabel,
    payloadStrategy: IPayloadStrategy,
  ): string {
    const alias = 'content';

    const payload = payloadStrategy.build(alias);

    return this.dataSource
      .createQueryBuilder()
      .select(`${alias}.id`, 'id')
      .addSelect(`${alias}.title`, 'title')
      .addSelect(`${alias}.slug`, 'subTitle')
      .addSelect(`(${alias}.coverUrl)`, 'coverUrl')
      .addSelect(`'${kindLabel}'`, 'kind')
      .addSelect('segment.slug', 'segment')
      .addSelect('topic.slug', 'topic')
      .addSelect(`(${alias}.createdAt)`, 'createdAt')
      .addSelect(`(${payload})`, 'payload')
      .from(entity, alias)
      .innerJoin(`${alias}.segment`, 'segment')
      .innerJoin(`${alias}.topic`, 'topic')
      .getQuery();
  }

  private findManyToOneRelationFromCredit<Metadata extends EntityMetadata>(
    creditMeta: Metadata,
    targetMeta: Metadata,
  ) {
    const relation = creditMeta.manyToOneRelations.find(
      (r: RelationMetadata) => {
        return r.inverseEntityMetadata.target === targetMeta.target;
      },
    );

    if (!relation) {
      throw new Error(
        `[BrowseQueryBuilder] В сущности "${creditMeta.name}" не найдена ManyToOne связь с "${targetMeta.name}"`,
      );
    }

    return relation;
  }

  private createCreditQuery(
    contentEntity: EntityTarget<any>,
    creditEntity: EntityTarget<any>,
    label: KindLabel,
  ): string {
    const creditMeta = this.dataSource.getMetadata(creditEntity);
    const contributorMeta = this.dataSource.getMetadata(this.contributorEntity);
    const roleMeta = this.dataSource.getMetadata(this.roleEntity);
    const contentMeta = this.dataSource.getMetadata(contentEntity);

    const contributorRelation = this.findManyToOneRelationFromCredit(
      creditMeta,
      contributorMeta,
    );
    console.log(contentMeta.targetName);
    const roleRelation = this.findManyToOneRelationFromCredit(
      creditMeta,
      roleMeta,
    );
    const contentRelation = this.findManyToOneRelationFromCredit(
      creditMeta,
      contentMeta,
    );

    const alias = 'credit';

    return this.dataSource
      .createQueryBuilder()
      .select(`${contributorRelation.propertyName}.id`, 'id')
      .addSelect(`${contributorRelation.propertyName}.displayName`, 'title')
      .addSelect(`${roleRelation.propertyName}.displayName`, 'subTitle')
      .addSelect(`(${contributorRelation.propertyName}.photoUrl)`, 'coverUrl')
      .addSelect(`'${label}'`, 'kind')
      .addSelect('segment.slug', 'segment')
      .addSelect('topic.slug', 'topic')
      .addSelect(`(${contributorRelation.propertyName}.createdAt)`, 'createdAt')
      .addSelect('NULL', 'payload')
      .from(creditEntity, alias)
      .innerJoin(
        `${alias}.${contributorRelation.propertyName}`,
        contributorRelation.propertyName,
      )
      .innerJoin(
        `${alias}.${roleRelation.propertyName}`,
        roleRelation.propertyName,
      )
      .innerJoin(
        `${alias}.${contentRelation.propertyName}`,
        contentRelation.propertyName,
      )
      .leftJoin(`${contentRelation.propertyName}.segment`, 'segment')
      .leftJoin(`${contentRelation.propertyName}.topic`, 'topic')
      .getQuery();
  }
}

// Дескриптор для фильмов
export class MovieBrowseQueryDescriptor implements BrowseQueryDescriptor {
  getContentEntity() {
    return Movie;
  }
  getCreditEntity() {
    return MovieCredit;
  }
  getContentKindLabel() {
    return KindLabel.MOVIE;
  }
  getCreatorKindLabel() {
    return KindLabel.MOVIE_CREATOR;
  }
  getPayloadStrategy() {
    return new MoviePayloadStrategy();
  }
  getAlias() {
    return 'movie';
  }
  // здесь можно добавить методы-расширения, если в будущем появится специфика для фильмов
}

// `
// SELECT
//   "content"."id" AS "id",
//   "content"."title" AS "title",
//   "content"."slug" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("content"."coverUrl") AS "coverUrl",
//   'movie' AS "kind",
//   ("content"."createdAt") AS "createdAt",
//   (json_build_object('mediaUrl', "content"."slug")) AS "payload"
// FROM "movies" "content"
// INNER JOIN "segments" "segment" ON "segment"."id"="content"."segmentId"
// INNER JOIN "topics" "topic" ON "topic"."id"="content"."topicId"

// SELECT
//   "content"."id" AS "id",
//   "content"."title" AS "title",
//   "content"."slug" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("content"."coverUrl") AS "coverUrl",
//   'movie' AS "kind",
//   ("content"."createdAt") AS "createdAt",
//   (json_build_object('mediaUrl', "content"."slug")) AS "payload"
// FROM "movies" "content"
// INNER JOIN "segments" "segment" ON "segment"."id"="content"."segmentId"
// INNER JOIN "topics" "topic" ON "topic"."id"="content"."topicId"
// SELECT
//   "content"."id" AS "id",
//   "content"."title" AS "title",
//   "content"."slug" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("content"."coverUrl") AS "coverUrl",
//   'movie' AS "kind",
//   ("content"."createdAt") AS "createdAt",
//   (json_build_object('mediaUrl', "content"."slug")) AS "payload"
// FROM "movies" "content"
// INNER JOIN "segments" "segment" ON "segment"."id"="content"."segmentId"
// INNER JOIN "topics" "topic" ON "topic"."id"="content"."topicId"
// SELECT
//   "content"."id" AS "id",
//   "content"."title" AS "title",
//   "content"."slug" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("content"."coverUrl") AS "coverUrl",
//   'movie' AS "kind",
//   ("content"."createdAt") AS "createdAt",
//   (json_build_object('mediaUrl', "content"."slug")) AS "payload"
// FROM "movies" "content"
// INNER JOIN "segments" "segment" ON "segment"."id"="content"."segmentId"
// INNER JOIN "topics" "topic" ON "topic"."id"="content"."topicId"
// SELECT
//   "content"."id" AS "id",
//   "content"."title" AS "title",
//   "content"."slug" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("content"."coverUrl") AS "coverUrl",
//   'movie' AS "kind",
//   ("content"."createdAt") AS "createdAt",
//   (json_build_object('mediaUrl', "content"."slug")) AS "payload"
// FROM "movies" "content"
// INNER JOIN "segments" "segment" ON "segment"."id"="content"."segmentId"
// INNER JOIN "topics" "topic" ON "topic"."id"="content"."topicId"
// `

// `
// SELECT
//   "contributor"."id" AS "id",
//   "contributor"."displayName" AS "title",
//   "role"."displayName" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("contributor"."photoUrl") AS "coverUrl",
//   'movie_creator' AS "kind",
//   ("contributor"."createdAt") AS "createdAt",
//   NULL AS "payload"
// FROM "movie_credits" "credit"
// INNER JOIN "contributors" "contributor" ON "contributor"."id"="credit"."contributorId"
// INNER JOIN "roles" "role" ON "role"."id"="credit"."roleId"
// INNER JOIN "movies" "movie" ON "movie"."id"="credit"."movieId"
// LEFT JOIN "segments" "segment" ON "segment"."id"="movie"."segmentId"
// LEFT JOIN "topics" "topic" ON "topic"."id"="movie"."topicId"
// SELECT
//   "contributor"."id" AS "id",
//   "contributor"."displayName" AS "title",
//   "role"."displayName" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("contributor"."photoUrl") AS "coverUrl",
//   'movie_creator' AS "kind",
//   ("contributor"."createdAt") AS "createdAt",
//   NULL AS "payload"
// FROM "movie_credits" "credit"
// INNER JOIN "contributors" "contributor" ON "contributor"."id"="credit"."contributorId"
// INNER JOIN "roles" "role" ON "role"."id"="credit"."roleId"
// INNER JOIN "movies" "movie" ON "movie"."id"="credit"."movieId"
// LEFT JOIN "segments" "segment" ON "segment"."id"="movie"."segmentId"
// LEFT JOIN "topics" "topic" ON "topic"."id"="movie"."topicId"
// SELECT
//   "contributor"."id" AS "id",
//   "contributor"."displayName" AS "title",
//   "role"."displayName" AS "subTitle",
//   "segment"."slug" AS "segment",
//   "topic"."slug" AS "topic",
//   ("contributor"."photoUrl") AS "coverUrl",
//   'movie_creator' AS "kind",
//   ("contributor"."createdAt") AS "createdAt",
//   NULL AS "payload"
// FROM "movie_credits" "credit"
// INNER JOIN "contributors" "contributor" ON "contributor"."id"="credit"."contributorId"
// INNER JOIN "roles" "role" ON "role"."id"="credit"."roleId"
// INNER JOIN "movies" "movie" ON "movie"."id"="credit"."movieId"
// LEFT JOIN "segments" "segment" ON "segment"."id"="movie"."segmentId"
// LEFT JOIN "topics" "topic" ON "topic"."id"="movie"."topicId"
// `
