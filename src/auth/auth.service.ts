import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { promisify } from 'util';
import { scrypt as _ascrypt, randomBytes } from 'crypto'
import { UserRepo } from 'src/user/user.repo';
const scrypt = promisify(_ascrypt);
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

    constructor(private configService:ConfigService, private userRepo: UserRepo,private userSvc:UserService,
        private jwtService:JwtService) {
    
    }

    async validPassword(hashPass:string,password:string){
        const [salt,storedHash]=hashPass.split('.');
        const hash=(await scrypt(password,salt,32))as Buffer;
        if(storedHash !==hash.toString('hex')){
            return false;
        }
        return true;

    }

    //not used in our project
    async validateUser(mobileNo: string,email:string, pass: string): Promise<any> {
        const user = await this.userRepo.fetchUser(mobileNo,email);
        console.log(user);  
        const result=await this.validPassword(user.password,pass);
        console.log('password=>',result,pass)
        if (user &&  result) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    async signUp(user:User){
        const newUser=await this.userSvc.add(user);
        if(!newUser){
            return new NotFoundException()
        }
        console.log('newUser',newUser)
        const tokens=await this.generateToken(newUser[0].userId);
        const res=await this.refreshTokens(newUser[0].userId,tokens.refreshToken);
        console.log(res);
        return tokens;  


    }

    async generateToken(user:User){
        const [accessToken,refreshToken]=await Promise.all([
            
            this.jwtService.signAsync(
                {
                  sub: user.userId,
                user:user
                },
                {
                  secret: 'WwBW3LEuwFodloQs14Y83+u9N/F5AzWrdmoyCHQ9tEsz6iBQfh8HRUS+TwQ/cBhfJPCZPw8usVqP3llPxYEsM4yJjjnvvnWLG3MDBjieoONXXOBPxdXPpQOt2DSddICUn8TpCszqLTrgEvNUK9rvwk0arKtrVoVb+pWtlR7ojYUVAGcXOyOQvMRCLHl5zkURR1yKkasn+++mEFkjSuA61rNIDZ0dRdX2x6G8uRvnRZZAbXhp/Gqe9O+/vPObN1v2ZoLAMlrpJM9HCaejOhS/ENRATuXW3ILu0PkI+Wy5XmybGSw7u2yGuXtkfoSBUiDZjgRFMO5Um2fpTLFzjPCt/Q==',
                  expiresIn: '15m',
                },
              ),
              this.jwtService.signAsync(
                {
                  sub: user.userId,
                  user:user
               },
                {
                  secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                  expiresIn: '7d',
                },
              ),
        ]);

        return {
            accessToken,refreshToken
        }
    }


    
  async updateRefreshToken(userId: string, refreshToken: string) {

    const hashedRefreshToken = (await scrypt(refreshToken,'salt',32))as Buffer;
    console.log(hashedRefreshToken.toString('hex'));
    return await this.userSvc.updateRefreshToken(userId, hashedRefreshToken.toString('hex'));

  }

  async validateRefreshToken(hashRefreshToken,refreshToken){

    const hash=(await scrypt(refreshToken,'salt',32))as Buffer;
    if(hashRefreshToken !==hash.toString('hex')){
        return false;
    }
    return true;
    
  }


  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userSvc.byId(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this.validateRefreshToken(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateToken(user.id);
    await this.refreshTokens(user.id, tokens.refreshToken);
    return tokens;
  }

    async loginWithMobileNo(mobileNo: string, password: string) {
        const user=await this.userRepo.fetchUser(mobileNo);
        console.log(user);
        if(!user){
            return new NotFoundException('user not found');
        }
       const result=await this.validPassword(user.password,password);
       console.log('result=>',result)
        if(result){

          const tokens=await this.generateToken(user);
          console.log('tokens',tokens)
          const res=await this.updateRefreshToken(user.userId,tokens.refreshToken);
          
          console.log(res);
          return tokens;  
        }else{
            return "invalid credentials"
        }
    
    }

    async loginWithEmail(email: string, password: string) {
        
         const user=await this.userRepo.fetchUser(email);
            if(!user){
                return new NotFoundException('user not found');
            }
           const result=this.validPassword(user.password,password);
            if(result){
                const tokens=await this.generateToken(user);
                const res=await this.updateRefreshToken(user.userId,tokens.refreshToken);
          
            }else{
                return "invalid credentials"
            }
    }

    
    async signOut(userId:string,refreshToken){
        this.userSvc.updateRefreshToken(userId, null);

    }

    async resetPassword(){

    }

    async sendOtp(){

    }

}
