import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';


export abstract class BaseEntityService<Entity = any> {
  protected createQueryBuilder(): QueryBuilder<Entity> {
    return {
      where: {},
      relations: {},
    };
  }
}

export type QueryBuilder<Entity = any> = FindManyOptions<Entity> & {
  where: FindOptionsWhere<Entity>;
  relations: FindOptionsRelations<Entity>;
};
