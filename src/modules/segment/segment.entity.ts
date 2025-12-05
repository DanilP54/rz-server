import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { Segments } from 'src/common/enums/segment';


@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Segments })
  slug: Segments;

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
