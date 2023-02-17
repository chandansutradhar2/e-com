import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepo } from 'src/user/user.repo';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[UserModule],
  controllers: [AuthController],
  providers: [AuthService,UserRepo,JwtService],
  
})
export class AuthModule {}
