import { EventEmitter2 } from 'eventemitter2';
import HttpTransport from '../../../../../../protocols/aps/transports/http';
import {
  TextDecoder as TextDecoderNode,
  TextEncoder as TextEncoderNode,
} from 'util';
import { EventType } from '../../../../../../types';
import * as sinon from 'sinon';

const textEncoder = new TextEncoderNode();
const mockResponseWithReader = async (messages: string[]) => {
  const msgSize = messages.length;
  let msgCounter = 0;
  return {
    body: {
      getReader: () => ({
        read: () => {
          return Promise.resolve({
            value: textEncoder.encode(messages[msgCounter++]),
            done: msgCounter >= msgSize,
          });
        },
      }),
    },
  };
};

const mockRequestThatNeverCompletes = async () => ({
  body: {
    getReader: () => ({
      read: () => {
        return new Promise(() => {});
      },
    }),
  },
});

const consumeMessageEvents = async (
  eventEmitter: EventEmitter2,
  expectedNumberOfEvents: number,
) => {
  const messages: { type: any; payload: any }[] = [];
  await new Promise((resolve) => {
    eventEmitter.on(EventType.MESSAGE, (type, payload) => {
      messages.push({ type, payload });
      if (messages.length === expectedNumberOfEvents) {
        resolve(undefined);
      }
    });
  });

  return messages;
};

const restoreStub = (stub: any) => {
  if (stub.restore) {
    stub.restore();
  }
};

describe('HttpTransport', () => {
  const url = new URL('https://mock.com');
  let eventEmitter = new EventEmitter2();

  beforeAll(() => {
    // @ts-ignore
    global.TextDecoder = TextDecoderNode;
  });

  afterAll(() => {
    // @ts-ignore
    global.TextDecoder = undefined;
  });

  afterEach(() => {
    eventEmitter = new EventEmitter2();
    restoreStub(fetch);
  });

  describe('#subscribe', () => {
    it('can consume multiple messages', async () => {
      sinon
        .stub(window, 'fetch')
        .resolves(
          mockResponseWithReader([
            JSON.stringify({ type: 'event', payload: 'hello' }),
            JSON.stringify({ type: 'event', payload: 'goodbye' }),
          ]),
        );

      const httpTransport = new HttpTransport({ url, eventEmitter });

      httpTransport.subscribe(new Set(['channel-1']));

      const [msg1, msg2] = await consumeMessageEvents(eventEmitter, 2);

      expect(msg1).toStrictEqual({ type: 'event', payload: 'hello' });
      expect(msg2).toStrictEqual({ type: 'event', payload: 'goodbye' });

      httpTransport.close();
    });

    it('can consume messages separated by line break', async () => {
      sinon
        .stub(window, 'fetch')
        .resolves(
          mockResponseWithReader([
            JSON.stringify({ type: 'event', payload: 'hello' }) +
              '\n' +
              JSON.stringify({ type: 'event', payload: 'goodbye' }),
          ]),
        );

      const httpTransport = new HttpTransport({ url, eventEmitter });

      httpTransport.subscribe(new Set(['channel-1']));

      const [msg1, msg2] = await consumeMessageEvents(eventEmitter, 2);

      expect(msg1).toStrictEqual({ type: 'event', payload: 'hello' });
      expect(msg2).toStrictEqual({ type: 'event', payload: 'goodbye' });

      httpTransport.close();
    });
  });

  describe('#close', () => {
    it('does not try to reconnect when subscription is closed', () => {
      sinon.stub(window, 'fetch').resolves(mockRequestThatNeverCompletes());

      const httpTransport = new HttpTransport({ url, eventEmitter });

      httpTransport.subscribe(new Set(['channel-1']));

      httpTransport.close();

      // @ts-ignore
      expect(window.fetch.callCount).toBe(1);
    });
  });
});
