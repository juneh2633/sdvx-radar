import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DifficultiesEntity } from './difficulties.entity';

@Entity('song')
export class SongEntity {
  @PrimaryColumn()
  song_id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  ascii: string;

  @Column()
  version: string;

  @Column()
  bpm: string;

  @Column()
  date: Date;

  @OneToMany(() => DifficultiesEntity, (difficulties) => difficulties.song)
  difficulties: DifficultiesEntity[];
}
