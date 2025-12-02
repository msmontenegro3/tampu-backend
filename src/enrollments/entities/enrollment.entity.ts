import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('enrollments')
@Unique(['student', 'event'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  student: User;

  @ManyToOne(() => Event, { eager: true, onDelete: 'CASCADE' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
