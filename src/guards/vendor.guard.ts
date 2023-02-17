import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { USER_TYPE } from 'src/user/dtos/create-user.dto';

@Injectable()
export class VendorAuthGuard implements CanActivate {
  
    canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization);
    if(request.headers.authorization){

        const [text,token]=request.headers.authorization.split(" ");
        // const payload=this.jwtSvc.decode(token,{
        //     json:true
        // })
        // console.log('from vendorauthguard', payload)
    }        
    return true;
  }
}