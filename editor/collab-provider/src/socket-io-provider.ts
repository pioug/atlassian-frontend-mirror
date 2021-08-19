import { Provider } from './provider';
import { io } from 'socket.io-client';
import urlParse from 'url-parse';
import { Socket, Config } from './types';

export function createSocketIOSocket(
  url: string,
  auth?: (cb: (data: object) => void) => void,
): Socket {
  const { pathname } = urlParse(url);
  return io(url, {
    withCredentials: true,
    transports: ['polling', 'websocket'],
    path: `/${pathname.split('/')[1]}/socket.io`,
    auth,
  });
}

export function createSocketIOCollabProvider(
  config: Omit<Config, 'createSocket'>,
) {
  return new Provider({ ...config, createSocket: createSocketIOSocket });
}
