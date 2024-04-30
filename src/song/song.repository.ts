import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SongEntity } from './entity/song.entity';
import { InsertSongDao } from './dao/insert-song.dao';
import { SelectSongDao } from './dao/select-song.dao';
import SelectSongAllDao from './dao/select-song-all.dao';
import SelectDifficultiesDao from './dao/select-difficulties.dao';
import { DifficultiesEntity } from './entity/difficulties.entity';

@Injectable()
export class SongRepository {
  private songRepository: Repository<SongEntity>;
  private difficultiesRepository: Repository<DifficultiesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.songRepository = this.dataSource.getRepository(SongEntity);
    this.difficultiesRepository =
      this.dataSource.getRepository(DifficultiesEntity);
  }

  async selectSongById(selectDao: SelectSongDao): Promise<SongEntity> {
    return await this.songRepository.findOne({
      where: {
        song_id: selectDao.id,
      },
    });
  }

  async selectSongAll(selectDao: SelectSongAllDao): Promise<SongEntity[]> {
    return await this.songRepository.find({
      take: selectDao.limit,
      skip: selectDao.offset,
      order: {
        song_id: 'ASC',
      },
    });
  }
  async insertSong(createDao: InsertSongDao): Promise<void> {
    await this.songRepository.save(createDao.songEntity);
  }

  async selectDifficultiesBySongId(
    selectDao: SelectDifficultiesDao,
  ): Promise<DifficultiesEntity[]> {
    return await this.difficultiesRepository.find({
      where: {
        song_id: selectDao.songId,
      },
      order: {
        level: 'ASC',
      },
    });
  }
}
