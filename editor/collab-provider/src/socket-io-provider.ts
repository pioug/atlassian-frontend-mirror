import { Provider } from './provider';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type {
  Config,
  ProductInformation,
  InitAndAuthData,
  AuthCallback,
} from './types';
import { getProduct, getSubProduct } from './helpers/utils';
import { SOCKET_IO_OPTIONS } from './config';

export function createSocketIOSocket(
  url: string,
  auth?: AuthCallback | InitAndAuthData,
  productInfo?: ProductInformation,
): Socket {
  const { pathname } = new URL(url);

  if (getBooleanFF('platform.editor.ncs.try-connect-websocket-first')) {
    const socket = io(url, {
      reconnectionDelayMax: SOCKET_IO_OPTIONS.RECONNECTION_DELAY_MAX,
      reconnectionDelay: SOCKET_IO_OPTIONS.RECONNECTION_DELAY,
      randomizationFactor: SOCKET_IO_OPTIONS.RANDOMIZATION_FACTOR,
      closeOnBeforeunload: false,
      withCredentials: true,
      transports: ['websocket'],
      path: `/${pathname.split('/')[1]}/socket.io`,
      auth,
      extraHeaders: {
        'x-product': getProduct(productInfo),
        'x-subproduct': getSubProduct(productInfo),
      },
    });

    socket.on('connect_error', (error) => {
      // There is no good documentation about this error, howevert this is how socket.io is emiting the websocket error
      // see: https://github.com/socketio/engine.io-client/blob/6.0.x/lib/transports/websocket.ts#L116
      const isWebSocketError = (error.message || '') === 'websocket error';

      // Neither this TransportError type is well documented
      // see: https://github.com/socketio/engine.io-client/blob/main/lib/transport.ts#L11
      const isTransportError =
        // @ts-expect-error
        (error as Record<'type', string>).type === 'TransportError';

      // We are checking both situations as a safe measure
      if (isWebSocketError || isTransportError) {
        socket.io.opts.transports = ['polling', 'websocket'];
      }
    });

    return socket;
  } else {
    return io(url, {
      reconnectionDelayMax: SOCKET_IO_OPTIONS.RECONNECTION_DELAY_MAX,
      reconnectionDelay: SOCKET_IO_OPTIONS.RECONNECTION_DELAY,
      randomizationFactor: SOCKET_IO_OPTIONS.RANDOMIZATION_FACTOR,
      closeOnBeforeunload: false,
      withCredentials: true,
      transports: ['polling', 'websocket'],
      path: `/${pathname.split('/')[1]}/socket.io`,
      auth,
      extraHeaders: {
        'x-product': getProduct(productInfo),
        'x-subproduct': getSubProduct(productInfo),
      },
    });
  }
}

export function createSocketIOCollabProvider(
  config: Omit<Config, 'createSocket'>,
) {
  return new Provider({ ...config, createSocket: createSocketIOSocket });
}
