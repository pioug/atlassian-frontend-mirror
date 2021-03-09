import { createSocketIOSocket } from '../../socket-io-provider';

describe('socket io provider', () => {
  it('return io with correct path', () => {
    const url = 'http://localhost:8080/ccollab/sessionId/123';
    const socket = createSocketIOSocket(url);
    expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
  });

  it('attach x-token if tokenRefresh function exist', () => {
    const url = 'http://localhost:8080/ccollab/sessionId/123';
    const permissionToken = {
      initializationToken: 'blablabla',
      tokenRefresh: jest
        .fn()
        .mockResolvedValue('a-token-for-embedded-confluence'),
    };
    const socket = createSocketIOSocket(
      url,
      permissionToken.initializationToken,
    );
    expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
    expect(
      (socket as any).io.opts.transportOptions.polling.extraHeaders,
    ).toEqual({
      'x-token': 'blablabla',
    });
  });
});
