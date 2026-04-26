import { Controller, Post, Get, Body, Req, UseGuards, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Public } from '../common/decorators/public.decorator';
import { PfeService } from './pfe.service';
import { Status } from 'src/common/enums/status.enum';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pfe')
export class PfeController {
  constructor(private service: PfeService) {}

  @Post()
  @Roles(Role.TEAM_LEAD)
  create(@Body() dto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }
  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }
  

@Patch(':id')
@Roles(Role.HR)
updateStatus(
  @Param('id', ParseIntPipe) id: number,
  @Body('status') status: Status,
) {
  return this.service.updateStatus(id, status);
}
@Patch(':id/owner')
updateOwner(
  @Param('id', ParseIntPipe) id: number,
  @Body('teamLeadId', ParseIntPipe) teamLeadId: number, 
) {
  return this.service.updateOwner(id, teamLeadId);
}
@Delete(':id')
delete(@Param('id', ParseIntPipe) id: number) {
  return this.service.delete(id); 

}
}
