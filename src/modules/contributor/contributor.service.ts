import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { Repository } from 'typeorm';
import { BaseQuery } from '../../common/base-qeuery.interface';
import {
  PaginationMeta,
  PaginationResponse,
} from 'src/common/pagination.interface';
import { ContentType, Segments } from 'src/common/type';
import { ContentConfig } from 'src/common/entity-names';
import { transformToPaginationMeta } from '../transform-pagination-meta';

export class ContributorService {
  
  constructor(
    @InjectRepository(Contributor)
    private readonly repository: Repository<Contributor>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const lastPage = Math.ceil(total / limit);
    const hasNextPage = page < lastPage;
    const hasPrevPage = page > 1;

    const meta: PaginationMeta = {
      total,
      currentPage: page,
      perPage: limit,
      lastPage,
      hasNextPage,
      hasPrevPage,
    };

    return {
      meta,
      data,
    };
  }

  async findByContentAndSegment(
    contentType: ContentType,
    segment: Segments,
    query: Omit<BaseQuery, 'segment'> = {},
  ): Promise<PaginationResponse<Contributor>> {
    const { topic, page = 1, limit = 10 } = query;

    const cfg = ContentConfig[contentType];

    const alias = Contributor.name;

    const queryBuilder = this.repository.createQueryBuilder(alias);

    queryBuilder
      .innerJoin(`${alias}.${cfg.relation}`, cfg.alias)
      .innerJoin(`${cfg.alias}.segment`, 'segment')
      .where('segment.slug = :segment', { segment });

    if (topic) {
      queryBuilder
        .innerJoin(`${cfg.alias}.topic`, 'topic')
        .andWhere('topic.slug = :topic', { topic });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`${alias}.createdAt`, 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    const meta = transformToPaginationMeta(total, page, limit);

    return {
      meta,
      items: data,
    };
  }
}
