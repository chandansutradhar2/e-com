export class UserCreatedEvent{
 
    constructor(payload:{
        sourceIp?:string;
        destinationIp:string;
        createdBy:string;
        createrName:string;
        createdOn:number;
    }){}
    
}