import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { SongService } from './song/song.service';
import { SongController } from './song/song.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, SongController],
  providers: [AppService, AuthService, SongService],
})
export class AppModule {}
