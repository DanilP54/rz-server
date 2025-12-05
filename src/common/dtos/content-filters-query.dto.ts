import { IsEnum, IsOptional } from "class-validator";
import { Segments } from "../enums/segment";
import { Topics } from "../enums/topic";

export class ContentFiltersQueryDto {
    @IsOptional()
    @IsEnum(Segments, { message: 'Incorrect segment' })
    segment?: Segments;
  
    @IsOptional()
    @IsEnum(Topics, { message: 'Incorrect topic' })
    topic?: Topics;
  }