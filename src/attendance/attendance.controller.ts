import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
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

  @Roles('estudiante')
  @Get('my-history')
  myHistory(@Req() req: any) {
    return this.service.listMyAttendance(req.user.userId);
  }
}
