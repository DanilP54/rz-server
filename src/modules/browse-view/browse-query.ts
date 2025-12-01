import { IsEnum, IsOptional } from 'class-validator';
import { BaseQuery, IBaseQuery } from 'src/common/type';
import { BrowseMode } from './enums';

export interface IBrowseQuery extends IBaseQuery {
  mode?: BrowseMode;
}

export class BrowseQuery extends BaseQuery implements IBrowseQuery {
  @IsOptional()
  @IsEnum(BrowseMode, {
    message: 'view mode is incorrect',
  })
  mode: BrowseMode;
}
