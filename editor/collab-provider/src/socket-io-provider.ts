import { Provider } from './provider';
import io from 'socket.io-client';
// eslint-disable-next-line import/no-extraneous-dependencies
import urlParse from 'url-parse';
import { Socket, Config } from './types';

export function createSocketIOSocket(url: string): Socket {
  const { pathname } = urlParse(url);
  return io(url, {
    transports: ['polling', 'websocket'],
    path: `/${pathname.split('/')[1]}/socket.io`,
  });
}

export function createSocketIOCollabProvider(
  config: Omit<Config, 'createSocket'>,
) {
  return new Provider({ ...config, createSocket: createSocketIOSocket });
}
