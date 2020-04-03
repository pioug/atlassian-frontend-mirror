jest.mock('../../../randomInt');

import { Auth } from '@atlaskit/media-core';
import {
  getWsUrl,
  Ws,
  ConnectionLostHandler,
  WebsocketDataReceivedHandler,
} from '../../ws';
import { randomInt } from '../../../randomInt';

jest.useFakeTimers();

describe('getWsUrl', () => {
  it('should use ws protocol for a websocket url if api url uses http', () => {
    const wsUrl = getWsUrl('http://media.api');
    expect(wsUrl).toEqual('ws://media.api/picker/ws/');
  });

  it('should use wss protocol for a websocket url if api url uses https', () => {
    const wsUrl = getWsUrl('https://media.api');
    expect(wsUrl).toEqual('wss://media.api/picker/ws/');
  });

  it('should use wss protocol for a websocket url if api url uses neight http or https', () => {
    const wsUrl = getWsUrl('ftp://media.api');
    expect(wsUrl).toEqual('wss://media.api/picker/ws/');
  });
});

type FakeWebSocketConstrcutor = () => FakeWebSocket;
type WebSocketCloseFunction = () => void;
type WebSocketSendFunction = (data: string) => void;
type WebSocketListenerFunction = (event: string, callback: Function) => void;

interface FakeWebSocket {
  close: WebSocketCloseFunction;
  send: WebSocketSendFunction;
  onmessage: (data: any) => void;
  addEventListener: WebSocketListenerFunction;
  removeEventListener: WebSocketListenerFunction;
  OPEN: string;
  CLOSED: string;
  OPENING: string;
  CONNECTING: string;
  readyState: string;
}

describe('Ws', () => {
  const baseUrl = 'https://media.api';
  const clientId = 'some-id';
  const token = 'some-token';
  const auth: Auth = { clientId, token, baseUrl };

  let onDataReceived: jest.Mock<WebsocketDataReceivedHandler>;
  let onConnectionLost: jest.Mock<ConnectionLostHandler>;

  let webSocketConstructor: FakeWebSocketConstrcutor;
  let webSocket: FakeWebSocket;
  let webSocketClose: jest.Mock<WebSocketCloseFunction>;
  let webSocketSend: jest.Mock<WebSocketSendFunction>;
  let webSocketAddListener: jest.Mock<WebSocketListenerFunction>;
  let webSocketRemoveListener: jest.Mock<WebSocketListenerFunction>;

  let ws: Ws;

  beforeEach(() => {
    webSocketConstructor = jest.fn().mockImplementation(() => {
      webSocketClose = jest.fn<WebSocketCloseFunction, []>();
      webSocketSend = jest.fn<WebSocketSendFunction, []>();
      webSocketAddListener = jest
        .fn<WebSocketListenerFunction, []>()
        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        .mockImplementation((_: string, callback: Function) => callback());
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      webSocketRemoveListener = jest.fn<WebSocketListenerFunction>();

      webSocket = {
        close: webSocketClose,
        send: webSocketSend,
        addEventListener: webSocketAddListener,
        removeEventListener: webSocketRemoveListener,
        CONNECTING: 'wsconnecting',
        OPEN: 'wsopen',
        CLOSED: 'wsclosed',
        OPENING: 'wsopening',
        onmessage: () => {},
        readyState: 'undefined',
      };

      return webSocket;
    });
    (window as any).WebSocket = webSocketConstructor;

    onDataReceived = jest.fn<WebsocketDataReceivedHandler, []>();
    onConnectionLost = jest.fn<ConnectionLostHandler, []>();

    (randomInt as any).mockReturnValue(30 * 1000);
    ws = new Ws(auth, onDataReceived, onConnectionLost);
  });

  afterEach(() => {
    ws.teardown();
    (randomInt as any).mockReset();
  });

  it('should create a websocket using client credentials', () => {
    expect(webSocketConstructor).toHaveBeenCalledTimes(1);
    expect(webSocketConstructor).toHaveBeenCalledWith(
      'wss://media.api/picker/ws/?client=some-id&token=some-token',
    );
  });

  it('should close the websocket when teardown is called', () => {
    ws.teardown();

    expect(webSocketClose).toHaveBeenCalledTimes(1);
  });

  it('should parse data and pass the result to onDataReceived function when data comes to the websocket', () => {
    webSocket.onmessage({ data: '{"a": 12, "b": "abc"}' });

    expect(onDataReceived).toHaveBeenCalledTimes(1);
    expect(onDataReceived).toHaveBeenCalledWith({ a: 12, b: 'abc' });
  });

  it('should not swallow incorrect data error', () => {
    expect(() => {
      webSocket.onmessage({ data: 'abcdefg' });
    }).toThrowError();

    expect(onDataReceived).toHaveBeenCalledTimes(0);
  });

  it('should close websocket and call onConnectionLost if the websocket is in the closed state after 30 seconds', () => {
    webSocket.readyState = webSocket.CLOSED;
    jest.runTimersToTime(30 * 1000);

    expect(webSocketClose).toHaveBeenCalledTimes(1);
    expect(onConnectionLost).toHaveBeenCalledTimes(1);
  });

  it('should send data if the websocket is in the open state', () => {
    webSocket.readyState = webSocket.OPEN;
    ws.send({ foo: 'bar' });

    expect(webSocketSend).toHaveBeenCalledWith('{"foo":"bar"}');
  });

  it('should schedule sending data if the websocket is in the connecting state', () => {
    webSocket.readyState = webSocket.CONNECTING;
    ws.send({ foo: 'bar' });

    expect(webSocketAddListener).toHaveBeenCalledWith(
      'open',
      expect.any(Function),
    );
    expect(webSocketRemoveListener).toHaveBeenCalledWith(
      'open',
      expect.any(Function),
    );
    expect(webSocketSend).toHaveBeenCalledWith('{"foo":"bar"}');
  });

  it('should send ping message if the websocket is in the open state after 30 seconds', () => {
    webSocket.readyState = webSocket.OPEN;
    jest.runTimersToTime(30 * 1000);

    expect(webSocketSend).toHaveBeenCalledTimes(1);
    expect(webSocketSend).toHaveBeenCalledWith('');

    expect(webSocketClose).toHaveBeenCalledTimes(0);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);
  });

  it('should not send ping message and not close if the websocket is in the opening state after 30 seconds', () => {
    webSocket.readyState = webSocket.OPENING;
    jest.runTimersToTime(30 * 1000);

    expect(webSocketSend).toHaveBeenCalledTimes(0);

    expect(webSocketClose).toHaveBeenCalledTimes(0);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);
  });

  it('should close websocket and call onConnectionLost if the websocket became closed after several pings', () => {
    webSocket.readyState = webSocket.OPEN;

    // First ping
    jest.runTimersToTime(30 * 1000);

    expect(webSocketSend).toHaveBeenCalledTimes(1);
    expect(webSocketSend).toHaveBeenCalledWith('');
    webSocketSend.mockReset();
    expect(webSocketClose).toHaveBeenCalledTimes(0);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);

    // Second ping
    jest.runTimersToTime(30 * 1000);

    expect(webSocketSend).toHaveBeenCalledTimes(1);
    expect(webSocketSend).toHaveBeenCalledWith('');
    webSocketSend.mockReset();
    expect(webSocketClose).toHaveBeenCalledTimes(0);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);

    // Third ping
    webSocket.readyState = webSocket.CLOSED;
    jest.runTimersToTime(30 * 1000);

    expect(webSocketClose).toHaveBeenCalledTimes(1);
    expect(onConnectionLost).toHaveBeenCalledTimes(1);
  });

  it('should not send ping messages after teardown() was called', () => {
    ws.teardown();

    webSocket.readyState = webSocket.OPEN;
    jest.runTimersToTime(40 * 1000);

    expect(webSocketSend).toHaveBeenCalledTimes(0);
  });
});
