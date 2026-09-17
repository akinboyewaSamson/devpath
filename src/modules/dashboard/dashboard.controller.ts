import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get unified dashboard data (active track, % complete, current topic, recent completions, streak)',
  })
  @ApiResponse({ status: 200, description: 'Aggregated user dashboard data' })
  async getDashboard(@CurrentUser('userId') userId: string) {
    return this.dashboardService.getDashboardData(userId);
  }
}
