import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres.wayltjqwlvihaajcqzwi:PoqQ6VJozHDGp9VR@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
        },
      },
    });
  }
}
