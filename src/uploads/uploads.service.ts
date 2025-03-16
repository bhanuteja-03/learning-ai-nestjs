import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs-extra';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { DeepseekService } from 'src/deepseek/deepseek.service';

@Injectable()
export class UploadsService {
  constructor(
    private prisma: PrismaService,
    private deepseek: DeepseekService,
  ) {}

  async extractText(file: Express.Multer.File): Promise<string | null> {
    const filePath = file.path;
    let content = '';
    console.log(file.mimetype);

    if (file.mimetype === 'application/pdf') {
      content = await this.readPDF(filePath);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      content = await this.readDOCX(filePath);
    } else if (file.mimetype === 'text/plain') {
      content = await this.readTXT(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    // Optional: Delete the uploaded file after extraction to save storage
    await fs.remove(filePath);

    const chatResponse = await this.deepseek.chat(content, '15');

    return chatResponse;
  }

  private async readPDF(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  private async readDOCX(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
  }

  private async readTXT(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }
}
