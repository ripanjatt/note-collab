import { Body, Controller, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesDTO } from '../db/dtos/notesDto';
import { DeleteNoteDTO } from 'src/db/dtos/deleteNoteDto';
import { AllowUserDTO } from 'src/db/dtos/allowUserDto';
import { RemoveUserDTO } from 'src/db/dtos/removeUserDto';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  /**
   *
   * Create a new Note with or without content and returns object containing noteId
   *
   * @param dto - type: NotesDTO
   * @returns any
   */
  @Post('/createNote')
  createNote(@Body() dto: NotesDTO) {
    return this.notesService.createNote(dto);
  }

  /**
   *
   * Deletes a note and also removes noteId from User.notes.
   * Return an object containing noteId of deleted note.
   *
   * @param dto - type: DeleteNoteDTO
   * @returns any
   */
  @Post('/deleteNote')
  deleteNote(@Body() dto: DeleteNoteDTO) {
    return this.notesService.deleteNote(dto);
  }

  /**
   *
   * Adds user to allowed user list of the Note.
   * Only added users can access the note.
   *
   * @param dto - type: AllowUserDTO
   * @returns any
   */
  @Post('/addUser')
  addUser(@Body() dto: AllowUserDTO) {
    return this.notesService.addUser(dto);
  }

  /**
   *
   * Removes user from allowed user list of the Note.
   *
   * @param dto - type: RemoveUserDTO
   * @returns any
   */
  @Post('/removeUser')
  removeUser(@Body() dto: RemoveUserDTO) {
    return this.notesService.removeUser(dto);
  }
}
