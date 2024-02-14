import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { isDevelopment } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  if (isDevelopment) {
    const options = new DocumentBuilder()
      .setTitle('Shorten-URL-API')
      .setDescription(
        'Shorten-URL-API to create short url and get the original url back.',
      )
      .setVersion('1.0')
      .addServer('http://localhost:3333/', 'Local environment')
      .addServer('https://staging.yourapi.com/', 'Staging')
      .addServer('https://production.yourapi.com/', 'Production')
      .addTag('Your API Tag')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
