import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { scrypt as _ascrypt, randomBytes } from 'crypto'
import { Neo4jService } from 'nest-neo4j/dist';
import { User } from 'src/entities/user.entity';
import { UserRepo } from './user.repo';
import { promisify } from 'util';

const scrypt = promisify(_ascrypt);


@Injectable()
export class UserService {
    constructor(private neo: Neo4jService, private userRepo: UserRepo) {
    }

    async findAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.neo.read(`MATCH (n:User) return n`).then((result) => {
                console.log(result.summary)
                resolve(result.records)
            })
        })
    }

    async add(user: User):Promise<User> {
        try {
            const exists = await this.userRepo.userExists(user.email, user.mobileNo);
            if (exists) throw new BadRequestException('user already exists with same email/mobileNo combination');

            const salt = randomBytes(8).toString('hex');
            const hash = (await scrypt(user.password, salt, 32)) as Buffer
            const result = salt + '.' + hash.toString('hex');
            user.password = result;
            

            return await this.userRepo.createUser(user);
            
        } catch (error) {
            throw new HttpException({ reason: error }, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    async updateRefreshToken(userId:string,refreshToken:string ){
        console.log('userId=>',userId,'refreshToken=>',refreshToken)
        return await this.userRepo.updateRefreshToken(userId,refreshToken);
    }
    
    async byId(id: string) {
        return await this.userRepo.findUserById(id);    
    }

    byEmail(email: string) {

    }

    byMobile(mobileNo: string) {

    }

    update(user: User) {

    }

    activate(userId: string) {

    }

    deactivate(status: boolean, userId: string) {

    }

    delete(userId: string) {

    }

    updateProfile(user: User) {

    }

    updateProfileImage() {

    }
}