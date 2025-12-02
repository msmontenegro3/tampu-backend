import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Event])],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
})
export class EnrollmentsModule {}
