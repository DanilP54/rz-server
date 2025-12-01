import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorController } from './contributor.controller';
import { ContributorService } from './contributor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor])],
  controllers: [ContributorController],
  providers: [ContributorService],
  exports: [ContributorService],
})
export class ContributorModule {}
