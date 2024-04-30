import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SelectSongPagerbleDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}
