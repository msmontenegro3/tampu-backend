import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AttendanceService } from './attendance.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Roles('docente')
  @Post(':eventId/:studentId')
  mark(
    @Param('eventId') eventId: string,
    @Param('studentId') studentId: number,
    @Req() req: any,
  ) {
    return this.service.markAttendance(eventId, +studentId, req.user.userId);
  }

  @Roles('docente')
  @Delete(':eventId/:studentId')
  remove(
    @Param('eventId') eventId: string,
    @Param('studentId') studentId: number,
    @Req() req: any,
  ) {
    return this.service.removeAttendance(eventId, +studentId, req.user.userId);
  }

  @Roles('estudiante')
  @Get('my-history')
  myHistory(@Req() req: any) {
    return this.service.listMyAttendance(req.user.userId);
  }

  @Roles('docente')
  @Get('event/:eventId')
  listEventAttendance(@Param('eventId') eventId: string, @Req() req: any) {
    return this.service.listEventAttendance(eventId, req.user.userId);
  }
}
