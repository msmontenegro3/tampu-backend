import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

export type UserRole = 'docente' | 'estudiante';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['docente', 'estudiante'],
    default: 'estudiante',
  })
  rol: UserRole;

  /* @OneToMany(() => event.teacher);
  @OneToMany(() => Enrollment, (enrollment) => enrollment.student) */
}
