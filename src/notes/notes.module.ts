import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { SocketService } from 'src/sockets/socket.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService, SocketService],
})
export class NotesModule {}
