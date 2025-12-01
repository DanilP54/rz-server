import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { BrowseQueryBuilder } from './browse-query-builder';
import { Contributor } from '../contributor/contributor.entity';
import { Role } from '../role/role.entity';
import { KindLabel } from './enums';
import { Segment, Topic } from 'src/common/enums';
import { type Payload } from './payload';
import { MovieBrowseQueryDescriptor } from './browse-query-builder';

@ViewEntity({
  name: 'browse-view',
  expression: (dataSource: DataSource) => {
    return new BrowseQueryBuilder(dataSource, Contributor, Role)
      .add(new MovieBrowseQueryDescriptor())
      .build();
  },
})
export class BrowseView {
  @ViewColumn()
  id: string;
  @ViewColumn()
  title: string;
  @ViewColumn()
  subTitle: string;
  @ViewColumn()
  coverUrl: string;
  @ViewColumn()
  kind: KindLabel;
  @ViewColumn()
  segment: Segment;
  @ViewColumn()
  topic: Topic;
  @ViewColumn()
  createdAt: Date;
  @ViewColumn()
  payload: Payload | null;
}
