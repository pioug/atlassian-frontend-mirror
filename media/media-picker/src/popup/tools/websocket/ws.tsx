import * as url from 'url';
import { Auth } from '@atlaskit/media-core';
import { objectToQueryString } from '@atlaskit/media-client';
import { randomInt } from '../randomInt';
import { WsMessageData } from './wsMessageData';
import { mapAuthToQueryParameters } from '../../domain/auth';

export type ConnectionLostHandler = () => void;
export type WebsocketDataReceivedHandler = (data: WsMessageData) => void;

// Helper function that formats websocket URL based on API URL
export const getWsUrl = (baseUrl: string): string => {
  const urlParams = url.parse(baseUrl);
  const { protocol, host } = urlParams;
  const wsProtocol = protocol === 'http:' ? 'ws:' : 'wss:';

  return `${wsProtocol}//${host}/picker/ws/`;
};

// Wraps WebSocket instance.
// The constructor can throw an error.
//
// You should call teardown() when you're done with the object of this class.
//
// Internally pings the websocket periodically. If the connection is lost, calls onConnectionLost.
// In this case you don't have to call teardown(), however calling teardown() twice doesn't cause an error.
export class Ws {
  private readonly ws: WebSocket;
  private pingTimeoutId?: number;

  constructor(
    auth: Auth,
    private onDataReceived: WebsocketDataReceivedHandler,
    private onConnectionLost: ConnectionLostHandler,
  ) {
    const wsUrl = getWsUrl(auth.baseUrl);

    // WebSocket throws an exception SECURITY_ERR if the port is blocked.
    // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
    const authParams = mapAuthToQueryParameters(auth);
    this.ws = new WebSocket(
      `${wsUrl}?${objectToQueryString(authParams as any)}`,
    );
    this.setHandler();
    this.schedulePing();
  }

  teardown = (): void => {
    window.clearTimeout(this.pingTimeoutId);
    this.ws.close();
  };

  send = (data: any): void => {
    const ws = this.ws;
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    } else if (ws.readyState === ws.CONNECTING) {
      const listener = () => {
        ws.removeEventListener('open', listener);
        ws.send(JSON.stringify(data));
      };
      ws.addEventListener('open', listener);
    }
  };

  private schedulePing = (): void => {
    // Intervals for ping in milliseconds
    const minInterval = 25 * 1000;
    const maxInterval = 35 * 1000;
    const interval = randomInt(minInterval, maxInterval);

    window.clearTimeout(this.pingTimeoutId);
    this.pingTimeoutId = window.setTimeout(this.ping, interval);
  };

  private ping = (): void => {
    if (this.isWebSocketClosed()) {
      this.teardown();
      this.onConnectionLost();
      return;
    }

    this.sendHeartBeat();
    this.schedulePing();
  };

  private isWebSocketClosed = (): boolean => {
    return this.ws.readyState === this.ws.CLOSED;
  };

  private sendHeartBeat = (): void => {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send('');
    }
  };

  private setHandler = (): void => {
    this.ws.onmessage = (message: { data: string }) => {
      const resp = JSON.parse(message.data);
      this.onDataReceived(resp);
    };
  };
}
