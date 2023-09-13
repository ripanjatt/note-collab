import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { socketConfig } from 'src/utils/utils';
import { handleConnection } from './handlers';
import { connectToRedis } from 'src/redis/redis.service';

/**
 *
 * Manages Socket.io server
 *
 */
@Injectable()
export class SocketService {
  socket: Server;

  /**
   *
   * Creates Socket.io server
   *
   */
  constructor() {
    this.socket = new Server(socketConfig);
    this.socket.on('connection', (client: Socket) =>
      handleConnection(client, this.socket),
    );
    this.socket.listen(parseInt(process.env.SOCKET_PORT));

    /**
     * Connecting to redis once socket is ready
     */
    connectToRedis();
  }
}
