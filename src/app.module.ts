import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { SwiftModule } from './swift/swift.module';
import { DocfileModule } from './docfile/docfile.module';
import { PrismaModule } from './prisma/prisma.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ReportModule,
    AuthModule,
    SwiftModule,
    DocfileModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
