import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { BaseQuery } from '../../common/base-qeuery.interface';
import { PaginationResponse } from '../../common/pagination.interface';
import { IContentService } from '../content-service.interface';
import { transformToPaginationMeta } from '../transform-pagination-meta';

export class MovieService implements IContentService<Movie> {
  private readonly entityName = 'movie';

  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
  ) {}

  async findAll(query: BaseQuery = {}): Promise<PaginationResponse<Movie>> {
    const { segment, topic, page = 1, limit = 10 } = query;

    const queryBuilder = this.repository.createQueryBuilder(Movie.name);

    if (segment) {
      queryBuilder.innerJoinAndSelect(`${Movie.name}.segment`, 'segment')
      queryBuilder.andWhere(`segment.slug = :segment`, { segment });
    }

    if (topic) {
      queryBuilder.innerJoin(`${Movie.name}.topic`, 'topic')
      queryBuilder.andWhere(`topic.slug = :topic`, { topic });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`${Movie.name}.createdAt`, 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    const meta = transformToPaginationMeta(total, page, limit);

    return {
      meta,
      items: data,
    };
  }
}
