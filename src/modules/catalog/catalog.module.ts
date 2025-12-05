import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogView } from './catalog.view';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogView])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
