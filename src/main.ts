import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ApiKeyGuard } from "./common/guards/api-key.guard";
import {WrapResponseInterceptor} from "./common/interceptors/wrap-response.interceptor";
import {TimeoutInterceptor} from "./common/interceptors/timeout.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            }
        })
    );

    // app.useGlobalFilters(new HttpExceptionFilter());
    // app.useGlobalGuards(new ApiKeyGuard());
    app.useGlobalInterceptors(
        new WrapResponseInterceptor(),
        new TimeoutInterceptor(),
    );

    await app.listen(3000);
}
bootstrap();
