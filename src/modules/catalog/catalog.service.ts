import { InjectRepository } from '@nestjs/typeorm';
import { CatalogView } from './catalog.view';
import { FindOptionsWhere, Repository } from 'typeorm';
import { buildPaginationMeta } from 'src/common/utils/build-pagination-meta';
import { Paginated } from 'src/common/interfaces/pagination';
import { CatalogItemDto } from './dtos/catalog-item.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { plainToClass } from 'class-transformer';

export class CatalogService {
  constructor(
    @InjectRepository(CatalogView)
    private readonly repository: Repository<CatalogView>,
  ) {}

  async getPaginated(
    options: FindOptionsWhere<CatalogView>,
    pagination: PaginationDto,
  ): Promise<Paginated<CatalogItemDto>> {
    const { segment, topic, kind } = options;
    const { page, limit } = pagination;

    const offset = (Math.max(1, page) - 1) * limit;

    const [items, total] = await this.repository.findAndCount({
      where: { kind, segment, topic },
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const meta = buildPaginationMeta(total, page, limit);
    const dto = items.map((item) => plainToClass(CatalogItemDto, item));

    return { meta, items: dto };
  }
}
