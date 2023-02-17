import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, NotAcceptableException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoginInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
      
        console.log(request.body);
        
        if ((request.body.email === null || request.body.email === undefined) && (request.body.mobileNo === null || request.body.mobileNo === undefined)) {
            return next
                .handle()
                .pipe(
                    catchError(err => throwError(() => new BadRequestException('email/mobileNo is required'))),
                );
        } 

        return next
            .handle()
            

        //suneel ..mcc code and invoice in pdf

    }
}