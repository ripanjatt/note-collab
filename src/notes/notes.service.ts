import { Injectable } from '@nestjs/common';
import { NotesDTO } from '../db/dtos/notesDto';
import {
  addAllowedUser,
  createNoteInDB,
  deleteNoteInDB,
  removeUserFromNote,
} from 'src/db/crud';
import { DeleteNoteDTO } from 'src/db/dtos/deleteNoteDto';
import { AllowUserDTO } from 'src/db/dtos/allowUserDto';
import { RemoveUserDTO } from 'src/db/dtos/removeUserDto';

@Injectable()
export class NotesService {
  async createNote(dto: NotesDTO) {
    const noteId = await createNoteInDB(dto);
    return {
      message: 'Created note successfully!',
      noteId: noteId,
    };
  }

  async deleteNote(dto: DeleteNoteDTO) {
    await deleteNoteInDB(dto);
    return {
      message: 'Deleted note successfully!',
      noteId: dto.noteId,
    };
  }

  async addUser(dto: AllowUserDTO) {
    await addAllowedUser(dto);
    return {
      message: 'User added successfully!',
      noteId: dto.noteId,
    };
  }

  async removeUser(dto: RemoveUserDTO) {
    await removeUserFromNote(dto);
    return {
      message: 'User removed successfully!',
      noteId: dto.noteId,
    };
  }
}
