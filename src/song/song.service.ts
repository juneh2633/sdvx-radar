import { Injectable } from '@nestjs/common';
import { SongRepository } from './song.repository';
import { SelectSongPagerbleDto } from './dto/select-song-pagerble.dto';
import { SelectSongByIdDto } from './dto/select-song-id.dto';
import { SongEntity } from './entity/song.entity';

@Injectable()
export class SongService {
  constructor(private readonly songRepository: SongRepository) {}

  public async getSongById(selectDto: SelectSongByIdDto): Promise<SongEntity> {
    return await this.songRepository.selectSongById({
      id: selectDto.id,
    });
  }

  public async getSongAll(
    selectDto: SelectSongPagerbleDto,
  ): Promise<SongEntity[]> {
    return await this.songRepository.selectSongAll({
      limit: 10,
      offset: (selectDto.page - 1) * 10,
    });
  }
}
