import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //Tạo ứng dụng nestjs
  //sử dụng express framework
  //bật cors
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors:true});
  //Lấy configService(lấy các biến môi trường từ .env)
  const configService : ConfigService = app.get(ConfigService);
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('PROJECT_NAME'))
    .setDescription(`Api for ${configService.get<string>('NODE_ENV')}`)
    .setVersion('1.0')
    .addBearerAuth({in:'header',type:'http'})
    .build();
  // bật validate toàn cục
  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist:true
      }
    )
  )
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Cấu hình CORS
  app.enableCors({
    origin:'*',
    allowedHeaders:'*',
  });
  //start app
  await app.listen(process.env.PORT||3033); 
}

bootstrap();
