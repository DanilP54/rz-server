import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContentConfig } from './entity-names';
import { Segment, Topic } from './enums';
import { Transform } from 'class-transformer';

export type Segments = 'instincts' | 'intellect' | 'balance';
export type ContentType = keyof typeof ContentConfig;
export type ViewMode = 'content' | 'authors';


export interface IBaseQuery {
    segment?: Segment;
    topic?: Topic;
    page?: number;
    limit?: number;
  }
  
export class BaseQuery implements IBaseQuery {
    
    @IsOptional()
    @IsEnum(Segment, {message: 'incorrect segment name'})
    segment: Segment
    
    @IsOptional()
    @IsEnum(Topic, {message: 'incorect topic value'})
    topic: Topic
    
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value === undefined || value === '' ? undefined : Number(value)))
    page: number
    
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value === undefined || value === '' ? undefined : Number(value)))
    limit: number
}