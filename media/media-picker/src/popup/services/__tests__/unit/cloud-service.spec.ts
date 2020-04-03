jest.mock('uuid/v4', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue('some-scope'),
}));
import { AuthProvider } from '@atlaskit/media-core';
import uuidV4 from 'uuid/v4';
import Postis from 'postis';
import { CloudService } from '../../cloud-service';

interface FakePostis {
  channel: {
    listen: jest.Mock<
      (method: string, callback: (message: any) => void) => void
    >;
    send: jest.Mock<(options: any) => void>;
    ready: jest.Mock<(callback: () => void) => void>;
    destroy: jest.Mock<(callback: () => void) => void>;
  };
  mockClear: () => void;
}

describe('CloudAuthService', () => {
  const userAuthProvider: AuthProvider = () =>
    Promise.resolve({
      clientId: 'some-client-id',
      token: 'some-token',
      baseUrl: 'https://some-api-url',
    });
  const redirectUrl = 'https://some-redirect-url';
  const serviceName = 'dropbox';
  const scope = 'some-scope';
  let windowObject: Partial<Window>;
  let locationSpy: jest.Mock<{}>;
  let windowClose: jest.Mock<{}>;

  beforeEach(() => {
    (Postis as FakePostis).channel.ready.mockImplementationOnce(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      (callback: () => void) => callback(),
    );
    (Postis as FakePostis).channel.listen.mockImplementationOnce(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      (_: string, callback: () => void) => callback(),
    );

    jest.spyOn(window, 'open');
    jest.spyOn(window, 'close');

    locationSpy = jest.fn();
    windowClose = jest.fn();
    windowObject = { close: windowClose };

    Object.defineProperty(windowObject, 'location', {
      set: locationSpy,
    });
    ((window as any).open as jest.Mock<{}>).mockReturnValue(windowObject);
  });

  afterEach(() => {
    (Postis as FakePostis).mockClear();
    (Postis as FakePostis).channel.ready.mockClear();
    (Postis as FakePostis).channel.listen.mockClear();
    (Postis as FakePostis).channel.send.mockClear();
    (Postis as FakePostis).channel.destroy.mockClear();
    ((uuidV4 as unknown) as jest.Mock<{}>).mockClear();
    ((window as any).open as jest.Mock<{}>).mockClear();
    ((window as any).close as jest.Mock<{}>).mockClear();
  });

  it('should pass uuid as a hash in the redirect url', async () => {
    const cloudAuthService = new CloudService(userAuthProvider);

    await expect(
      cloudAuthService.startAuth(redirectUrl, serviceName),
    ).resolves.toBeUndefined();

    expect(uuidV4).toHaveBeenCalledTimes(1);

    expect(window.open).toBeCalledWith('', '_blank');
    expect(locationSpy).toHaveBeenLastCalledWith(
      'https://some-api-url/picker/service/dropbox?' +
        'client=some-client-id&' +
        'token=some-token&' +
        'redirectUrl=https%3A%2F%2Fsome-redirect-url%3FchannelId%3Dsome-scope',
    );
  });

  it('should pass uuid as a scope for the created Postis channel', async () => {
    const cloudAuthService = new CloudService(userAuthProvider);

    await expect(
      cloudAuthService.startAuth(redirectUrl, serviceName),
    ).resolves.toBeUndefined();

    expect(Postis).toHaveBeenCalledTimes(1);
    expect(Postis).toHaveBeenCalledWith({ scope, window: windowObject });
  });

  it('should send "auth-callback-done", destroy the channel, and get service list when receives "auth-callback-received" message', async () => {
    const cloudAuthService = new CloudService(userAuthProvider);
    const { channel } = Postis as FakePostis;

    await expect(
      cloudAuthService.startAuth(redirectUrl, serviceName),
    ).resolves.toBeUndefined();
    expect(channel.listen).toHaveBeenCalledWith(
      'auth-callback-received',
      expect.anything(),
    );
    expect(channel.send).toHaveBeenCalledWith({
      method: 'auth-callback-done',
      params: {},
    });
    expect(channel.destroy).toHaveBeenCalledTimes(1);
  });

  it('should close newly opened window if auth has failed', async () => {
    const userAuthProvider = () =>
      Promise.reject(new Error('something went wrong'));

    const cloudAuthService = new CloudService(userAuthProvider);

    await expect(
      cloudAuthService.startAuth(redirectUrl, serviceName),
    ).rejects.toBeInstanceOf(Error);

    expect(window.open).toBeCalledWith(expect.anything(), '_blank');
    expect(windowClose).toBeCalled();
  });
});
