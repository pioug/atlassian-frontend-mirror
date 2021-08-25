import {
  resolveAuth,
  resolveInitialAuth,
} from '../../client/media-store/resolveAuth';
import { MediaStoreError } from '../../client/media-store/error';
import { AsapBasedAuth, AuthProvider } from '@atlaskit/media-core';
import { resolveTimeout } from '../../utils/setTimeoutPromise';

// expires in 1619827800000
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3ZjQ0MDFkNi0wYWJlLTRiNzItYThjZC1iOTMyYzU0M2FlZDAiLCJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpmaWxlOmNhZmRjOTA2LWM3Y2MtNGFhZS1hYzljLTY5YzhlNGE1YTFjNCI6WyJkZWxldGUiLCJyZWFkIl0sInVybjpmaWxlc3RvcmU6Y2h1bms6KiI6WyJyZWFkIiwiY3JlYXRlIl19LCJuYmYiOjE0NDEzMzIwMDAsImV4cCI6MTYxOTgyNzgwMH0.Bdbpv-UAjV87_-yVaVYObdvFtrD1wl-oBXyk6QMMPmc';

const auth: AsapBasedAuth = {
  asapIssuer: 'some-issuer',
  token,
  baseUrl: 'some-url',
};

describe('resolveAuth', () => {
  it('should return resolved Auth from provider', async () => {
    const provider = async () => auth;
    expect(await resolveAuth(provider, {})).toBe(auth);
  });

  it('should throw failedAuthProvider error if provider rejects', async () => {
    const someError = new Error('some-error');
    const provider = () => Promise.reject(someError);
    try {
      await resolveAuth(provider);
    } catch (e) {
      expect(e).toBeInstanceOf(MediaStoreError);
      expect((e as MediaStoreError).reason).toBe('failedAuthProvider');
      expect((e as MediaStoreError).innerError).toBe(someError);
    }
    expect.assertions(3);
  });

  it('should throw authProviderTimedOut error if provider times out', async () => {
    const AUTH_PROVIDER_TIMEOUT = 1;
    const provider = () => resolveTimeout(AUTH_PROVIDER_TIMEOUT + 500, auth);

    try {
      await resolveAuth(provider, {}, AUTH_PROVIDER_TIMEOUT);
    } catch (e) {
      expect(e).toBeInstanceOf(MediaStoreError);
      expect((e as MediaStoreError).reason).toBe('authProviderTimedOut');
    }
    expect.assertions(2);
  });

  // This test is verifying if the consumer bypassed TS checks and managed to provide
  // an Auth provider that actually does not resolve an Auth object.
  it('should throw emptyAuth error if provider resolves undefined', async () => {
    const provider = ((async () => {}) as unknown) as AuthProvider;
    try {
      await resolveAuth(provider);
    } catch (e) {
      expect(e).toBeInstanceOf(MediaStoreError);
      expect((e as MediaStoreError).reason).toBe('emptyAuth');
    }
    expect.assertions(2);
  });
});

describe('resolveInitialAuth', () => {
  it(`should return the auth if it's defined`, () => {
    expect(resolveInitialAuth(auth)).toBe(auth);
  });

  it('should throw missingInitialAuth if the auth is undefined', () => {
    try {
      resolveInitialAuth();
    } catch (e) {
      expect(e).toBeInstanceOf(MediaStoreError);
      expect((e as MediaStoreError).reason).toBe('missingInitialAuth');
    }
    expect.assertions(2);
  });
});
