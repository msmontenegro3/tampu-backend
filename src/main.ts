import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200',
    'https://tampu-frontend.onrender.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin (como Postman o SSR)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ Bloqueado por CORS:', origin);
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Habilitar CORS
  /* app.enableCors({
    origin: [
      'http://localhost:4200', // local
      'https://tampu-frontend.onrender.com', // producción
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000); */
}
bootstrap();
