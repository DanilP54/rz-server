import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieCredit } from "./movie-credit.entity";


@Module({
  imports: [TypeOrmModule.forFeature([MovieCredit])],
})
export class MovieCreditModule {}