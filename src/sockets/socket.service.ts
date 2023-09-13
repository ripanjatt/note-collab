import { Server, Socket } from 'socket.io';
import { socketConfig } from 'src/utils/utils';
import { handleConnection } from './handlers';
import { connectToRedis } from 'src/redis/redis.service';

/**
 *
 * Manages Socket.io server
 *
 */
export const enableSocket = (httpServer) => {
  const socket = new Server(socketConfig);
  socket.on('connection', (client: Socket) => handleConnection(client, socket));
  socket.listen(httpServer);

  /**
   * Connecting to redis once socket is ready
   */
  connectToRedis();
};
