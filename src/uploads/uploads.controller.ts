import { Controller, Get, Post } from '@nestjs/common';

@Controller('uploads')
export class UploadsController {
  @Post()
  uploadFile(): string {
    return 'Uploading file success';
  }
}
