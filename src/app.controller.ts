import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(@Inject('NOTIFICATION_SVC') private readonly  notificationSvc:ClientProxy, private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/event')
  generateNotification(){
    this.notificationSvc.emit('EVENT_GENERATED','{channel:["sms","whatsapp"}, :sendTo:["8080811155","808263533"],msg:"message sent from app controller of ecom app"');
  }
}
