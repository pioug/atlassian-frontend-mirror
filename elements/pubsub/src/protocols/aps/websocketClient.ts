import { logDebug, logError } from '../../util/logger';

const noop: OnWebSocketEvent = () => {};

interface OnWebSocketEvent<T = any> {
  (data: T): void;
}

export interface WebsocketClientParams {
  url: URL;
  onMessage?: OnWebSocketEvent;
  onOpen?: OnWebSocketEvent;
  onClose?: OnWebSocketEvent;
  onError?: OnWebSocketEvent;
}

interface Message {
  type: 'subscribe' | 'unsubscribe';
  channels: string[];
}

export default class WebsocketClient {
  readonly url: URL;
  private readonly promise: Promise<WebSocket>;

  constructor(params: WebsocketClientParams) {
    this.url = params.url;
    this.promise = this.newClientPromise(params);
  }

  private newClientPromise({
    url,
    onMessage = noop,
    onClose = noop,
    onOpen = noop,
    onError = noop,
  }: WebsocketClientParams): Promise<WebSocket> {
    return new Promise<WebSocket>((resolve, reject) => {
      const websocket = new WebSocket(url);

      websocket.addEventListener('open', (event) => {
        onOpen(event);
        resolve(websocket);
      });

      websocket.addEventListener('message', (event) => onMessage(event));

      websocket.addEventListener('error', (event) => {
        onError(event);
        reject(event);
      });

      websocket.addEventListener('close', (event) => {
        onClose(event);
        logDebug('Websocket connection closed', event);
      });
    });
  }

  public send(message: Message) {
    this.promise
      .then((websocket) => {
        websocket.send(JSON.stringify(message));
      })
      .catch((error) => {
        logError('Websocket connection closed due to error', error);
      });
  }

  public close() {
    this.promise.then((websocket) => websocket.close());
  }
}
