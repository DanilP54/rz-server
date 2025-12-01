import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';

export const SegmentSlugs = ['instincts', 'intellect', 'balance'] as const;
export type SegmentSlugsType = (typeof SegmentSlugs)[number];

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SegmentSlugs })
  slug: SegmentSlugsType;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  colorCode: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Movie, (movie) => movie.segment)
  movies: Movie[];
}
