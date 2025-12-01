import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Segment } from "../segment/segment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Segment])],
})
export class SegmentModule {}