import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.listActive({ from, to });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles('docente')
  @Post()
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    const teacherId = req.user.userId;

    return this.service.create(dto, teacherId);
  }

  @Roles('docente')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, Number(req.user.userId));
  }

  @Roles('docente')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, Number(req.user.userId));
  }
}
