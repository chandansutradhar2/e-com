import { Controller,Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {

    
  }


  @UseGuards(new AccessTokenGuard())  
  @Get()
    async findAll(){
      return await this.userService.findAll();
    }

    @Get('/product/show')
    sendAllproduct(){
      return 'product list here'
    }  
  }
