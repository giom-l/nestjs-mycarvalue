import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../users/decorators/current.user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Serialize<ReportDto>(ReportDto)
  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    console.log(
      `[ReportController] User ${user.id} is creating report ${JSON.stringify(body)}...`,
    );
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    console.log(
      `[ReportController] Changing approval of report ${id} to ${body.approved}...`,
    );
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  getAllReports(@Query() query: GetEstimateDto) {
    return this.reportsService.getAllReports(query);
  }

  @Get('/estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    console.log(`[ReportController] Generating estimate...`);
    return this.reportsService.createEstimate(query);
  }
}
