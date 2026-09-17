import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Progress Tracking')
@Controller('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':topicId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update topic progress (IN_PROGRESS, COMPLETED, NOT_STARTED)',
    description:
      'Server verifies all prerequisite topics are COMPLETED before allowing a topic to be marked as COMPLETED. Also updates consecutive active streak.',
  })
  @ApiResponse({ status: 200, description: 'Progress updated successfully with streak data' })
  @ApiResponse({ status: 400, description: 'Prerequisites not yet completed' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async updateTopicProgress(
    @CurrentUser('userId') userId: string,
    @Param('topicId') topicId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.updateTopicProgress(userId, topicId, dto.status);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get user overall progress percentage and breakdown by level',
  })
  @ApiQuery({ name: 'roadmapId', required: false, description: 'Optional roadmap ID' })
  @ApiResponse({ status: 200, description: 'Progress summary breakdown' })
  async getProgressSummary(
    @CurrentUser('userId') userId: string,
    @Query('roadmapId') roadmapId?: string,
  ) {
    return this.progressService.getProgressSummary(userId, roadmapId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently completed topics' })
  @ApiResponse({ status: 200, description: 'List of recently completed topics' })
  async getRecentlyCompletedTopics(@CurrentUser('userId') userId: string) {
    return this.progressService.getRecentlyCompletedTopics(userId);
  }
}
