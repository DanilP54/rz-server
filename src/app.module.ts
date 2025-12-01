import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/database/config.service';
import { SegmentModule } from './modules/segment/segment.module';
import { TopicModule } from './modules/topic/topic.module';
import { ContributorModule } from './modules/contributor/contributor.module';
import { MovieModule } from './modules/movie/movie.module';
import { BrowseCardModule } from './modules/browse-view/browse.module';
import { RoleModule } from './modules/role/role.module';
import { MovieCreditModule } from './modules/movie-credit/movie-credit.module';


const Modules = [
  SegmentModule,
  TopicModule,
  RoleModule,
  ContributorModule,
  MovieModule,
  MovieCreditModule,
  BrowseCardModule,
];

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ...Modules,
  ],
})
export class AppModule {}
