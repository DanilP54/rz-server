import { Controller, Get } from '@nestjs/common';
import { ContributorService } from './contributor.service';

@Controller('contributor')
export class ContributorController {
  constructor(private readonly service: ContributorService) {}

  @Get()
  findAll() {
    return ''
  }
}
