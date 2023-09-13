import { getHash, getUserId } from 'src/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { LogUtil } from 'src/utils/customLogger';
import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDTO } from './dtos/userDto';
import { NotesDTO } from './dtos/notesDto';
import UserModel from './models/UserModel';
import NoteModel from './models/NoteModel';
import { UpdateNoteDTO } from './dtos/updateNoteDto';
import { DeleteNoteDTO } from './dtos/deleteNoteDto';
import { AllowUserDTO } from './dtos/allowUserDto';
import { RemoveUserDTO } from './dtos/removeUserDto';

/**
 *
 * Utility to handle all crud operations on database.
 * @remarks
 * Separates business logic from database operations.
 *
 */

// user crud

/**
 *
 * Creates a user with given values
 *
 * @param dto - type: UserDTO
 * @returns userId - type: Promise\<string\>
 */
export const createUserInDB = async (dto: UserDTO) => {
  if (await checkUser(dto.email)) {
    throw new ForbiddenException('User already exists!');
  }

  const user = new UserModel();
  user.userId = uuidv4();
  user.displayName = dto.displayName;
  user.email = dto.email;
  user.password = await getHash(dto.password);

  await user.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to create User!');
  });

  return user.userId;
};

/**
 *
 * Adds noteId to the list of notes of a user
 *
 * @param userId - type: string
 * @param noteId - type: string
 */
export const addNoteToUser = async (userId: string, noteId: string) => {
  const user = await getUser({ userId });
  const noteList = user.notes || [];
  noteList.push(noteId);

  user.notes = noteList;

  await user.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to update User!');
  });
};

/**
 *
 * Checks if user exists or not
 *
 * @param email - type: string
 * @returns Promise\<boolean\>
 */
export const checkUser = async (email: string) => {
  return await UserModel.exists({ email: email });
};

/**
 *
 * Gets the user based on the specified condition.
 * The condition is an object containing information regarding the required Document.
 * eg. { email: 'user@email.com'} (gets user for this email)
 *
 * @param condition - type: any
 * @returns Promise\<Document\<UserModel\>\>
 */
export const getUser = async (condition: any) => {
  return await UserModel.findOne(condition);
};

// notes crud

/**
 *
 * Creates note with given values
 *
 * @param dto - type: NotesDTO
 * @returns Promise\<string\>
 */
export const createNoteInDB = async (dto: NotesDTO) => {
  if (await checkNote(dto.name)) {
    throw new ForbiddenException('Note already exists!');
  }

  const userId = getUserId(dto.token);

  const note = new NoteModel();
  note.noteId = uuidv4();
  note.name = dto.name;
  note.description = dto.description;
  note.user = userId;
  note.content = dto.content;
  note.allowedUsers = [userId];

  await note.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to create Note!');
  });

  await addNoteToUser(note.user, note.noteId);

  return note.noteId;
};

/**
 *
 * Updates content of the note
 *
 * @param dto - type: UpdateNoteDTO
 */
export const updateNote = async (dto: UpdateNoteDTO) => {
  const note = await getNote({ noteId: dto.noteId });

  const userId = getUserId(dto.token);

  if (!note.allowedUsers.includes(userId)) {
    throw new UnauthorizedException('Unauthorized access!');
  }

  note.content = dto.content;

  await note.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to update Note!');
  });
};

/**
 *
 * Adds userId to the allowList of users for a note.
 * Only allowed users can edit a note
 *
 * @param dto - type: AllowUserDTO
 */
export const addAllowedUser = async (dto: AllowUserDTO) => {
  const note = await getNote({ noteId: dto.noteId });

  const userId = getUserId(dto.token);

  if (note.user != userId) {
    throw new UnauthorizedException('Unauthorized access!');
  }

  const userToAdd = (await getUser({ email: dto.userToAdd }))?.userId;

  if (note.allowedUsers.includes(userToAdd)) {
    throw new ForbiddenException('User already has access!');
  }

  note.allowedUsers.push(userToAdd);

  await note.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to update Note!');
  });
};

/**
 *
 * Removes the user from allowList for a note
 *
 * @param dto - type: RemoveUserDTO
 */
export const removeUserFromNote = async (dto: RemoveUserDTO) => {
  const note = await getNote({ noteId: dto.noteId });

  const userId = getUserId(dto.token);

  if (note.user != userId) {
    throw new UnauthorizedException('Unauthorized access!');
  }

  const userToRemove = (await getUser({ email: dto.userToRemove }))?.userId;

  note.allowedUsers = note.allowedUsers.filter((elem) => elem != userToRemove);

  await note.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to update Note!');
  });
};

/**
 *
 * Checks if note exists or not
 *
 * @param name - type: string
 * @returns Promise\<boolean\>
 */
export const checkNote = async (name: string) => {
  return await NoteModel.exists({ name: name });
};

/**
 *
 * @param noteId - type: string
 * @param userId - type: string
 * @returns Promise\<boolean\>
 */
export const isUserAllowed = async (noteId: string, userId: string) => {
  const allowedUsers: Array<string> = await getAllowedUsers({ noteId });
  return allowedUsers.includes(userId);
};

/**
 *
 * Gets the note based on the specified condition.
 * The condition is an object containing information regarding the required Document.
 * eg. { noteId: 'noteId'} (gets note for this noteId)
 *
 * @param condition - type: any
 * @returns Promise\<Document\<NotesModel\>\>
 */
export const getNote = async (condition: any) => {
  return await NoteModel.findOne(condition);
};

/**
 *
 * Gets the content of a note.
 *
 * @param noteId - type: string
 * @returns Promise\<string\>
 */
export const getNoteContent = async (noteId: string) => {
  return (
    await NoteModel.findOne({ noteId })
      .select({
        content: 1,
      })
      .lean()
  ).content;
};

/**
 *
 * Returns List of ids of allowed users.
 *
 * @param condition - type: any
 * @returns Promise\<Array\<string\>\>
 */
export const getAllowedUsers = async (condition: any) => {
  return (
    await NoteModel.findOne(condition)
      .select({
        allowedUsers: 1,
      })
      .lean()
  ).allowedUsers;
};

/**
 *
 * Deletes note from DB
 *
 * @param dto - type: DeleteNoteDTO
 */
export const deleteNoteInDB = async (dto: DeleteNoteDTO) => {
  const userId = getUserId(dto.token);

  const note = await getNote({ noteId: dto.noteId });
  if (note.user != userId) {
    throw new UnauthorizedException('Unauthorized access!');
  }

  await NoteModel.deleteOne({
    noteId: note.noteId,
  }).catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to delete Note!');
  });

  const user = await getUser({ userId: note.user });
  user.notes = user.notes.filter((elem) => elem != note.noteId);
  await user.save().catch((err) => {
    LogUtil.error(err);
    throw new InternalServerErrorException('Failed to update User notes!');
  });
};
