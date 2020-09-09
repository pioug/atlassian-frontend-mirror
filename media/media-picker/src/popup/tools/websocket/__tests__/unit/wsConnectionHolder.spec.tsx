jest.mock('../../wsConnection');

import { Auth } from '@atlaskit/media-core';
import { WsConnectionHolder } from '../../wsConnectionHolder';
import { WsConnection } from '../../wsConnection';
import { ConnectionLostHandler, WebsocketDataReceivedHandler } from '../../ws';
import { WsMessageData } from '../../wsMessageData';
import { WsActivityEvents } from '../../wsActivity';

type TeardownFunction = () => void;
type SendFunction = (data: any) => void;

interface FakeWsConnection {
  onDataReceived: WebsocketDataReceivedHandler;
  onConnectionLost: ConnectionLostHandler;
  teardown: TeardownFunction;
  send: SendFunction;
}

describe('WsConnectionHolder', () => {
  const baseUrl = 'https://media.api';
  const auth: Auth = { clientId: 'id', token: 'token', baseUrl };

  describe('connection handling', () => {
    let holder: WsConnectionHolder;

    beforeEach(() => {
      holder = new WsConnectionHolder(auth);
    });

    afterEach(() => {
      (WsConnection as any).mockReset();
    });

    it('should not create a connection when constructed', () => {
      expect(WsConnection).toHaveBeenCalledTimes(0);
    });

    it('should open a connection when a new activity added', () => {
      const activity = createActivity();

      holder.openConnection(activity);

      expect(WsConnection).toHaveBeenCalledTimes(1);
      expect((WsConnection as any).mock.calls[0][0]).toEqual(auth);
    });

    it('should open only one connection when two activities are added', () => {
      const first = createActivity();
      const second = createActivity();

      holder.openConnection(first);
      holder.openConnection(second);

      expect(WsConnection).toHaveBeenCalledTimes(1);
    });

    it('should close the connection after activity is complete', () => {
      let connection = {
        teardown: jest.fn<TeardownFunction, []>(),
      };
      (WsConnection as any).mockImplementation(() => {
        return connection;
      });

      const activity = createActivity();
      holder.openConnection(activity);

      expect(WsConnection).toHaveBeenCalledTimes(1);

      activity.handlers['Completed'](activity);
      expect(connection.teardown).toHaveBeenCalledTimes(1);
    });

    it('should close the connection after all added activities are complete', () => {
      let connection = {
        teardown: jest.fn<TeardownFunction, []>(),
      };
      (WsConnection as any).mockImplementation(() => {
        return connection;
      });

      const first = createActivity();
      const second = createActivity();
      holder.openConnection(first);
      holder.openConnection(second);

      expect(WsConnection).toHaveBeenCalledTimes(1);

      first.handlers['Completed'](first);
      expect(connection.teardown).toHaveBeenCalledTimes(0);

      second.handlers['Completed'](second);
      expect(connection.teardown).toHaveBeenCalledTimes(1);
    });

    it('should recreate the connection when new activity is added after previous were completed', () => {
      const first = createActivity();
      const second = createActivity();

      holder.openConnection(first);
      holder.openConnection(second);
      expect(WsConnection).toHaveBeenCalledTimes(1);

      first.handlers['Completed'](first);
      second.handlers['Completed'](second);

      const third = createActivity();
      holder.openConnection(third);
      expect(WsConnection).toHaveBeenCalledTimes(2);
    });

    it('should reuse the connection if not all the activities were completed', () => {
      const first = createActivity();
      const second = createActivity();

      holder.openConnection(first);
      holder.openConnection(second);
      expect(WsConnection).toHaveBeenCalledTimes(1);

      first.handlers['Completed'](first);

      const third = createActivity();
      holder.openConnection(third);
      expect(WsConnection).toHaveBeenCalledTimes(1);
    });
  });

  describe('passing data from websocket to the activities', () => {
    let holder: WsConnectionHolder;
    let wsConnection: FakeWsConnection;

    const data: WsMessageData = {
      uploadId: 'some-tenant-file-id',
      type: 'RemoteUploadProgress',
    };

    beforeEach(() => {
      holder = new WsConnectionHolder(auth);
      (WsConnection as any).mockImplementation(
        (
          _: Auth,
          onDataReceived: WebsocketDataReceivedHandler,
          onConnectionLost: ConnectionLostHandler,
        ): FakeWsConnection => {
          wsConnection = {
            onDataReceived,
            onConnectionLost,
            teardown: jest.fn<TeardownFunction, []>(),
            send: jest.fn<SendFunction, []>(),
          };

          return wsConnection;
        },
      );
    });

    afterEach(() => {
      (WsConnection as any).mockReset();
    });

    it('should pass data from websocket to stored activities', () => {
      const first = createActivity();
      const second = createActivity();
      holder.openConnection(first);
      holder.openConnection(second);

      wsConnection.onDataReceived(data);

      expect(first.processWebSocketData).toHaveBeenCalledTimes(1);
      expect(first.processWebSocketData).toHaveBeenCalledWith(data);
      expect(second.processWebSocketData).toHaveBeenCalledTimes(1);
      expect(second.processWebSocketData).toHaveBeenCalledWith(data);
    });

    it('should not pass data from websocket to completed activities', () => {
      const first = createActivity();
      const second = createActivity();
      holder.openConnection(first);
      holder.openConnection(second);

      first.handlers['Completed'](first);
      wsConnection.onDataReceived(data);

      expect(first.processWebSocketData).toHaveBeenCalledTimes(0);
      expect(second.processWebSocketData).toHaveBeenCalledTimes(1);
      expect(second.processWebSocketData).toHaveBeenCalledWith(data);
    });

    it('should send data when the websocket is open', () => {
      const activity = createActivity();
      holder.openConnection(activity);

      const data = { foo: 'bar' };
      holder.send({ ...data });

      expect(wsConnection.send).toHaveBeenCalledTimes(1);
      expect(wsConnection.send).toHaveBeenCalledWith(data);
    });

    it('should throw an error when the websocket is closed', () => {
      expect(() => holder.send({})).toThrow(
        'WebSocket connection has been closed',
      );
    });
  });

  // Helper function that creates an activity with mocked methods
  const createActivity = () => {
    const handlers: { [event: string]: (activity: any) => void } = {};

    const fakeActivity = {
      receiveNotifyId: jest.fn(),
      processWebSocketData: jest.fn(),
      connectionLost: jest.fn(),

      handlers,
      on: jest.fn(),
      off: jest.fn(),
    };

    fakeActivity.on.mockImplementation(function (
      event: keyof WsActivityEvents,
      handler: any,
    ) {
      fakeActivity.handlers[event] = handler;
    });

    return fakeActivity;
  };
});
