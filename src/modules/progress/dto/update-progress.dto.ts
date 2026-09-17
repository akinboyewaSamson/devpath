import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProgressStatus } from '@prisma/client';

export class UpdateProgressDto {
  @ApiProperty({ enum: ProgressStatus, example: ProgressStatus.COMPLETED })
  @IsEnum(ProgressStatus)
  status: ProgressStatus;
}
