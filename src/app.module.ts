import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { BookModule } from './app/book/book.module';
import { AuthModule } from './app/auth/auth.module';
import { KategoriModule } from './app/kategori/kategori.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), BookModule, AuthModule, KategoriModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
