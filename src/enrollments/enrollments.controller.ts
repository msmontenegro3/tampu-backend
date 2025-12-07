import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { EnrollmentsService } from './enrollments.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Roles('estudiante')
  @Post(':eventId')
  enroll(@Param('eventId') eventId: string, @Req() req: any) {
    const studentId = req.user.userId;
    return this.service.enroll(eventId, studentId);
  }

  @Roles('estudiante')
  @Get('my-events')
  myEvents(@Req() req: any) {
    const studentId = req.user.userId;
    return this.service.listMyEvents(studentId);
  }

  @Roles('docente')
  @Get('by-event/:eventId')
  listByEvent(@Param('eventId') eventId: string, @Req() req: any) {
    const teacherId = req.user.userId;
    return this.service.listByEvent(eventId, teacherId);
  }

  @Roles('estudiante')
  @Delete(':eventId')
  unenroll(@Param('eventId') eventId: string, @Req() req) {
    return this.service.unenroll(eventId, req.user.userId);
  }

  @Roles('estudiante')
  @Get('event/:eventId/is-enrolled')
  isEnrroled(@Param('eventId') eventId: string, @Req() req) {
    return this.service.isEnrolled(eventId, req.user.userId);
  }
}
