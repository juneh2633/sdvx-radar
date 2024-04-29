import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccountEntity } from 'src/auth/entity/account.entity';
import { ScoreEntity } from 'src/score/entity/score.entity';
import { DifficultiesEntity } from 'src/song/entity/difficulties.entity';
import { SongEntity } from 'src/song/entity/song.entity';

@Injectable()
export class TypeOrmConfigService {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [SongEntity, DifficultiesEntity, AccountEntity, ScoreEntity],
    };
  }
}
