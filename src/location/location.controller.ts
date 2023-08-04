import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/all')
  findAllData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    return this.locationService.locationAll(page, perPage);
  }

  @Get('/all/count')
  findAllDataCount() {
    return this.locationService.locationAllCount();
  }

  @Post('/search')
  async findKeywordGeneral(@Body('keyword') keyword: string) {
    return await this.locationService.findKeywordGeneral(keyword);
  }

  @Post('/new')
  async createData(@Body() data: any): Promise<any> {
    return await this.locationService.createData(data);
  }

  @Post('/update')
  async updateData(@Body() data: any): Promise<any> {
    return await this.locationService.updateData(data);
  }
  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.locationService.deleteData(data);
  }
}
