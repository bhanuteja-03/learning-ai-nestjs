import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [UploadsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
