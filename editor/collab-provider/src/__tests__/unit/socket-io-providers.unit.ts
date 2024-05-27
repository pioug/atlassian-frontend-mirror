import { createSocketIOSocket } from '../../socket-io-provider';
import { type InitAndAuthData } from '../../types';

describe('Socket io provider', () => {
  const url = 'http://localhost:8080/ccollab/sessionId/123';

  it('return io with correct path', () => {
    const socket = createSocketIOSocket(url);

    expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
  });

  it('attach `auth` tokenRefresh if tokenRefresh function exist', (done) => {
    const mockToken = 'a-token-for-embedded-confluence';
    const permissionTokenRefresh = async () => mockToken;
    const socket = createSocketIOSocket(
      url,
      (cb: (data: InitAndAuthData) => void) => {
        permissionTokenRefresh().then((token: string) => {
          cb({ token, initialized: false });
        });
      },
    );
    expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
    expect((socket as any).io.opts.auth).toBeDefined();
    (socket as any).io.opts.auth((token: string) => {
      expect(token).toEqual({ token: mockToken, initialized: false });
      done();
    });
  });

  describe('Product Information headers', () => {
    it('should set the product header on the socket.io client', () => {
      const socket = createSocketIOSocket(url);

      expect(socket?.io?.opts.extraHeaders).toEqual({
        'x-product': 'unknown',
        'x-subproduct': 'unknown',
      });
    });

    it('should set the product header on the socket.io client', () => {
      const socket = createSocketIOSocket(url, undefined, {
        product: 'confluence',
      });

      expect(socket?.io?.opts.extraHeaders).toEqual({
        'x-product': 'confluence',
        'x-subproduct': 'none',
      });
    });

    it('should set the product and sub-product headers on the socket.io client', () => {
      const socket = createSocketIOSocket(url, undefined, {
        product: 'embeddedConfluence',
        subProduct: 'JSM',
      });

      expect(socket?.io?.opts.extraHeaders).toEqual({
        'x-product': 'embeddedConfluence',
        'x-subproduct': 'JSM',
      });
    });
  });
});
