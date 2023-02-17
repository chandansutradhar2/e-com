import { Controller, Post, Get, Body, Param, Session, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { LoginInterceptor } from './login.interceptor';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { User } from 'src/entities/user.entity';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseInterceptors(LoginInterceptor)

  @Post('/signin')
  async signIn(@Body() body: LoginDTO) {
    return body.email ? await this.authService.loginWithEmail(body.email, body.password) : await this.authService.loginWithMobileNo(body.mobileNo, body.password);

  }

  @Post('/signup')
  async signup(@Body() user: CreateUserDTO) {
    let userEntity: User = {
      createdOn: Date.now(),
      email: user.email,
      enabled: true,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNo: user.mobileNo,
      userType: user.userType,
      password: user.password,

    }
    return await this.authService.signUp(userEntity);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/signout')
  signOut(@Req() req: Request) {
    this.authService.signOut(req.user['sub'],null);

  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(@Req() req: Request) {
    console.log(req.user)
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userId, refreshToken);
  }
  
  @UseGuards(AccessTokenGuard)
  @Get('/protected')
  async protectedRoute(){
    return "protected route test"
  }
}
