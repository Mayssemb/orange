import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PfeModule } from './pfe/pfe.module';
import * as dotenv from 'dotenv';
dotenv.config();


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_TYPE:', process.env.DB_TYPE);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);


@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      type: 'postgres',
      
      
      
    }),
    UsersModule,
    AuthModule,
    PfeModule,
  ],
})
export class AppModule {} 