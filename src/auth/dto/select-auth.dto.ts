import { IsString } from 'class-validator';

export class SelectAuthDto {
  @IsString()
  readonly id?: string;
  @IsString()
  readonly pw?: string;
}
