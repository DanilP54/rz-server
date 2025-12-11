import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MODE_KIND_MAP } from './constants/mode-kind-map';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { ContentFiltersQueryDto } from 'src/common/dtos/content-filters-query.dto';
import { Paginated } from 'src/common/interfaces/pagination';
import { CatalogItemDto } from './dtos/catalog-item.dto';
import { CatalogCategory, CatalogKind, CatalogMode } from './enums';

class CatalogQueryDto extends IntersectionType(
  PaginationDto,
  ContentFiltersQueryDto,
) {
  @IsOptional()
  @IsEnum(CatalogMode)
  mode?: CatalogMode;
}

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get(':category')
  getCatalogItems(
    @Query() query: CatalogQueryDto,
    @Param('category', new ParseEnumPipe(CatalogCategory))
    category: CatalogCategory,
  ): Promise<Paginated<CatalogItemDto>> {
    const { page, limit, mode, segment, topic } = query;

    let kind: CatalogKind | undefined;

    if (mode) {
      kind = MODE_KIND_MAP[category]?.[mode];
    }

    return this.catalogService.getPaginated(
      { segment, topic, kind },
      { page, limit },
    );
  }
}
