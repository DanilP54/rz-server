import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { BrowseCategory } from './enums';

export interface IBrowseParam {
    category: BrowseCategory
}

export class BrowseParam implements IBrowseParam {
  @IsEnum(BrowseCategory, {
    message: 'category must be a valid BrowseCategory enum value',
  })
  @Transform(({ value }) => value?.toLowerCase())
  category: BrowseCategory;
}
