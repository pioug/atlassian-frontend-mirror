import { EventEmitter2 } from 'eventemitter2';
import NativeBridge from '../../../web-to-native/bridge';
import { CollabSocket } from '../../collab-socket';

jest.mock('../../../web-to-native');

const path = 'http://atlassian.com';

describe('Collab Socket', () => {
  let toNativeBridge: jest.Mocked<NativeBridge>;
  beforeEach(() => {
    ({ toNativeBridge } = require('../../../web-to-native'));
  });

  afterEach(() => {
    toNativeBridge.connectToCollabService.mockClear();
    toNativeBridge.disconnectFromCollabService.mockClear();
    toNativeBridge.emitCollabChanges.mockClear();
    toNativeBridge.trackEvent.mockClear();
  });

  it('should connect to bridge on constructor', function () {
    new CollabSocket(path);

    expect(toNativeBridge.connectToCollabService).toHaveBeenCalledWith(path);
  });

  it('should disconnect from bridge on close', function () {
    const socket = new CollabSocket(path);

    socket.close();

    expect(toNativeBridge.disconnectFromCollabService).toHaveBeenCalled();
  });

  it('should emit to bridge on emit', function () {
    const socket = new CollabSocket(path);

    socket.emit('test', 'foo', 'bar');

    expect(toNativeBridge.emitCollabChanges).toHaveBeenCalledWith(
      'test',
      '["foo","bar"]',
    );
  });

  it('should stored the session id from connect event', function () {
    const socket = new CollabSocket(path);
    const id = 'unique-id';

    socket.received('connect', id);

    expect(socket.id).toEqual(id);
  });

  it('should parse the arguments and pass it to the connected event', function (next) {
    const socket = new CollabSocket(path);
    const originalArgs = {
      a: 'string',
      b: ['arr1', 'arr2'],
      c: {
        d: 1,
      },
    };

    socket.on('custom-event', (args: object) => {
      expect(args).toEqual(originalArgs);
      next();
    });

    socket.received('custom-event', JSON.stringify(originalArgs));
  });

  describe('Error Handling', () => {
    it('should no throw with invalid payload', function () {
      const socket = new CollabSocket(path);

      expect(() =>
        socket.received('custom-event', undefined as any),
      ).not.toThrow();
      expect(() =>
        socket.received('custom-event', 'foo!bar/baz'),
      ).not.toThrow();
    });

    it('should send track event when the socket receive an invalid payload', function () {
      const socket = new CollabSocket(path);
      socket.received('connect', 'unique-id');

      socket.received('custom-event', undefined as any);
      socket.received('custom-event', 'foo!bar/baz');

      expect(toNativeBridge.trackEvent).toHaveBeenCalledTimes(2);
      expect(toNativeBridge.trackEvent).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          action: 'invalidCollabEventPayload',
          actionSubject: 'editor',
          actionSubjectId: 'collab',
          attributes: {
            eventName: 'custom-event',
            error: 'SyntaxError: Unexpected token u in JSON at position 0',
          },
          eventType: 'track',
        }),
      );
      expect(toNativeBridge.trackEvent).toHaveBeenNthCalledWith(
        2,
        JSON.stringify({
          action: 'invalidCollabEventPayload',
          actionSubject: 'editor',
          actionSubjectId: 'collab',
          attributes: {
            eventName: 'custom-event',
            payload: 'foo!bar/baz',
            error: 'SyntaxError: Unexpected token o in JSON at position 1',
          },
          eventType: 'track',
        }),
      );
    });

    it('should not emit an event received with an invalid payload', function () {
      const socket = new CollabSocket(path);
      const emitSpy = jest.spyOn(
        (socket as any).emitter as EventEmitter2,
        'emit',
      );

      socket.received('connect', 'unique-id');

      emitSpy.mockClear();

      socket.received('custom-event', 'foo!bar/baz');

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should send track event when the socket receive an event before `connect` event', function () {
      const socket = new CollabSocket(path);

      socket.received('custom-event', '{}');

      expect(toNativeBridge.trackEvent).toHaveBeenCalledTimes(1);
      expect(toNativeBridge.trackEvent).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          action: 'invalidCollabEventWithoutSocket',
          actionSubject: 'editor',
          actionSubjectId: 'collab',
          attributes: {
            eventName: 'custom-event',
            payload: '{}',
          },
          eventType: 'track',
        }),
      );
    });

    it('should send track event when attempt to get the `socket.id` before connect event', function () {
      const socket = new CollabSocket(path);

      socket.id;

      expect(toNativeBridge.trackEvent).toHaveBeenCalledTimes(1);
      expect(toNativeBridge.trackEvent).toHaveBeenCalledWith(
        JSON.stringify({
          action: 'invalidAccessToSocketId',
          actionSubject: 'editor',
          actionSubjectId: 'collab',
          eventType: 'track',
        }),
      );
    });

    it('should not send track event when the socket receive an event after `connect` event', function () {
      const socket = new CollabSocket(path);
      socket.received('connect', 'unique-id');

      socket.received('custom-event', '{}');

      expect(toNativeBridge.trackEvent).not.toHaveBeenCalled();
    });

    it('should not send track event when attempt to get the `socket.id` after `connect` event', function () {
      const socket = new CollabSocket(path);
      socket.received('connect', 'unique-id');
      socket.id;

      expect(toNativeBridge.trackEvent).not.toHaveBeenCalled();
    });
  });
});
