import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Segment } from '../segment/segment.entity';
import { Topic } from '../topic/topic.entity';
import { MovieCredit } from '../movie-credit/movie-credit.entity';

@Entity('movies')
@Unique(['title', 'slug'])
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  coverUrl: string;

  @Column({ length: 100 })
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column('int')
  segmentId: number;

  @Column('int')
  topicId: number;

  @ManyToOne(() => Segment, (segment) => segment.movies)
  @JoinColumn({ name: 'segmentId' })
  segment: Segment;

  @ManyToOne(() => Topic, (topic) => topic.movies)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @OneToMany(() => MovieCredit, (movieCredit) => movieCredit.movie)
  public movieCredit: MovieCredit[];
}
