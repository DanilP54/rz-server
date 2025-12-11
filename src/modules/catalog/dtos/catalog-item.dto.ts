import { Segments } from 'src/common/enums/segment';
import { Topics } from 'src/common/enums/topic';
import { CatalogMeta } from '../types';
import { CatalogKind } from '../enums';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

const parsePgArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value;
  if (!value || value === '{}') return [];

  if (typeof value === 'string') {
    return value.replace(/^\{|\}$/g, '').split(',');
  }
  return [];
};

export class CatalogItemDto {
  
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  subtitle: string;
  @Expose()
  coverUrl: string;
  @Expose()
  kind: CatalogKind;
  @Expose()
  currentSegment: Segments | null;
  @Expose()
  currentTopic: Topics | null;
  @Expose()
  metadata: CatalogMeta | null;

  
  @Exclude()
  @Transform(({value}) => parsePgArray(value))
  segment: Segments[];
  @Exclude()
  @Transform(({value}) => parsePgArray(value))
  topic: Topics[];
  @Exclude()
  pairs: string[];
  @Exclude()
  createdAt: string;
}
