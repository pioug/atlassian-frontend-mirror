import { createSocketIOCollabProvider } from '../../socket-io-provider';
jest.mock('socket.io-client');
import { Channel } from '../../channel';
jest.mock('../../channel');

const testProviderConfig = {
  url: `http://provider-url:66661`,
  documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};
const clientId = 'some-random-prosmirror-client-Id';

describe('provider unit tests', () => {
  let socket: any;
  let logSpy: jest.SpyInstance;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const channel = new Channel({} as any);
    socket = channel.getSocket()!;
  });
  afterEach(() => {
    logSpy.mockClear();
    jest.clearAllMocks();
  });
  const editorState: any = {
    plugins: [
      {
        key: 'collab$',
        spec: {
          config: {
            clientID: clientId,
          },
        },
      },
    ],
  };

  it('should emit connected event when provider is connected via socketIO', async done => {
    const provider = createSocketIOCollabProvider(testProviderConfig);
    provider.on('connected', ({ sid }) => {
      expect(sid).toBe('sid-123');
      done();
    });
    provider.initialize(() => editorState);
    socket.emit('connected', { sid: 'sid-123' });
  });

  it('should emit init event and trigger sendPresence once provider is connected', async done => {
    let expectedSid: any;
    const sid = 'expected-sid-123';
    const userId = 'user-123';
    const provider = createSocketIOCollabProvider(testProviderConfig);
    const spy = jest.spyOn(provider as any, 'sendPresence');
    provider.on('connected', ({ sid }) => {
      expectedSid = sid;
    });
    provider.on('init', ({ doc, version }: any) => {
      expect(expectedSid).toBe(sid);
      expect(doc).toBe('bla');
      expect(version).toBe(1);
      expect((provider as any).userId).toBe(userId);
      expect(spy).toBeCalled();
      done();
    });
    provider.initialize(() => editorState);
    socket.emit('connected', { sid });
    socket.emit('init', { doc: 'bla', version: 1, userId });
  });
});
