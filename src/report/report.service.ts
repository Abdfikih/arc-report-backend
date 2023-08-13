import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllViewData(page = 1, perPage = 10) {
    try {
      const skip = (page - 1) * perPage;
      const take = perPage;
      const result = await this.prisma.$queryRaw`
        SELECT * FROM view_get_data_new
        ORDER BY equipment 
        OFFSET ${skip}
        LIMIT ${take};
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findAllReportTotal() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_get_data_time_total;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findAllReportData() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_get_data_time_result;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findAllReportDataTotal() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_count_data;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findDataStatus() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_data_status;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findDataStatusNull() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_data_null_available;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findDataStatusGeneral() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_count_status_general;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findKeywordGeneral(keyword: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT *
        FROM view_get_data_new
        WHERE material_description LIKE '%' || ${keyword} || '%'
           OR aircraft_reg LIKE '%' || ${keyword} || '%'
           OR doc_no LIKE '%' || ${keyword} || '%'
           OR equipment LIKE '%' || ${keyword} || '%'
           OR material_number LIKE '%' || ${keyword} || '%'
           OR serial_number LIKE '%' || ${keyword} || '%'
           OR doc_locations LIKE '%' || ${keyword} || '%'
           OR doc_box LIKE '%' || ${keyword} || '%'
           OR title LIKE '%' || ${keyword} || '%'
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }

  async findDataPlane(keyword: any) {
    console.log(keyword);
    try {
      const result = await this.prisma.$queryRaw`
      SELECT *
      FROM view_get_data_time_result
      WHERE aircraft_reg LIKE '%' || ${keyword.aircraft_reg} || '%'
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }

  async createData(data: any) {
    console.log(data);

    let createdDocfile,
      createdArcSwift,
      createdLocation = null;
    console.log(data.docfile.doc_no);
    if (data.docfile.doc_no !== null && data.docfile.doc_no !== '') {
      console.log('dioc no skip');
      try {
        createdDocfile = await this.prisma.docfile.create({
          data: data.docfile,
        });
      } catch (docfileError) {
        console.error('Failed to create docfile:', docfileError.message);
      }
    }

    try {
      createdArcSwift = await this.prisma.arc_swift.create({
        data: data.arc_swift,
      });
    } catch (arcSwiftError) {
      console.error('Failed to create arc_swift:', arcSwiftError.message);
    }

    try {
      createdLocation = await this.prisma.location.create({
        data: data.location,
      });
    } catch (locationError) {
      console.error('Failed to create location:', locationError.message);
    }

    return {
      message: 'Data created successfully',
      docfile: createdDocfile,
      arc_swift: createdArcSwift,
      location: createdLocation,
    };
  }

  async updateData(data: any) {
    console.log(data);
    try {
      const updatedArcSwift = await this.prisma.arc_swift.upsert({
        where: { equipment: data.arc_swift.equipment },
        create: data.arc_swift,
        update: data.arc_swift,
      });

      const updatedDocfile = await this.prisma.docfile.upsert({
        where: { doc_no: data.docfile.doc_no },
        create: data.docfile,
        update: data.docfile,
      });

      const updatedLocation = await this.prisma.location.upsert({
        where: { doc_box: data.location.doc_box },
        create: data.location,
        update: data.location,
      });

      return {
        message: 'Data updated successfully',
        docfile: updatedDocfile,
        arc_swift: updatedArcSwift,
        location: updatedLocation,
      };
    } catch (error) {
      return { message: 'Failed to update data', error: error.message };
    }
  }

  async deleteData(data: any) {
    try {
      const deletedArcSwift = await this.prisma.arc_swift.delete({
        where: { equipment: data.arc_swift.equipment },
      });

      return {
        message: 'Data deleted successfully',
        arc_swift: deletedArcSwift,
      };
    } catch (error) {
      return { message: 'Failed to delete data', error: error.message };
    }
  }

  async getAircraftReg() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT aircraft_reg FROM view_get_data_new;
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getOperator() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT operator FROM view_get_data_new;
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async createOldComponent(data) {
    try {
      const bodyData = JSON.parse(data.body);

      const newComponent = await this.prisma.old_component.create({
        data: {
          identified: bodyData.identified,
          aircraft_reg: bodyData.aircraft_reg,
          ac_type: bodyData.ac_type,
          operator: bodyData.operator,
        },
      });

      return newComponent;
    } catch (error) {
      throw new Error(`Error creating old component: ${error.message}`);
    }
  }

  async findDataOperator(keyword: any) {
    console.log(keyword);
    try {
      const result = await this.prisma.$queryRaw`
      SELECT distinct aircraft_reg
      FROM view_get_data_new
      WHERE operator= ${keyword}
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom Operator:', error);
    }
  }
}
