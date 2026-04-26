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

@Controller('users') // base route: /users
export class UsersController {
  constructor(private usersService: UsersService) {}

  // POST /users
  @Post()
  create(@Body() body: any) {
  //   if (!body.email.endsWith('@orange.tn')) {
  //   throw new Error('Email must end with @orange.tn');
  // }
  
    return this.usersService.create(body);
  }

  // GET /users/email?email=test@gmail.com
  @Get('/email')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/1
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(parseInt(id), body);
  } 
  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body('password') password: string) {
    return this.usersService.updatePassword(parseInt(id), password);
  } 
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(parseInt(id));
  }
}
