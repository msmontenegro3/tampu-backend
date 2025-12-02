import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Event } from 'src/events/entities/event.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Event, Enrollment])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
