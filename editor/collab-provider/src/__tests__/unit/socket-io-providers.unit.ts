import { createSocketIOSocket } from '../../socket-io-provider';

describe('socket io provider', () => {
  it('return io with correct path', () => {
    const url = 'http://localhost:8080/ccollab/sessionId/123';
    const socket = createSocketIOSocket(url);
    expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
  });

  it('attach `auth` tokenRefresh if tokenRefresh function exist', (done) => {
    const url = 'http://localhost:8080/ccollab/sessionId/123';
    const mockToken = 'a-token-for-embedded-confluence';
    const permissionTokenRefresh = async () => mockToken;
    const socket = createSocketIOSocket(url, (cb: (data: object) => void) => {
      permissionTokenRefresh().then((token: string) => {
        cb({ token });
      });
    });
    expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
    expect((socket as any).io.opts.auth).toBeDefined();
    (socket as any).io.opts.auth((token: string) => {
      expect(token).toEqual({ token: mockToken });
      done();
    });
  });
});
