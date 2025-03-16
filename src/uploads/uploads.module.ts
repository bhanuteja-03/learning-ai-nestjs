import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { DeepseekService } from 'src/deepseek/deepseek.service';

@Module({
  providers: [UploadsService, DeepseekService],
  controllers: [UploadsController],
})
export class UploadsModule {}
