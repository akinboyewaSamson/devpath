import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { SelectTrackDto } from './dto/select-track.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'List all available tracks (Frontend, Backend)' })
  @ApiResponse({ status: 200, description: 'List of tracks' })
  async findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single track' })
  @ApiResponse({ status: 200, description: 'Track details' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Post('select')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Select or switch active track for the authenticated user' })
  @ApiResponse({ status: 200, description: 'User track successfully updated' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async selectTrack(
    @CurrentUser('userId') userId: string,
    @Body() dto: SelectTrackDto,
  ) {
    return this.tracksService.selectTrack(userId, dto);
  }
}
