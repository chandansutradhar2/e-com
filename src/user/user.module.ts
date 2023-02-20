import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepo } from './user.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [UserController],
  providers: [UserService,UserRepo],
  exports:[UserService],
  imports:[
    ClientsModule.register([
      { name: 'NOTIFICATION_SVC', transport: Transport.TCP },
    ]),
  ]
})
export class UserModule {}
