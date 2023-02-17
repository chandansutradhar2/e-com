import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [VendorController],
  providers: [VendorService]
})
export class VendorModule {}
