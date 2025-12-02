import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,

    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,

    @InjectRepository(Enrollment)
    private readonly enrollRepo: Repository<Enrollment>,
  ) {}

  async markAttendance(eventId: string, studentId: number, teacherId: number) {
    const event = await this.eventsRepo.findOne({
      where: { id: eventId },
      relations: ['teacher'],
    });

    if (!event) throw new NotFoundException('El evento no existe');

    if (event.teacher.id !== teacherId)
      throw new ForbiddenException(
        'No tienes permiso para marcar asistencia en este evento',
      );

    const enrollment = await this.enrollRepo.findOne({
      where: {
        student: { id: studentId } as any,
        event: { id: eventId } as any,
      },
    });

    if (!enrollment)
      throw new ForbiddenException(
        'El estudiante no está inscrito en este evento',
      );

    const existing = await this.repo.findOne({
      where: {
        student: { id: studentId } as any,
        event: { id: eventId } as any,
      },
    });

    if (existing) throw new ConflictException('Asistencia ya registrada');

    const attendance = this.repo.create({
      student: { id: studentId } as any,
      event: { id: eventId } as any,
    });

    return this.repo.save(attendance);
  }

  async updateAttendance(attendanceId: string, teacherId: number) {
    const attendance = await this.repo.findOne({
      where: { id: attendanceId },
      relations: ['event', 'event.teacher'],
    });

    if (!attendance)
      throw new NotFoundException('No se ha registrado asistencia todavía');

    if (attendance.event.teacher.id !== teacherId) {
      throw new ForbiddenException(
        'No tienes permiso de editar esta asistencia',
      );
    }

    return this.repo.save(attendance);
  }

  async listEventAttendance(eventId: string, teacherId: number) {
    const event = await this.eventsRepo.findOne({
      where: { id: eventId },
      relations: ['teacher'],
    });

    if (!event) throw new NotFoundException('El evento no existe');

    if (event.teacher.id !== teacherId)
      throw new ForbiddenException(
        'No tienes permiso para ver asistencias de este evento',
      );

    return this.repo.find({
      where: { event: { id: eventId } as any },
      order: { createdAt: 'ASC' },
    });
  }

  async listMyAttendance(studentId: number) {
    return this.repo.find({
      where: { student: { id: studentId } as any },
      order: { createdAt: 'DESC' },
    });
  }
}
