import { Provider } from './provider';
import io from 'socket.io-client';
import { Socket, Config } from './types';

export function createSocketIOSocket(path: string): Socket {
  return io(path, {
    transports: ['polling', 'websocket'],
  });
}

export function createSocketIOCollabProvider(
  config: Omit<Config, 'createSocket'>,
) {
  return new Provider({ ...config, createSocket: createSocketIOSocket });
}
