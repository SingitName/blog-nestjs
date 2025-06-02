import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addBearerAuth(
      {
        type: 'http', // Chỉ rõ loại Bearer Token là HTTP
        scheme: 'Bearer', // Dùng scheme bearer
        bearerFormat: 'JWT', // Định dạng Bearer Token là JWT
      },
      'access-token', // Tên của security scheme, có thể thay đổi
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Cấu hình CORS
  app.enableCors({
    origin: 'http://localhost:3000',  // Cho phép kết nối từ client React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Các phương thức HTTP cho phép
    credentials: true,  // Cung cấp cookies trong các yêu cầu
    allowedHeaders: ['Content-Type', 'Authorization'],  // Các header cho phép
    preflightContinue: false,  // Không tiếp tục gửi yêu cầu OPTIONS
    optionsSuccessStatus: 204, // Cấu hình mã trạng thái thành công cho preflight request
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Cấu hình WebSocket Adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(5000); 
}

bootstrap();
