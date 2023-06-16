import ReconnectingWebSocket from 'reconnecting-websocket';

const noop: OnWebSocketEvent = () => {};

interface OnWebSocketEvent<T = any> {
  (data?: T): void;
}

export interface WebsocketClientParams {
  url: URL;
  onMessage?: OnWebSocketEvent;
  onOpen?: OnWebSocketEvent;
  onClose?: OnWebSocketEvent;
  onError?: OnWebSocketEvent;
  onMessageSendError?: OnWebSocketEvent;
  onMaximumRetriesError?: OnWebSocketEvent;
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
  minReconnectionDelay: 1000 + Math.random() * 2000,
  reconnectionDelayGrowFactor: 1.2, // how fast should the delay grow
  maxReconnectionDelay: 3000, // maximum time between reconnections
  maxRetries: 2,
  debug: false,
};

export default class WebsocketClient {
  readonly url: URL;
  private readonly promise: Promise<ReconnectingWebSocket>;
  private readonly onMessageSendError;
  private readonly onMaximumRetriesError;
  private currentConnectRetry = 0;

  constructor(params: WebsocketClientParams) {
    this.url = params.url;
    this.onMessageSendError = params.onMessageSendError || noop;
    this.onMaximumRetriesError = params.onMaximumRetriesError || noop;
    this.promise = this.initializeClient(params);
  }

  private async initializeClient({
    url,
    onMessage = noop,
    onClose = noop,
    onOpen = noop,
    onError = noop,
  }: WebsocketClientParams): Promise<ReconnectingWebSocket> {
    return new Promise((resolve, reject) => {
      const websocket = new ReconnectingWebSocket(
        url.toString(),
        [],
        reconnectingWSOptions,
      );

      websocket.addEventListener('open', (event) => {
        onOpen(event);
        resolve(websocket);
      });

      websocket.addEventListener('message', (event) => onMessage(event));

      websocket.addEventListener('error', (event) => {
        onError(event);
      });

      websocket.addEventListener('close', (event) => {
        // On the last 2 reconnection attempts, the ReconnectionWebSocket object
        // maintains the same "retryCount"
        if (this.currentConnectRetry === event.target.retryCount) {
          this.onMaximumRetriesError();
        } else {
          this.currentConnectRetry = event.target.retryCount;
        }
        onClose(event);
      });
    });
  }

  public async send(message: Message) {
    const websocket = await this.promise;

    if (websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    } else {
      this.onMessageSendError(websocket.readyState);
    }
  }

  public async close() {
    const websocket = await this.promise;
    if (
      websocket.readyState === WebSocket.OPEN ||
      websocket.readyState === WebSocket.CONNECTING
    ) {
      websocket.close();
    }
  }
}
