import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
// import { Movie } from '../movie/movie.entity';
import { MovieCredit } from '../movie-credit/movie-credit.entity';

enum Contributor_Type {
  BAND = 'band',
  PERSON = 'person',
}

@Entity('contributors')
@Unique(['displayName', 'slug'])
export class Contributor {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ length: 100 })
  displayName: string;

  @Column({ length: 255, nullable: true })
  firstName: string;

  @Column({ length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: Contributor_Type })
  type: Contributor_Type;

  @Column('text')
  photoUrl: string;

  @Column({ length: 100 })
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => MovieCredit, (movieCredit) => movieCredit.contributor)
  public movieCredit: MovieCredit[];
}
