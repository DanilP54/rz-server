import { InjectRepository } from '@nestjs/typeorm';
import { BrowseView } from './browse.view';
import { Repository } from 'typeorm';
import { KindLabel } from './enums';
import type { IBrowseQuery } from './browse-query';

type BrowseSearchOptions = {
  kind?: KindLabel
} & Omit<IBrowseQuery, "mode">;

export class BrowseService {
  constructor(
    @InjectRepository(BrowseView)
    private readonly repository: Repository<BrowseView>,
  ) {}

  async findAll(options: BrowseSearchOptions) {
    const { segment, topic, kind, page = 1, limit = 10 } = options;

    const offset = (page - 1) * limit;

    const [items, total] = await this.repository.findAndCount({
      where: { kind, segment, topic },
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      meta: {
        total,
      },
      data: items,
    };
  }
}
