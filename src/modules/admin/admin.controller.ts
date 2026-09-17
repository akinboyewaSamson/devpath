import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import {
  CreateTrackDto,
  CreateRoadmapDto,
  CreateMilestoneDto,
  CreateTopicDto,
  UpdateTopicDto,
  CreateResourceDto,
  AddPrerequisiteDto,
} from './dto/admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Content Management')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Tracks
  @Post('tracks')
  @ApiOperation({ summary: 'Create a new track (Admin only)' })
  @ApiResponse({ status: 201, description: 'Track created' })
  async createTrack(@Body() dto: CreateTrackDto) {
    return this.adminService.createTrack(dto);
  }

  @Patch('tracks/:id')
  @ApiOperation({ summary: 'Update an existing track (Admin only)' })
  async updateTrack(@Param('id') id: string, @Body() dto: Partial<CreateTrackDto>) {
    return this.adminService.updateTrack(id, dto);
  }

  @Delete('tracks/:id')
  @ApiOperation({ summary: 'Delete a track (Admin only)' })
  async deleteTrack(@Param('id') id: string) {
    return this.adminService.deleteTrack(id);
  }

  // Roadmaps
  @Post('roadmaps')
  @ApiOperation({ summary: 'Create a versioned roadmap (Admin only)' })
  async createRoadmap(@Body() dto: CreateRoadmapDto) {
    return this.adminService.createRoadmap(dto);
  }

  @Patch('roadmaps/:id/set-current')
  @ApiOperation({ summary: 'Set a roadmap as the current active version for its track (Admin only)' })
  async setRoadmapCurrent(@Param('id') id: string) {
    return this.adminService.setRoadmapCurrent(id);
  }

  @Delete('roadmaps/:id')
  @ApiOperation({ summary: 'Delete a roadmap (Admin only)' })
  async deleteRoadmap(@Param('id') id: string) {
    return this.adminService.deleteRoadmap(id);
  }

  // Milestones
  @Post('milestones')
  @ApiOperation({ summary: 'Create a milestone group in a roadmap (Admin only)' })
  async createMilestone(@Body() dto: CreateMilestoneDto) {
    return this.adminService.createMilestone(dto);
  }

  @Delete('milestones/:id')
  @ApiOperation({ summary: 'Delete a milestone (Admin only)' })
  async deleteMilestone(@Param('id') id: string) {
    return this.adminService.deleteMilestone(id);
  }

  // Topics
  @Post('topics')
  @ApiOperation({ summary: 'Create a topic in a roadmap (Admin only)' })
  async createTopic(@Body() dto: CreateTopicDto) {
    return this.adminService.createTopic(dto);
  }

  @Patch('topics/:id')
  @ApiOperation({ summary: 'Update a topic (Admin only)' })
  async updateTopic(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.adminService.updateTopic(id, dto);
  }

  @Delete('topics/:id')
  @ApiOperation({ summary: 'Delete a topic (Admin only)' })
  async deleteTopic(@Param('id') id: string) {
    return this.adminService.deleteTopic(id);
  }

  // Prerequisites DAG
  @Post('prerequisites')
  @ApiOperation({
    summary: 'Add a prerequisite edge between topics with cycle validation (Admin only)',
  })
  async addPrerequisite(@Body() dto: AddPrerequisiteDto) {
    return this.adminService.addPrerequisite(dto);
  }

  @Delete('prerequisites/:topicId/:prerequisiteId')
  @ApiOperation({ summary: 'Remove a prerequisite edge (Admin only)' })
  async removePrerequisite(
    @Param('topicId') topicId: string,
    @Param('prerequisiteId') prerequisiteId: string,
  ) {
    return this.adminService.removePrerequisite(topicId, prerequisiteId);
  }

  // Resources
  @Post('resources')
  @ApiOperation({ summary: 'Add a learning resource to a topic (Admin only)' })
  async createResource(@Body() dto: CreateResourceDto) {
    return this.adminService.createResource(dto);
  }

  @Delete('resources/:id')
  @ApiOperation({ summary: 'Delete a resource (Admin only)' })
  async deleteResource(@Param('id') id: string) {
    return this.adminService.deleteResource(id);
  }
}
