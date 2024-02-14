import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConnectionString } from './config/config';

@Module({
  imports: [UrlModule, MongooseModule.forRoot(mongoConnectionString)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
