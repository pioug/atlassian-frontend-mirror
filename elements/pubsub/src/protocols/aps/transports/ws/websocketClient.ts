import ReconnectingWebSocket from 'reconnecting-websocket';

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
  onMessageSendError?: OnWebSocketEvent;
}

interface Message {
  type: 'subscribe' | 'unsubscribe';
  channels: string[];
}

const reconnectingWSOptions = {
  /**
   * This is the formula used by the reconnecting-websocket library to calculate the
   * exponential backoff wait time:
   *    delay = minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, retryCount - 1);
   */
  minReconnectionDelay: 1000 + Math.random() * 4000,
  reconnectionDelayGrowFactor: 1.5, // how fast should the delay grow
  maxReconnectionDelay: 60000, // maximum time between reconnections
  maxRetries: 10,
  debug: false,
};

export default class WebsocketClient {
  readonly url: URL;
  private readonly websocket: ReconnectingWebSocket;
  private readonly maxSendRetries = 5;
  private readonly onMessageSendError;
  private currentSendRetry = 0;

  constructor(params: WebsocketClientParams) {
    this.url = params.url;
    this.onMessageSendError = params.onMessageSendError || noop;
    this.websocket = this.initializeClient(params);
  }

  private initializeClient({
    url,
    onMessage = noop,
    onClose = noop,
    onOpen = noop,
    onError = noop,
  }: WebsocketClientParams): ReconnectingWebSocket {
    const websocket = new ReconnectingWebSocket(
      url.toString(),
      [],
      reconnectingWSOptions,
    );

    websocket.addEventListener('open', (event) => {
      onOpen(event);
    });

    websocket.addEventListener('message', (event) => onMessage(event));

    websocket.addEventListener('error', (event) => {
      onError(event);
    });

    websocket.addEventListener('close', (event) => {
      onClose(event);
    });

    return websocket;
  }

  public send(message: Message) {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.currentSendRetry = 0;
      this.websocket.send(JSON.stringify(message));
    } else if (
      this.websocket.readyState === WebSocket.CONNECTING &&
      this.currentSendRetry < this.maxSendRetries
    ) {
      this.currentSendRetry++;
      setTimeout(() => {
        this.send(message);
      }, 1000);
    } else {
      this.onMessageSendError(this.websocket.readyState);
    }
  }

  public close() {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.close();
    }
  }
}
