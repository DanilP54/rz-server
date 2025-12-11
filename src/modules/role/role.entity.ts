import { RoleScope } from 'src/common/enums/role';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('roles')
@Unique(['slug'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  displayName: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ type: 'enum', enum: RoleScope, default: RoleScope.GLOBAL })
  scope: RoleScope;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
