import { BadRequestException, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { Neo4jService } from "nest-neo4j/dist";
import { User } from "src/entities/user.entity";


@Injectable()
export class UserRepo{

    constructor(private neo: Neo4jService) {
    
    }

   async createUser(user:User):Promise<any>{
    return new Promise(async (resolve,reject)=>{
        const insertQueryRes = await this.neo.write(`CREATE (u:User {userId:apoc.create.uuid(), firstName: "${user.firstName}", lastName: "${user.lastName}", email:"${user.email}", mobileNo:"${user.mobileNo}", password:"${user.password}", createdOn:"${user.createdOn}", userType:"${user.userType}", enabled:"${user.enabled}" }) return u`);
        console.log(`cretaeusre()`,insertQueryRes.records)
        insertQueryRes.records.length>0?resolve(insertQueryRes.records.map((r)=>r.get('u')["properties"] )):resolve(false);
    })
    }

 async userExists(email,mobileNo):Promise<boolean>{
    const queryres = await this.neo.read(`MATCH (u:User) WHERE u.email=$email AND u.mobileNo=$mobileNo return u`, { email: email, mobileNo: mobileNo });
    return queryres.records.length>0?true:false;
 }

async findUserById(userId:string):Promise<any>{
    let querres=await this.neo.read(`MATCH (u:User) WHERE u.userId=$userId RETURN u`,{userId:userId});
   if(querres.records.length>0){
   querres.records.map((row)=>{return row.get('u')['properties']as User})}else{
    throw new NotFoundException
   }
}

 async fetchUser(mobileNo?:string,email?:string):Promise<User>{
    let queryres;
    if(mobileNo && mobileNo.length>0){
        queryres = await this.neo.read(`MATCH (u:User) WHERE u.mobileNo=$mobileNo return u as user`, { mobileNo: mobileNo });
        
    }else if(email && email.length>0){
    queryres = await this.neo.read(`MATCH (u:User) WHERE u.email=$email return u`, { email: email });

    }else{
        throw new NotFoundException('user not found ')
    }

    let user:User;
    if(queryres.records.length>0){
        queryres.records.map((row)=>{
            //console.log(row);
            user=row.get('user')["properties"];
          
         })  
        return user;
    }else{
        throw new NotFoundException('user not found')
    } 
 }

 async updateRefreshToken(userId:string,refreshToken:string){
    try {
        const queryres=await this.neo.write(`MATCH (u:User {userId: "${userId}"}) SET u.refreshToken=$refreshToken RETURN u`,{refreshToken:refreshToken});
        return queryres.records.length>0?true:false;;
    } catch (error) {
        console.log(error);
       return new ServiceUnavailableException(error); 
    }
 }

}