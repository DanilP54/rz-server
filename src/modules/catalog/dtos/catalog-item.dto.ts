import { Segments } from 'src/common/enums/segment';
import { Topics } from 'src/common/enums/topic';
import { CatalogMeta } from '../types';
import { CatalogKind } from '../enums';
import { Exclude, Expose } from 'class-transformer';

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
  segment: Segments;
  @Expose()
  topic: Topics;
  metadata: CatalogMeta | null;
  @Exclude()
  createdAt: string;
}
