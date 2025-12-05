import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  async getMovie(
    @Param('id', new ParseUUIDPipe()) id: UUID,
  ) {
    return this.movieService.getMovie(id);
  }
}
