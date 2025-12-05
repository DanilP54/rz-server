import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';

export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
  ) {}

  async getMovie(id: UUID) {
    const builder = this.repository.createQueryBuilder('m');
    return await builder
    .where('m.id = :id', { id })
    .leftJoin("m.segment", "segment")
    .leftJoin("m.topic", "topic")
    .getOne();
  }
}
