import { Body, Controller, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesDTO } from '../db/dtos/notesDto';
import { DeleteNoteDTO } from 'src/db/dtos/deleteNoteDto';
import { AllowUserDTO } from 'src/db/dtos/allowUserDto';
import { RemoveUserDTO } from 'src/db/dtos/removeUserDto';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post('/createNote')
  createNote(@Body() dto: NotesDTO) {
    return this.notesService.createNote(dto);
  }

  @Post('/deleteNote')
  deleteNote(@Body() dto: DeleteNoteDTO) {
    return this.notesService.deleteNote(dto);
  }

  @Post('/addUser')
  addUser(@Body() dto: AllowUserDTO) {
    return this.notesService.addUser(dto);
  }

  @Post('/removeUser')
  removeUser(@Body() dto: RemoveUserDTO) {
    return this.notesService.removeUser(dto);
  }
}
