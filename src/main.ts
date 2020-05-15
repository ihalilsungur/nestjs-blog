import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
  .setTitle('Conduit Blog API')
  .setDescription('Conduit blog api')
  .setVersion('1.0.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
    'access-token',
  )
  .build();
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
