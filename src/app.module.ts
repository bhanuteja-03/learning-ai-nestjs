import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { PrismaModule } from './prisma/prisma.module';
import { DeepseekService } from './deepseek/deepseek.service';
@Module({
  imports: [UploadsModule, PrismaModule],
  controllers: [],
  providers: [DeepseekService],
})
export class AppModule {}
