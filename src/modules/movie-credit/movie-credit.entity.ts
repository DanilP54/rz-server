import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { Contributor } from '../contributor/contributor.entity';
import { Role } from '../role/role.entity';

export enum ContributorRole {
  Director = 'director',
  Producer = 'producer',
  Actor = 'actor',
  Screenwriter = 'screenwriter',
  Cinematographer = 'cinematographer',
}

@Entity('movie_credits')
@Unique(['contributorId', 'movieId', 'roleId'])
export class MovieCredit {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'movieId', type: 'uuid' })
  movieId: string;

  @Column({ name: 'contributorId', type: 'uuid' })
  contributorId: string;

  @Column()
  roleId: number;

  @ManyToOne(() => Role)
  @JoinColumn({name: 'roleId'})
  role: Role

  @ManyToOne(() => Movie, (movie) => movie.movieCredit)
  @JoinColumn({ name: 'movieId' })
  public movie: Movie;

  @ManyToOne(() => Contributor, (contributor) => contributor.movieCredit)
  @JoinColumn({ name: 'contributorId' })
  public contributor: Contributor;
}
