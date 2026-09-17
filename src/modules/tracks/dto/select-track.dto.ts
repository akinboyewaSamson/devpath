import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SelectTrackDto {
  @ApiProperty({ description: 'ID of the track to select' })
  @IsString()
  @IsNotEmpty()
  trackId: string;
}
