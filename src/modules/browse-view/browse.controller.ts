import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { BrowseService } from './browse.service';
import { BrowseQuery } from './browse-query';
import { BrowseParam } from './browse-param';
import { BrowseCategory, BrowseMode, KindLabel } from './enums';

@Controller('browse')
export class BrowseController {
  constructor(private readonly browseService: BrowseService) {}

  @Get(':category')
  findAll(@Query() query: BrowseQuery, @Param() param: BrowseParam) {
    const { page, limit, mode, segment, topic } = query;
    const { category } = param;

    const kind = this.resolveKindLabel(category, mode)

    return this.browseService.findAll({
      segment,
      topic,
      kind,
      page,
      limit
    });
  }

  private resolveKindLabel(
    category: BrowseCategory,
    mode?: BrowseMode,
  ): KindLabel | undefined {
    if (!mode) return undefined;

    const KIND_MAPPING = {
      [BrowseCategory.MOVIES]: {
        [BrowseMode.WORKS]: KindLabel.MOVIE,
        [BrowseMode.CREATORS]: KindLabel.MOVIE_CREATOR,
      },
    };

    const categoryModes = KIND_MAPPING[category];

    if (!categoryModes) {
      throw new BadRequestException(`Unsupported category: ${category}`);
    }

    const label = categoryModes[mode];

    if (!label) {
      throw new BadRequestException(
        `Unsupported mode: ${mode} for category: ${category}`,
      );
    }

    return label;
  }
}
