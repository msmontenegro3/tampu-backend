import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
  ) {}

  async listActive(params?: { from?: string; to?: string }) {
    const where: FindOptionsWhere<Event> = {};
    if (params?.from) (where as any).date = MoreThanOrEqual(params.from);

    if (params?.to) {
      const existing = (where as any).date;
      (where as any).date = existing
        ? { ...existing, ...{ [LessThanOrEqual.prototype as any]: params.to } }
        : LessThanOrEqual(params.to);
    }
    return this.repo.find({ where, order: { date: 'ASC', time: 'ASC' } });
  }

  async create(dto: CreateEventDto, teacherId: number) {
    const event = this.repo.create({
      ...dto,
      teacher: { id: teacherId } as any,
    });
    return this.repo.save(event);
  }

  async update(id: string, dto: UpdateEventDto, teacherId: number) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('El evento no existe');

    if (event.teacher.id !== teacherId)
      throw new ForbiddenException('No tienes permiso para editar este evento');

    Object.assign(event, dto);
    return this.repo.save(event);
  }

  async remove(id: string, teacherId: number) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) return;

    if (event.teacher.id !== teacherId)
      throw new ForbiddenException(
        'No tienes permiso para eliminar este evento',
      );
    await this.repo.remove(event);
  }
}
