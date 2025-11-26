import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { log } from 'console';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.listActive({ from, to });
  }

  @Post()
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    const teacherId = req.user.userId;
    console.log('CONTROLADOR teacherId', teacherId);

    return this.service.create(dto, teacherId);
  }
}
