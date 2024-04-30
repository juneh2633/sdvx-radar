import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { SongRepository } from './song.repository';

@Module({
  imports: [],
  providers: [SongService, SongRepository],
  controllers: [SongController],
})
export class SongModule {}
