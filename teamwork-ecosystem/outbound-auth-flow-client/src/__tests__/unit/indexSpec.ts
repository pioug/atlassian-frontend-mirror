import { auth } from '../..';
import { AuthError } from '../../error';

let authWindow: Window;

// https://github.com/jsdom/jsdom/blob/master/lib/api.js#L199
const windowOptions = { resourceLoader: {} };

describe('auth()', () => {
  beforeEach(() => {
    authWindow = Object.create(Window, windowOptions);
    window.open = jest.fn().mockImplementation(() => {
      return authWindow;
    });
    authWindow.close = () => {};
  });

  it('should call window.open with correct parameters', () => {
    auth('/', 'height=640, width=480');

    return expect(window.open).toHaveBeenCalledWith(
      '/',
      '/',
      'height=640, width=480',
    );
  });

  it('should reject when the window is closed', () => {
    window.open = () => {
      const win = Object.create(Window, windowOptions);
      Object.defineProperty(win, 'closed', { value: true });
      Object.defineProperty(win, 'close', { value: jest.fn() });
      return win;
    };

    const promise = auth('/');

    return expect(promise).rejects.toMatchObject(
      new AuthError('The auth window was closed', 'auth_window_closed'),
    );
  });

  it('should reject when the message indiciates failure', () => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:failure',
          message: 'Where was the earth shattering kaboom?',
          errorType: 'access_denied',
        },
        source: authWindow,
      }),
    );

    return expect(promise).rejects.toMatchObject(
      new AuthError('Where was the earth shattering kaboom?', 'access_denied'),
    );
  });

  it('should not reject when the message indicates success and is from another window', (done) => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:success',
        },
        source: Object.create(Window, windowOptions),
      }),
    );

    promise.then(
      () => done.fail(),
      () => done.fail(),
    );

    window.setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, 500);
  });

  it('should not reject when the message indicates failure and is from another window', (done) => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:failure',
          message: 'Uh oh.',
          errorType: 'invalid_request',
        },
        source: Object.create(Window, windowOptions),
      }),
    );

    promise.then(
      () => done.fail(),
      () => done.fail(),
    );

    window.setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, 500);
  });

  it('should resolve when the message indicates success and it is from the same window', () => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:success',
        },
        source: authWindow,
      }),
    );

    return expect(promise).resolves.toBeUndefined();
  });
});
