import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';

export const TopicValue = [
  'aesthetics',
  'self-expression',
  'live',
  'documentary',
  'series',
] as const;
export type TopicValueType = (typeof TopicValue)[number];

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TopicValue })
  slug: TopicValueType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Movie, (movie) => movie.topic)
  movies: Movie[];
}
