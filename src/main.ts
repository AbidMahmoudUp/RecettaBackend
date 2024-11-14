import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Recetta_API')
    .setDescription('All the endpoints of the backend')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addServer('https://staging.yourapi.com/', 'Staging')
    .addServer('https://production.yourapi.com/', 'Production')
    .addTag('Recetta')
    .build();

const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

await app.listen(process.env.PORT || 3000);
}
bootstrap();
