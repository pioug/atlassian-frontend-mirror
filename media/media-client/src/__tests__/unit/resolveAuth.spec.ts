import resolveAuth, {
  TOKEN_MINIMUM_LIFETIME,
} from '../../client/media-store/resolveAuth';
import { MediaStoreError } from '../../client/media-store/error';
import { AsapBasedAuth } from '@atlaskit/media-core';

// expires in 1619827800000
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3ZjQ0MDFkNi0wYWJlLTRiNzItYThjZC1iOTMyYzU0M2FlZDAiLCJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpmaWxlOmNhZmRjOTA2LWM3Y2MtNGFhZS1hYzljLTY5YzhlNGE1YTFjNCI6WyJkZWxldGUiLCJyZWFkIl0sInVybjpmaWxlc3RvcmU6Y2h1bms6KiI6WyJyZWFkIiwiY3JlYXRlIl19LCJuYmYiOjE0NDEzMzIwMDAsImV4cCI6MTYxOTgyNzgwMH0.Bdbpv-UAjV87_-yVaVYObdvFtrD1wl-oBXyk6QMMPmc';

const auth: AsapBasedAuth = {
  asapIssuer: 'some-issuer',
  token: token,
  baseUrl: 'some-url',
};

describe('resolveAuth', () => {
  it('should return resolved Auth from provider', async () => {
    const provider = async () => auth;
    // token near to expire within the threshold
    const now = 1619827800000 - TOKEN_MINIMUM_LIFETIME - 1;
    expect(await resolveAuth(provider, {}, now)).toBe(auth);
  });

  it('should throw tokenExpired error if token expires within the threshold', async () => {
    const provider = async () => auth;
    const now = 1619827800000 - TOKEN_MINIMUM_LIFETIME;
    try {
      await resolveAuth(provider, {}, now);
    } catch (e) {
      expect(e).toBeInstanceOf(MediaStoreError);
      expect((e as MediaStoreError).reason).toBe('tokenExpired');
    }
    expect.assertions(2);
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
});
