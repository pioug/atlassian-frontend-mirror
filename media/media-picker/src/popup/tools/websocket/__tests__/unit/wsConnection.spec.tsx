jest.mock('../../ws');

import { Auth } from '@atlaskit/media-core';
import { WsConnection } from '../../wsConnection';
import {
  Ws,
  ConnectionLostHandler,
  WebsocketDataReceivedHandler,
} from '../../ws';

jest.useFakeTimers();

describe('WsConnection', () => {
  const baseUrl = 'some-api';
  const auth: Auth = { clientId: 'some-id', token: 'some-token', baseUrl };

  let onDataReceived: WebsocketDataReceivedHandler;
  let onConnectionLost: ConnectionLostHandler;

  beforeEach(() => {
    onDataReceived = jest.fn();
    onConnectionLost = jest.fn();
  });

  afterEach(() => {
    (Ws as any).mockReset();
  });

  it('should make only one call to Ws constructor if it returns successfully', () => {
    // eslint-disable-next-line no-unused-expressions
    new WsConnection(auth, onDataReceived, onConnectionLost);
    const ws: any = Ws;

    jest.runTimersToTime(30 * 1000);

    expect(ws).toHaveBeenCalledTimes(1);
    expect(ws).toHaveBeenCalledWith(
      auth,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should make only 4 calls to Ws constructor with 1 second interval if it returns successfully only on the fourth call', () => {
    (Ws as any).mockImplementation(() => {
      throw new Error('Some-error');
    });

    // eslint-disable-next-line no-unused-expressions
    new WsConnection(auth, onDataReceived, onConnectionLost);
    expect(Ws).toHaveBeenCalledTimes(1);

    jest.runTimersToTime(1000);
    expect(Ws).toHaveBeenCalledTimes(2);

    jest.runTimersToTime(1000);
    expect(Ws).toHaveBeenCalledTimes(3);

    (Ws as any).mockReset();
    jest.runTimersToTime(1000);
    expect(Ws).toHaveBeenCalledTimes(1);

    jest.runTimersToTime(10 * 1000);
    expect(Ws).toHaveBeenCalledTimes(1);
  });

  it('should make 10 calls to Ws constructor if Ws constructor permanently fails', () => {
    (Ws as any).mockImplementation(() => {
      throw new Error('Some-error');
    });

    // eslint-disable-next-line no-unused-expressions
    new WsConnection(auth, onDataReceived, onConnectionLost);

    jest.runTimersToTime(60 * 1000);
    expect(Ws).toHaveBeenCalledTimes(10);
  });

  it('should stop making calls after teardown was called and Ws the constructor permanently fails', () => {
    (Ws as any).mockImplementation(() => {
      throw new Error('Some-error');
    });

    const wsConnection = new WsConnection(
      auth,
      onDataReceived,
      onConnectionLost,
    );

    jest.runTimersToTime(4 * 1000);
    wsConnection.teardown();
    expect(Ws).toHaveBeenCalledTimes(5);

    jest.runTimersToTime(60 * 1000);
    expect(Ws).toHaveBeenCalledTimes(5);
  });

  it('should report about the connection as lost after 5 minutes of idle', () => {
    // eslint-disable-next-line no-unused-expressions
    new WsConnection(auth, onDataReceived, onConnectionLost);

    expect(Ws).toHaveBeenCalledTimes(1);

    jest.runTimersToTime(3 * 60 * 1000);

    expect(onConnectionLost).toHaveBeenCalledTimes(1);
  });

  it('should reset idle timeout when data comes to the websocket', () => {
    // eslint-disable-next-line no-unused-expressions
    new WsConnection(auth, onDataReceived, onConnectionLost);
    const dataReceivedHandler = (Ws as any).mock.calls[0][1];

    jest.runTimersToTime(2 * 60 * 1000);
    dataReceivedHandler({});

    jest.runTimersToTime(1 * 60 * 1000);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);

    jest.runTimersToTime(1 * 60 * 1000);
    dataReceivedHandler({});

    jest.runTimersToTime(2 * 60 * 1000);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);

    jest.runTimersToTime(1 * 60 * 1000);
    expect(onConnectionLost).toHaveBeenCalledTimes(1);
  });

  it('should cancel idle timeout when teardown is called', () => {
    const fakeWs = {
      teardown: jest.fn(),
    };
    (Ws as any).mockImplementation(() => fakeWs);

    const wsConnection = new WsConnection(
      auth,
      onDataReceived,
      onConnectionLost,
    );
    wsConnection.teardown();

    jest.runTimersToTime(4 * 60 * 1000);
    expect(onConnectionLost).toHaveBeenCalledTimes(0);
  });

  it('should send data when the websocket is open', () => {
    const fakeWs = {
      send: jest.fn(),
    };
    (Ws as any).mockImplementation(() => fakeWs);

    const wsConnection = new WsConnection(
      auth,
      onDataReceived,
      onConnectionLost,
    );
    const data = { foo: 'bar' };
    wsConnection.send(data);

    expect(fakeWs.send).toHaveBeenCalledTimes(1);
    expect(fakeWs.send).toHaveBeenCalledWith(data);
  });

  it('should throw an error when the websocket is closed', () => {
    const fakeWs = {
      teardown: jest.fn(),
      send: jest.fn(),
    };
    (Ws as any).mockImplementation(() => fakeWs);

    const wsConnection = new WsConnection(
      auth,
      onDataReceived,
      onConnectionLost,
    );
    wsConnection.teardown();
    expect(() => wsConnection.send({})).toThrow(
      'WebSocket connection has been closed',
    );
  });
});
