import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  id: string;
}
