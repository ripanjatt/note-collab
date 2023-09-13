import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from './db/dbConnection';
import { UserModule } from './user/user.module';
import { NotesModule } from './notes/notes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
    ConfigModule.forRoot(),
    UserModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService, DbConnection],
})
export class AppModule {}
