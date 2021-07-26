import resolveAuth from '../../client/media-store/resolveAuth';
import { MediaStoreError } from '../../client/media-store/error';
import { AsapBasedAuth } from '@atlaskit/media-core';

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
});
