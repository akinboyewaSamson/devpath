import {
  Controller,
  Get,
  Param,
  UseGuards,
  Optional,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoadmapsService } from './roadmaps.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Roadmaps')
@Controller('roadmaps')
export class RoadmapsController {
  constructor(private readonly roadmapsService: RoadmapsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific roadmap by ID as a DAG graph with nodes, edges, and milestones' })
  @ApiResponse({ status: 200, description: 'Roadmap DAG graph details' })
  @ApiResponse({ status: 404, description: 'Roadmap not found' })
  async getById(@Param('id') id: string) {
    return this.roadmapsService.getById(id);
  }

  @Get('track/:trackId')
  @ApiOperation({ summary: 'Get the latest active roadmap for a track in DAG graph structure' })
  @ApiResponse({ status: 200, description: 'Active roadmap DAG graph for the track' })
  @ApiResponse({ status: 404, description: 'Track or roadmap not found' })
  async getByTrack(@Param('trackId') trackId: string) {
    return this.roadmapsService.getLatestByTrack(trackId);
  }

  @Get('track/:trackId/versions')
  @ApiOperation({ summary: 'List all historical and current versions of roadmaps for a track' })
  @ApiResponse({ status: 200, description: 'List of roadmap versions' })
  async listVersions(@Param('trackId') trackId: string) {
    return this.roadmapsService.listVersionsForTrack(trackId);
  }
}
