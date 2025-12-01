import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Segment } from '../segment/segment.entity';
import { Topic } from '../topic/topic.entity';
import { MovieCredit } from '../movie-credit/movie-credit.entity';
import { ContentEntity } from 'src/common/entity/content';

@Entity('movies')
export class Movie extends ContentEntity {
  @ManyToOne(() => Segment, (segment) => segment.movies)
  @JoinColumn({ name: 'segmentId' })
  segment: Segment;

  @ManyToOne(() => Topic, (topic) => topic.movies)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @OneToMany(() => MovieCredit, (movieCredit) => movieCredit.movie)
  public movieCredit: MovieCredit[];
}
