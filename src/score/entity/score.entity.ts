import { AccountEntity } from 'src/auth/entity/account.entity';
import { DifficultiesEntity } from 'src/song/entity/difficulties.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('score')
export class ScoreEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  expected_score: number;

  @ManyToOne(() => AccountEntity, (account) => account.idx)
  @JoinColumn({ name: 'user_idx' })
  user: AccountEntity;

  @OneToOne(() => DifficultiesEntity, (difficulties) => difficulties.idx)
  @JoinColumn({ name: 'difficulties_idx' })
  difficulties: DifficultiesEntity;
}
