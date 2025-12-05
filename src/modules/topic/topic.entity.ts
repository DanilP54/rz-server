import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { Topics } from 'src/common/enums/topic';


@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Topics })
  slug: Topics;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Movie, (movie) => movie.topic)
  movies: Movie[];
}
