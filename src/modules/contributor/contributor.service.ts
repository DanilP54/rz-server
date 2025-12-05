import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { Repository } from 'typeorm';
import { buildPaginationMeta } from 'src/common/utils/build-pagination-meta';
import { Paginated } from 'src/common/interfaces/pagination';

export class ContributorService {
  constructor(
    @InjectRepository(Contributor)
    private readonly repository: Repository<Contributor>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<Paginated<Contributor>> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const meta = buildPaginationMeta(total, page, limit);

    return {
      meta,
      items: data,
    };
  }
}
