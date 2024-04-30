import { Controller, Get, Param, Query, Response } from '@nestjs/common';
import { SongService } from './song.service';
import { SelectSongPagerbleDto } from './dto/select-song-pagerble.dto';
import { SelectSongByIdDto } from './dto/select-song-id.dto';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get('/all')
  public async findSongs(@Query() pagerbleDto: SelectSongPagerbleDto) {
    return await this.songService.getSongAll(pagerbleDto);
  }

  @Get('/:id')
  public async findSongByid(@Param() songByDto: SelectSongByIdDto) {
    return await this.songService.getSongById(songByDto);
  }
}
