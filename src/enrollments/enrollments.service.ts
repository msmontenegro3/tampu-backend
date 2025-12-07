import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollRepo: Repository<Enrollment>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async enroll(eventId: string, studentId: number) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['teacher'],
    });

    if (!event) {
      throw new NotFoundException('El evento no existe');
    }

    const today = new Date().toISOString().slice(0, 10);
    if (event.date < today) {
      throw new ConflictException(
        'No puedes inscribirte en un evento que ya ha pasado',
      );
    }

    const existing = await this.enrollRepo.findOne({
      where: {
        event: { id: eventId } as any,
        student: { id: studentId } as any,
      },
    });

    if (existing) {
      throw new ConflictException('Ya estás inscrito en este evento');
    }

    const enrollment = this.enrollRepo.create({
      event: { id: eventId } as any,
      student: { id: studentId } as any,
    });

    return this.enrollRepo.save(enrollment);
  }

  async listByEvent(eventId: string, teacherId: number) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['teacher'],
    });

    if (!event) {
      throw new NotFoundException('El evento no existe');
    }

    if (event.teacher.id !== teacherId) {
      throw new ForbiddenException(
        'No tienes permiso para ver las inscripciones de este evento',
      );
    }

    return this.enrollRepo.find({
      where: { event: { id: eventId } as any },
      order: { createdAt: 'ASC' },
    });
  }

  async listMyEvents(studentId: number) {
    const enrolls = await this.enrollRepo.find({
      where: { student: { id: studentId } as any },
      order: { createdAt: 'DESC' },
    });

    return enrolls.map((e) => e.event.id);
  }

  async unenroll(eventId: string, studentId: number) {
    const enrollment = await this.enrollRepo.findOne({
      where: {
        event: { id: eventId },
        student: { id: studentId },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('No estás inscrito');
    }

    await this.enrollRepo.remove(enrollment);
    return { message: 'Desincripción exitosa' };
  }

  async isEnrolled(eventId: string, studentId: number) {
    const exists = await this.enrollRepo.findOne({
      where: {
        event: { id: eventId },
        student: { id: studentId },
      },
    });

    return { enrolled: !!exists };
  }
}
