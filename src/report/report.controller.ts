import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('report')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/view')
  async findAllViewData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    console.log('page : ', page);
    return this.reportService.findAllViewData(page, perPage);
  }

  @Get('/result')
  findAllReportData() {
    return this.reportService.findAllReportData();
  }

  @Get('/result-total')
  findAllReportTotal() {
    return this.reportService.findAllReportTotal();
  }

  @Get('/reg-plane')
  getAircraftData() {
    return this.reportService.getAircraftReg();
  }

  @Get('/operator')
  getOperatorData() {
    return this.reportService.getOperator();
  }

  @Get('/total-view')
  findAllReportDataTotal() {
    return this.reportService.findAllReportDataTotal();
  }

  @Get('/total-status')
  findDataStatus() {
    return this.reportService.findDataStatus();
  }

  @Get('/total-status-null')
  findDataStatusNull() {
    return this.reportService.findDataStatusNull();
  }

  @Get('/total-status-general')
  findDataStatusGeneral() {
    return this.reportService.findDataStatusGeneral();
  }

  @Post('/search-plane')
  async findDataPlane(@Body('keyword') keyword: string) {
    return await this.reportService.findDataPlane(keyword);
  }

  @Post('/search-operator')
  async findDataOperator(@Body('keyword') keyword: string) {
    console.log(keyword);
    return await this.reportService.findDataOperator(keyword);
  }

  @Post('/search')
  async findKeywordGeneral(@Body('keyword') keyword: string) {
    return await this.reportService.findKeywordGeneral(keyword);
  }

  @Post('/new')
  async createData(@Body() data: any): Promise<any> {
    return await this.reportService.createData(data);
  }

  @Post('/update')
  async updateData(@Body() data: any): Promise<any> {
    return await this.reportService.updateData(data);
  }

  @Post('/add-old')
  async createOldData(@Body() keyword: any): Promise<any> {
    console.log('controller', keyword);
    return await this.reportService.createOldComponent(keyword);
  }

  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.reportService.deleteData(data);
  }
}
