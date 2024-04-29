import { SongEntity } from 'src/song/entity/song.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('difficulties')
export class DifficultiesEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int' })
  song_id: number;

  @Column({ type: 'varchar', nullable: true })
  type: string | null;

  @Column({ type: 'int', nullable: true })
  level: number | null;

  @Column({ type: 'int', nullable: true })
  max_exscore: number | null;

  @Column({ type: 'int', nullable: true })
  notes: number | null;

  @Column({ type: 'int', nullable: true })
  peak: number | null;

  @Column({ type: 'int', nullable: true })
  tsumami: number | null;

  @Column({ type: 'int', nullable: true })
  tricky: number | null;

  @Column({ type: 'int', nullable: true })
  handtrip: number | null;

  @Column({ type: 'int', nullable: true })
  onehand: number | null;

  @ManyToOne(() => SongEntity, (song) => song.difficulties)
  @JoinColumn({ name: 'song_id' })
  song: SongEntity;
}
