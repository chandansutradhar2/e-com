import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {  Neo4jModule } from 'nest-neo4j/dist';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { VendorModule } from './vendor/vendor.module';
import { ClientModule } from './client/client.module';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `${process.env.NODE_ENV}.env`
  }),
  Neo4jModule.forRoot({
    scheme: 'neo4j+s',
    host: process.env.NEO4J_HOST,
    port: process.env.NEO4J_PORT,
    username: process.env.NEO4J_USERNAME,
    password: process.env.NEO4J_PASSWORD,
  }),
  ClientsModule.register([
    {
      name:'NOTIFICATION_SVC',
      transport:Transport.TCP,
      options:{
      port:3001
     } 
    }
  ]),
    JwtModule.register({
    secret:process.env.JWT_SECRET,    
  }),
    CatalogModule, OrderModule, AuthModule, UserModule, VendorModule,],
  controllers: [AppController],
  providers: [AppService,AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {

}
