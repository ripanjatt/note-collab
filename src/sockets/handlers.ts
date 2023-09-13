import { Server, Socket } from 'socket.io';
import { getNoteContent, isUserAllowed, updateNote } from 'src/db/crud';
import { OpenNoteDTO } from 'src/db/dtos/openNoteDto';
import { UpdateNoteDTO } from 'src/db/dtos/updateNoteDto';
import { getCache, setCache } from 'src/redis/redis.service';
import { LogUtil } from 'src/utils/customLogger';
import { getUserId, verifyJWT } from 'src/utils/utils';

/**
 *
 * Handles "openNote" event sent by client
 *
 * @param data - type: OpenNoteDTO
 * @param socket - type: Socket(socket.io)
 */
const handleOpenNote = async (data: OpenNoteDTO, socket: Socket) => {
  try {
    verifyJWT(data.token);
    const userId = getUserId(data.token);
    const isAllowed = await isUserAllowed(data.noteId, userId);
    if (isAllowed) {
      LogUtil.debug(`Opening note: ${data.noteId}`);

      joinRoom(data.noteId, socket);

      notifyNewUser(data.noteId, userId, socket);

      const content = await getContent(data.noteId);

      socket.emit('noteOpened', {
        content: content,
        noteId: data.noteId,
        userId: userId,
      });

      socket.on('contentChange', (data: UpdateNoteDTO) =>
        contentChange(data, socket),
      );
    }
  } catch (err) {
    LogUtil.error(err);
  }
};

/**
 *
 * Joins the user to the opened note's room
 *
 * @remarks
 * roomId = noteId
 *
 * @param roomId - type: string
 * @param socket - type: Socket(socket.io)
 */
const joinRoom = (roomId: string, socket: Socket) => {
  // join the room, if no room is available, socket.io will create it automatically
  socket.join(roomId);
};

/**
 *
 * Notifies the users in the note's room about new user
 *
 * @remarks
 * roomId = noteId
 *
 * @param roomId - type: string
 * @param userId - type: string
 * @param socket - type: Socket(socket.io)
 */
const notifyNewUser = (roomId: string, userId: string, socket: Socket) => {
  socket.to(roomId).emit('newUser', {
    message: `User connected: ${userId}`,
    userId: userId,
    socketId: socket.id,
  });
};

/**
 *
 * Notifies the users in the note's room about changes in the note's content
 *
 * @remarks
 * roomId = noteId
 *
 * @param roomId - type: string
 * @param content - type: string (text content of the note)
 * @param socket - type: Socket(socket.io)
 */
const notifyContentUpdate = (
  roomId: string,
  content: string,
  socket: Socket,
) => {
  socket.in(roomId).emit('contentUpdate', {
    content: content,
    noteId: roomId,
  });
};

/**
 *
 * Receives change in note's content from a user
 *
 * @param data - type: UpdateNoteDTO
 * @param socket - type: Socket(socket.io)
 */
const contentChange = async (data: UpdateNoteDTO, socket: Socket) => {
  try {
    verifyJWT(data.token);
    const userId = getUserId(data.token);
    const isAllowed = await isUserAllowed(data.noteId, userId);
    if (isAllowed && data.content.length < 25000) {
      await updateNote(data);
      await setCache(data.noteId, data.content);
      notifyContentUpdate(data.noteId, data.content, socket);
    }
  } catch (err) {}
};

/**
 *
 * Returns text content of a note.
 *
 * @remarks
 * Returns cached data from redis store if its available hence reducing db calls.
 *
 * @param noteId - type: string
 * @returns Promise<string>
 */
const getContent = async (noteId: string) => {
  const content = await getCache(noteId);
  return content ? content : await getNoteContent(noteId);
};

/**
 *
 * Handles new client connections
 *
 * @param client - type: Socket(socket.io)
 * @param io - type: Server(socket.io)
 */
export const handleConnection = (client: Socket, io: Server) => {
  LogUtil.debug(`User connected: ${client.id}`);
  client.on('disconnect', () => {
    handleDisconnect(client.id, io);
  });
  client.on('openNote', (arg) => {
    handleOpenNote(arg, client);
  });
};

/**
 *
 * Handles user disconnections
 *
 * @param id - type: string
 * @param io - type: Server(socket.io)
 */
export const handleDisconnect = (id: string, io: Server) => {
  LogUtil.debug(`User disconnected: ${id}`);
  io.emit('userLeft', id);
};
