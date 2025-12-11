import { InjectRepository } from '@nestjs/typeorm';
import { CatalogView } from './catalog.view';
import { FindOptionsWhere, Repository } from 'typeorm';
import { buildPaginationMeta } from 'src/common/utils/build-pagination-meta';
import { Paginated } from 'src/common/interfaces/pagination';
import { CatalogItemDto } from './dtos/catalog-item.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { Segments } from 'src/common/enums/segment';
import { Topics } from 'src/common/enums/topic';

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

    const qb = this.repository.createQueryBuilder('cv'); 

    if (kind) {
      qb.andWhere('cv.kind = :kind', { kind });
    }
    
    if (segment && topic) {
      
      const pair = `${segment}/${topic}`;
      
      qb.andWhere('cv.pairs::text[] && ARRAY[:pair]::text[]', { pair });
    
    } else {

        if (segment) {
          qb.andWhere('cv.segment::text[] && ARRAY[:segment]::text[]', { segment });
        }

        if (topic) {
          qb.andWhere('cv.topic::text[] && ARRAY[:topic]::text[]', { topic });
        }
    }

    const offset = (Math.max(1, page) - 1) * limit;

    qb.orderBy('cv.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();;

    const meta = buildPaginationMeta(total, page, limit);

    const dto = items.map((item) => {
      const itemDto = plainToInstance(CatalogItemDto, item)
      itemDto.currentSegment = segment ? (segment as Segments) : null
      itemDto.currentTopic = topic ? (topic as Topics) : null
      return itemDto
    });

    return { meta, items: dto };
  }
}
