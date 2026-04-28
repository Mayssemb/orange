import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Patch,
  Delete
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';


@Controller('users') 
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN) 
  create(@Body() body: any) {
  //   if (!body.email.endsWith('@orange.tn')) {
  //   throw new Error('Email must end with @orange.tn');
  // }
  
    return this.usersService.create(body);
  }

  @Get('/email')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Patch(':id')
  @Roles(Role.ADMIN) 

  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(parseInt(id), body);
  } 
  @Patch(':id/password')
  @Roles(Role.ADMIN, Role.HR, Role.TEAM_LEAD) 
  updatePassword(@Param('id') id: string, @Body('password') password: string) {
    return this.usersService.updatePassword(parseInt(id), password);
  } 
  @Delete(':id')
  @Roles(Role.ADMIN) 
  delete(@Param('id') id: string) {
    return this.usersService.delete(parseInt(id));
  }
}
