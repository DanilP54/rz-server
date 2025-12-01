import { Module } from '@nestjs/common';
import { BrowseController } from './browse.controller';
import { BrowseService } from './browse.service';
import { MovieModule } from '../movie/movie.module';
import { ContributorModule } from '../contributor/contributor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrowseView } from './browse.view';
import { MovieCreditModule } from '../movie-credit/movie-credit.module';
import { RoleModule } from '../role/role.module';
import { SegmentModule } from '../segment/segment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrowseView]),
    MovieModule,
    MovieCreditModule,
    RoleModule,
    SegmentModule,
    ContributorModule,
  ],
  controllers: [BrowseController],
  providers: [BrowseService],
})
export class BrowseCardModule {}
